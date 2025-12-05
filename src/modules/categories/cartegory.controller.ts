import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { JwtGuard } from 'src/common/auth/guards/jwt.guard';
import { CategoryDTO } from './dtos/category.dto';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}
  @UseGuards(JwtGuard)
  @Post()
  async createCategory(@Body() dto: CategoryDTO) {
    const data = await this.categoryService.createCategory(dto);
    return {
      status: 201,
      message: 'Category created successfully',
      data,
    };
  }
}
