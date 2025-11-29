import { IsEmail, IsString, IsNumber } from 'class-validator';
export class PayloadDto {
  @IsNumber()
  id: number;

  @IsEmail()
  email: string;

  @IsString()
  role: string;

  @IsString()
  userName: string | null;
}
