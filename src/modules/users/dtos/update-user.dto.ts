import {  IsString } from "class-validator";

export class UpdateUserDTO {
      @IsString()
      name: string;    
      @IsString()
      role: string;
}