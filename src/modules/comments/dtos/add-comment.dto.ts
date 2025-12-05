import { IsNotEmpty, IsString } from 'class-validator';

export class AddCommentDTO {
  @IsString()
  @IsNotEmpty()
  content: string;
}
