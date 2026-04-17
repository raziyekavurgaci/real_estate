import { IsEnum, IsNotEmpty } from 'class-validator';
import { TransactionStage } from '../schemas/transaction.schema';

export class UpdateStageDto {
  @IsEnum(TransactionStage)
  @IsNotEmpty()
  stage: TransactionStage;
}
