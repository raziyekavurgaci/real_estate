import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { Transaction, TransactionStage, CommissionBreakdown } from './schemas/transaction.schema';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateStageDto } from './dto/update-stage.dto';
import { Listing } from '../listings/schemas/listing.schema';
import { User, UserRole } from '../users/schemas/user.schema';
import { Types } from 'mongoose';

const STAGE_ORDER: TransactionStage[] = [
  TransactionStage.AGREEMENT,
  TransactionStage.EARNEST_MONEY,
  TransactionStage.TITLE_DEED,
  TransactionStage.COMPLETED,
];

@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel(Transaction.name) private transactionModel: Model<Transaction>,
    @InjectModel(Listing.name) private listingModel: Model<Listing>,
    @InjectModel(User.name) private userModel: Model<User>,
    private configService: ConfigService,
  ) {}

  async create(dto: CreateTransactionDto): Promise<Transaction> {
    const listing = await this.listingModel.findById(dto.listingId);
    if (!listing) throw new NotFoundException('İlan bulunamadı.');

    const commissionRate = this.configService.get<number>('COMMISSION_RATE') ?? 0.03;
    const totalServiceFee = listing.price * Number(commissionRate);

    const transaction = new this.transactionModel({
      listing: dto.listingId,
      listingAgent: listing.listingAgent,
      sellingAgent: dto.sellingAgentId,
      totalServiceFee,
    });

    return transaction.save();
  }

  async findAll(userId: string, role: string): Promise<Transaction[]> {
    let filter: Record<string, unknown> = {};

    if (role === UserRole.AGENT) {
      // AGENT: Sadece kendi sattığı işlemleri görür
      filter = { sellingAgent: userId };
    } else if (role === UserRole.AGENCY) {
      // AGENCY: Önce kendi acentesine bağlı agentları bul
      const agents = await this.userModel
        .find({ agency: userId })
        .select('_id')
        .exec();
      const agentIds = agents.map((a) => a._id as Types.ObjectId);
      filter = { sellingAgent: { $in: agentIds } };
    }

    return this.transactionModel
      .find(filter)
      .populate('listing')
      .populate('sellingAgent', '-refreshToken')
      .populate('listingAgent', '-refreshToken')
      .exec();
  }

  async findOne(id: string): Promise<Transaction> {
    const transaction = await this.transactionModel
      .findById(id)
      .populate('listing')
      .populate('sellingAgent', '-refreshToken')
      .populate('listingAgent', '-refreshToken')
      .exec();

    if (!transaction) throw new NotFoundException('İşlem bulunamadı.');
    return transaction;
  }

  async updateStage(id: string, dto: UpdateStageDto): Promise<Transaction> {
    const transaction = await this.transactionModel.findById(id);
    if (!transaction) throw new NotFoundException('İşlem bulunamadı.');

    // Sıra kontrolü: Sadece bir sonraki aşamaya geçilebilir
    const currentIndex = STAGE_ORDER.indexOf(transaction.stage);
    const newIndex = STAGE_ORDER.indexOf(dto.stage);

    if (newIndex !== currentIndex + 1) {
      throw new BadRequestException(
        `Geçersiz aşama geçişi. Mevcut aşama: "${transaction.stage}", bir sonraki olması gereken: "${STAGE_ORDER[currentIndex + 1]}".`,
      );
    }

    transaction.stage = dto.stage;

    if (dto.stage === TransactionStage.COMPLETED) {
      transaction.commission = this.calculateCommission(transaction);
    }

    return transaction.save();
  }

  private calculateCommission(transaction: Transaction): CommissionBreakdown {
    const fee = transaction.totalServiceFee;
    const agencyShare = fee * 0.5;

    const listingAgentId = String(transaction.listingAgent);
    const sellingAgentId = String(transaction.sellingAgent);

    if (listingAgentId === sellingAgentId) {
      // Senaryo 1
      return {
        agencyShare,
        listingAgentShare: fee * 0.5,
        sellingAgentShare: 0,
      };
    } else {
      // Senaryo 2
      return {
        agencyShare,
        listingAgentShare: fee * 0.25,
        sellingAgentShare: fee * 0.25,
      };
    }
  }
}
