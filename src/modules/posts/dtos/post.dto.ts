import { PostStatus } from '@prisma/client';
import { IsNumber, IsString, MaxLength } from 'class-validator';

export class PostDto {
  @IsString()
  @MaxLength(30, { message: 'reached the text limit' })
  title: string;
  @IsString()
  content: string;
  @IsString()
  excerpt: string;
  @IsString()
  slug: string;
  @IsString()
  status: PostStatus;
    @IsString()
  tags: string[];
  @IsString()
  metaTitle?: string;
  @IsString()
  metaDescription?: string;

  @IsString()
  ogImage?: Express.Multer.File;
}
