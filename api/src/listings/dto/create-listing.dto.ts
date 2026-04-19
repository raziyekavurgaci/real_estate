import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateListingDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsString()
  @IsNotEmpty()
  location: string;

  // Güvenlik açısından bunu genellikle auth token'dan (req.user.sub) alırız,
  // ancak DTO'da da tip doğrulaması için string olarak bulundurabiliriz.
  // Çoğu durumda controller seviyesinde eklenecektir.
  @IsString()
  @IsOptional()
  listingAgent?: string;
}
