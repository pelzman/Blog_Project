import { IsNotEmpty, IsString } from "class-validator";

export class CreateTagDTO {
 @IsString()
 @IsNotEmpty()
 name : string;
  @IsString()
 slug : string

}
export class TagResponseDTO {
 id :  number;
 name : string;
 slug : string

}