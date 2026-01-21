import { Test } from '@nestjs/testing';
import { PostService } from './post.service';
import { PrismaService } from '../../prisma/prisma.service';
import { CloudinaryService } from '../../cloudinary/cloudinary.service';
import { UserService } from '../users/user.service';
import { title } from 'process';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

describe('PostService', () => {
  let service: PostService;
  const prismaMock = {
    user: {
      findUnique: jest.fn(),
    },
    post: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
    },
    category: {
      findUnique: jest.fn(),
    },
  };
  const userServiceMock = {
    getUser: jest.fn(),
  };
  const cloudinaryserviceMock = {
    uploadImage: jest.fn(),
  };

  // create test module

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        PostService,
        { provide: PrismaService, useValue: prismaMock },
        { provide: UserService, useValue: userServiceMock },
        { provide: CloudinaryService, useValue: cloudinaryserviceMock },
      ],
    }).compile();

    service = module.get(PostService);
  });
  it('should create post if user exixt', async () => {
    prismaMock.user.findUnique.mockResolvedValue({ id: 1 });
    prismaMock.category.findUnique.mockResolvedValue({ id: 5 });
    userServiceMock.getUser.mockResolvedValue({ id: 1 });
    prismaMock.post.create.mockResolvedValue({ id: 20 });
    cloudinaryserviceMock.uploadImage.mockResolvedValue({
      secure_url: 'https://image.jpg',
    });

    const dto: any = { title: 'post', content: 'content', tags: [] };

    const result = await service.createPost(1, 1, dto, null);

    expect(result?.id).toBe(20);
    expect(prismaMock.post.create).toHaveBeenCalled();
  });

  it('should update the post if the user is the owner', async () => {
    userServiceMock.getUser.mockResolvedValue({ id: 1 });
    prismaMock.post.findUnique.mockResolvedValue({
      id: 5,
      authorId: 1,
    });
    const dto = { title: 'update data' };
    prismaMock.post.update.mockResolvedValue({
      id: 5,
      authorId: 1,
      title: dto.title,
    });
    const result = await service.updatePost(1, 5, dto as any);
    expect(userServiceMock.getUser).toHaveBeenCalledWith(1);
    expect(prismaMock.post.findUnique).toHaveBeenCalledWith({
      where: { id: 5, authorId: 1 },
    });
    expect(prismaMock.post.update).toHaveBeenCalledWith({
      where: { id: 5 },
      data: {
        title: dto.title,
      },
    });

    expect(result.title).toBe(dto.title);
  });
  it('should throw NotFoundException error if user not the owner and post not exist ', async () => {
    userServiceMock.getUser.mockResolvedValue({ id: 2 });
    prismaMock.post.findUnique.mockResolvedValue(null);

    const dto = {
      title: 'update Data',
    };

    await expect(service.updatePost(3, 5, dto as any)).rejects.toThrow(
      NotFoundException,
    );

  });
});
