import { Test } from '@nestjs/testing';
import { TagService } from './tag.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('TagService', () => {
  let service: TagService;

  const prismaMock = {
    tag: {
      upsert: jest.fn(),
      findMany: jest.fn(),
    },
  };
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [TagService, { provide: PrismaService, useValue: prismaMock }],
    }).compile();
    service = module.get(TagService);
  });

  it('should create tag if tag not already exist', async () => {
    prismaMock.tag.upsert.mockResolvedValue({
      id: 2,
      name: 'tag',
      slug: 'tag',
    });
    const dto = { name: 'tag', slug: 'tag' };
    const result = await service.createTag(dto);

    expect(prismaMock.tag.upsert).toHaveBeenCalledWith({
      where: { name: dto.name },
      update: {},
      create: { name: 'tag', slug: 'tag' },
    });

    expect(result.name).toBe('tag');
  });
  it('should return suggestedTag', async () => {
    const query = 'hi';
    prismaMock.tag.findMany.mockResolvedValue([
      { id: 1, name: 'hello' },
      { id: 2, name: 'help' },
    ]);

    const result = await service.suggestTag(query);
    expect(prismaMock.tag.findMany).toHaveBeenCalledWith({
      where: { name: { contains: query, mode: 'insensitive' } },
    });
    expect(result).toBeDefined();
    
  });
});
