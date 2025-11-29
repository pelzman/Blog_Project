import { PrismaService } from 'src/prisma/prisma.service';
import { PostDto } from './dtos/post.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { UserService } from '../users/user.service';
import { PostResponseDTO } from './dtos/post-response.dto';
import { plainToInstance } from 'class-transformer';
import { generateSlug } from 'src/common/utils/helpers';
import { UpdatePostDTO } from './dtos/update-post.dto';

@Injectable()
export class PostService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
  ) {}

  async createPost(
    userId: number,
    dto: PostDto,
  ): Promise<PostResponseDTO | null> {
    await this.isUserExist(userId);
    const slug = await generateSlug(dto.title);
    //chech if post already exist

    const post = await this.prisma.post.create({
      data: {
        ...dto,
        slug,
        publishedAt: new Date(),
        author: { connect: { id: userId } },
      },
      include: {
        author: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });
    console.log(post);
    return plainToInstance(PostResponseDTO, {
      post,
    });
  }

  async getPosts(userId: number): Promise<PostResponseDTO[]> {
    await this.isUserExist(userId);
    const posts = await this.prisma.post.findMany({
      where: { authorId: userId },
    });
    return plainToInstance(PostResponseDTO, posts);
  }
  async getPost(userId: number, postId: number): Promise<PostResponseDTO> {
    await this.isUserExist(userId);
    const post = await this.prisma.post.findUnique({
      where: { id: postId, authorId: userId },
    });
    if (!post)
      throw new NotFoundException(
        `Post with id ${postId} not found for this user`,
      );
    return plainToInstance(PostResponseDTO, post);
  }
  async updatePost(
    userId: number,
    postId: number,
    dto: Partial<UpdatePostDTO>,
  ): Promise<PostResponseDTO> {
    await this.isUserExist(userId);
    const post = await this.prisma.post.findUnique({
      where: { id: postId, authorId: userId },
    });
    if (!post)
      throw new NotFoundException(
        `Post with id ${postId} not found for this user`,
      );
    const updated = await this.prisma.post.update({
      where: { id: postId },
      data: {
        title: dto.title,
        content: dto.content,
        excerpt: dto.excerpt,
      },
    });
    return plainToInstance(PostResponseDTO, updated);
  }

  private async isUserExist(userId: number) {
    const user = await this.userService.getUser(userId);
    if (!user) throw new NotFoundException(`User with Id ${userId} not found`);
    return;
  }
}
