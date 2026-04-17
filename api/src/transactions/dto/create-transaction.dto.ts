import { IsMongoId, IsNotEmpty } from 'class-validator';

export class CreateTransactionDto {
  @IsMongoId()
  @IsNotEmpty()
  listingId: string;

  @IsMongoId()
  @IsNotEmpty()
  sellingAgentId: string;
}
