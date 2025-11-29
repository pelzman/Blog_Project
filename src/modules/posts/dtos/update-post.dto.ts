import { IsString, MaxLength } from "class-validator";

export class UpdatePostDTO {
     @IsString()
     @MaxLength(30, { message: 'reached the text limit' })
     title: string;
     @IsString()
     content: string;
     @IsString()
     excerpt: string;
  
  
}