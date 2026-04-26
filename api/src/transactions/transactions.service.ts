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

    // Aynı ilan için zaten aktif bir işlem var mı kontrol et
    const existing = await this.transactionModel.findOne({
      listing: dto.listingId,
      stage: { $ne: TransactionStage.COMPLETED },
    });
    if (existing) {
      throw new BadRequestException(
        'Bu ilan için zaten devam eden aktif bir işlem bulunmaktadır.',
      );
    }

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
    const filter = await this.buildUserFilter(userId, role);

    return this.transactionModel
      .find(filter)
      .populate('listing')
      .populate('sellingAgent', '-refreshToken')
      .populate('listingAgent', '-refreshToken')
      .exec();
  }

  async getStats(userId: string, role: string): Promise<{
    active: number;
    completed: number;
    totalEarned: number;
  }> {
    const filter = await this.buildUserFilter(userId, role);

    const transactions = await this.transactionModel
      .find(filter)
      .select('stage commission totalServiceFee listingAgent sellingAgent')
      .exec();

    const active = transactions.filter((t) => t.stage !== TransactionStage.COMPLETED).length;
    const completed = transactions.filter((t) => t.stage === TransactionStage.COMPLETED).length;

    let totalEarned = 0;
    for (const tx of transactions) {
      if (tx.stage !== TransactionStage.COMPLETED || !tx.commission) continue;

      if (role === UserRole.AGENCY) {
        totalEarned += tx.commission.agencyShare ?? 0;
      } else {
        // Agent: listing agent VE/VEYA selling agent olabileceği için her ikisini kontrol et
        const isListingAgent = String(tx.listingAgent) === userId;
        const isSellingAgent = String(tx.sellingAgent) === userId;
        if (isListingAgent && isSellingAgent) {
          // Hem listing hem selling: tüm agent payı bu kişide
          totalEarned += tx.commission.listingAgentShare ?? 0;
        } else {
          if (isListingAgent) totalEarned += tx.commission.listingAgentShare ?? 0;
          if (isSellingAgent) totalEarned += tx.commission.sellingAgentShare ?? 0;
        }
      }
    }

    console.log(`[getStats] userId=${userId} role=${role} foundTransactions=${transactions.length} filter=${JSON.stringify(filter)}`);

    return { active, completed, totalEarned };
  }

  private async buildUserFilter(
    userId: string,
    role: string,
  ): Promise<Record<string, unknown>> {
    if (role === UserRole.AGENT) {
      // AGENT: hem sattığı hem ilanını verdiği işlemleri görsün
      return {
        $or: [{ sellingAgent: userId }, { listingAgent: userId }],
      };
    } else if (role === UserRole.AGENCY) {
      const agents = await this.userModel
        .find({ agency: userId })
        .select('_id')
        .exec();
      const agentIds = agents.map((a) => a._id as Types.ObjectId);
      // AGENCY: altındaki agentların hem listing hem selling olduğu işlemlerin hepsi
      return {
        $or: [
          { sellingAgent: { $in: agentIds } },
          { listingAgent: { $in: agentIds } },
        ],
      };
    }
    return {};
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
