import { PrismaService } from 'src/prisma/prisma.service';
import { CategoryDTO } from './dtos/category.dto';
import { BadRequestException, Injectable } from '@nestjs/common';
import { generateSlug } from 'src/common/utils/helpers';
import { plainToInstance } from 'class-transformer';
import { CategoryResponseDTO } from './dtos/category-response.dto';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  async createCategory(dto: CategoryDTO) {
    console.log(dto, 'dtos');

    const slug = await generateSlug(dto.name);
  

    const categorydata = await this.prisma.category.create({
      data: {
        name: dto.name,
        slug,
      },
    });

    return categorydata;
  }
}
