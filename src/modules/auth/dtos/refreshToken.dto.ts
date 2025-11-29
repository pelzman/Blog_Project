import { IsNumber, IsString } from 'class-validator';

export class RefereshDto {
  @IsNumber()
  userId: number;

  @IsString()
  refreshToken: string;
}
