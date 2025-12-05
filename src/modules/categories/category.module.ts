import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CategoryService } from './category.service';
import { CategoryController } from './cartegory.controller';

@Module({
  controllers: [CategoryController],
  providers: [PrismaService, CategoryService],
  exports: [CategoryService]
})
export class CategoryModule {}
