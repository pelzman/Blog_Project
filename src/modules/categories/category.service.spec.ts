import { Test } from '@nestjs/testing';
import { CategoryService } from './category.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('CategoryService', () => {
  let service: CategoryService;

  const prismaMock = {
    category: {
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        CategoryService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();
    service = await module.get(CategoryService);
  });

  it('should create categories', async () => {
    prismaMock.category.create.mockResolvedValue({ name: 'Sport' });
    const dto = {
      name: 'Sport',
      slug: 'Sport',
    };
    const result = await service.createCategory(dto);
    expect(prismaMock.category.create).toHaveBeenCalled();
    expect(result).toBeDefined();
  });
});
