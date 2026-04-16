import { IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  fullName?: string;

  @IsString()
  @IsOptional()
  @MinLength(6, { message: 'Şifre en az 6 karakter olmalıdır.' })
  password?: string;
}
