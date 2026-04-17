import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum TransactionStage {
  AGREEMENT = 'agreement',
  EARNEST_MONEY = 'earnest_money',
  TITLE_DEED = 'title_deed',
  COMPLETED = 'completed',
}

// Proper nested Mongoose schema - shape validate edilir
@Schema({ _id: false })
export class CommissionBreakdown {
  @Prop({ required: true, type: Number })
  agencyShare: number;

  @Prop({ required: true, type: Number })
  listingAgentShare: number;

  @Prop({ required: true, type: Number })
  sellingAgentShare: number;
}

export const CommissionBreakdownSchema = SchemaFactory.createForClass(CommissionBreakdown);

@Schema({ timestamps: true, versionKey: false })
export class Transaction extends Document {
  // Runtime'da ObjectId, populate sonrası ilgili doküman
  @Prop({ type: Types.ObjectId, ref: 'Listing', required: true })
  listing: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  listingAgent: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  sellingAgent: Types.ObjectId;

  @Prop({
    type: String,
    enum: TransactionStage,
    default: TransactionStage.AGREEMENT,
  })
  stage: TransactionStage;

  @Prop({ required: true, type: Number })
  totalServiceFee: number;

  // Nested schema kullanılıyor - field shape garanti altında
  // Business rule: Sadece stage === COMPLETED olduğunda service tarafından doldurulur
  @Prop({ type: CommissionBreakdownSchema })
  commission: CommissionBreakdown;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
