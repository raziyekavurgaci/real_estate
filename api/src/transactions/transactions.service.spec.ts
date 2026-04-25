import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsService } from './transactions.service';
import { getModelToken } from '@nestjs/mongoose';
import { Transaction, TransactionStage } from './schemas/transaction.schema';
import { Listing } from '../listings/schemas/listing.schema';
import { User } from '../users/schemas/user.schema';
import { ConfigService } from '@nestjs/config';
import { BadRequestException } from '@nestjs/common';

const mockTransactionModel = {
  find: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
};

const mockListingModel = {
  findById: jest.fn(),
};

const mockUserModel = {
  find: jest.fn(),
};

const mockConfigService = {
  get: jest.fn(),
};

describe('TransactionsService', () => {
  let service: TransactionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsService,
        {
          provide: getModelToken(Transaction.name),
          useValue: mockTransactionModel,
        },
        {
          provide: getModelToken(Listing.name),
          useValue: mockListingModel,
        },
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<TransactionsService>(TransactionsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Commission Rules (Financial Breakdown)', () => {
    it('Scenario 1: Listing and selling agent are the SAME person (50% agency, 50% agent)', () => {
      const transaction = {
        totalServiceFee: 10000,
        listingAgent: 'agent-one-id',
        sellingAgent: 'agent-one-id',
      } as any;

      const commission = (service as any).calculateCommission(transaction);

      expect(commission.agencyShare).toBe(5000);
      expect(commission.listingAgentShare).toBe(5000);
      expect(commission.sellingAgentShare).toBe(0);
    });

    it('Scenario 2: Listing and selling agents are DIFFERENT (50% agency, 25% listing, 25% selling)', () => {
      const transaction = {
        totalServiceFee: 10000,
        listingAgent: 'agent-one-id',
        sellingAgent: 'agent-two-id',
      } as any;

      const commission = (service as any).calculateCommission(transaction);

      expect(commission.agencyShare).toBe(5000);
      expect(commission.listingAgentShare).toBe(2500);
      expect(commission.sellingAgentShare).toBe(2500);
    });
  });

  describe('Stage Transitions', () => {
    it('should successfully update to the next valid stage', async () => {
      const mockTx = {
        stage: TransactionStage.AGREEMENT,
        save: jest.fn().mockResolvedValue({ stage: TransactionStage.EARNEST_MONEY }),
      };
      mockTransactionModel.findById.mockResolvedValue(mockTx);

      const result = await service.updateStage('tx1', { stage: TransactionStage.EARNEST_MONEY });

      expect(mockTx.stage).toBe(TransactionStage.EARNEST_MONEY);
      expect(mockTx.save).toHaveBeenCalled();
    });

    it('should dynamically calculate commission ONLY when stage becomes COMPLETED', async () => {
      const mockTx = {
        stage: TransactionStage.TITLE_DEED,
        totalServiceFee: 10000,
        listingAgent: 'agent1',
        sellingAgent: 'agent2',
        save: jest.fn().mockImplementation(function() { return this; }),
      };
      mockTransactionModel.findById.mockResolvedValue(mockTx);

      const result = await service.updateStage('tx1', { stage: TransactionStage.COMPLETED });

      expect(result.stage).toBe(TransactionStage.COMPLETED);
      expect(result.commission).toBeDefined();
      expect(result.commission.agencyShare).toBe(5000);
      expect(result.commission.listingAgentShare).toBe(2500);
      expect(result.commission.sellingAgentShare).toBe(2500);
      expect(mockTx.save).toHaveBeenCalled();
    });

    it('should throw BadRequestException if transition skips a stage (e.g. Agreement -> Title Deed)', async () => {
      const mockTx = {
        stage: TransactionStage.AGREEMENT,
      };
      mockTransactionModel.findById.mockResolvedValue(mockTx);

      await expect(service.updateStage('tx1', { stage: TransactionStage.TITLE_DEED }))
        .rejects
        .toThrow(BadRequestException);
    });

    it('should throw BadRequestException if transition goes backwards (e.g. Title Deed -> Agreement)', async () => {
      const mockTx = {
        stage: TransactionStage.TITLE_DEED,
      };
      mockTransactionModel.findById.mockResolvedValue(mockTx);

      await expect(service.updateStage('tx1', { stage: TransactionStage.AGREEMENT }))
        .rejects
        .toThrow(BadRequestException);
    });
  });
});
