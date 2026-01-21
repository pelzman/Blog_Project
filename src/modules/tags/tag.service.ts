import { PrismaService } from '../../prisma/prisma.service';
import { CreateTagDTO, TagResponseDTO } from './dtos/create-tag.dto';
import { BadRequestException, Injectable } from '@nestjs/common';
import { generateSlug } from '../../common/utils/helpers';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class TagService {
  constructor(private readonly prisma: PrismaService) {}

  async createTag(dto: CreateTagDTO): Promise<TagResponseDTO> {
    const slug = await generateSlug(dto.name);

    const tag = await this.prisma.tag.upsert({
      where: { name: dto.name },
      create: { name: dto.name, slug },
      update: {},
    });

    return plainToInstance(TagResponseDTO, {
      ...tag,
    });
  }

  async listTags(): Promise<TagResponseDTO[]> {
    const tags = await this.prisma.tag.findMany({});
    const data = tags.map((tag) => {
      return plainToInstance(TagResponseDTO, {
        id: tag.id,
        name: tag.name,
        slug: tag.slug,
      });
    });
    return data;
  }
  async suggestTag(query: string): Promise<TagResponseDTO[]> {
    const tags = await this.prisma.tag.findMany({
      where: {
        name: { contains: query, mode: 'insensitive' },
      },
    });

    const data = tags.map((tag) => {
      return plainToInstance(TagResponseDTO, {
        id: tag.id,
        name: tag.name,
        slug: tag.slug,
      });
    });
    return data;
  }
}
