import { PrismaService } from 'src/prisma/prisma.service';
import { PostDto } from './dtos/post.dto';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from '../users/user.service';
import { PostResponseDTO } from './dtos/post-response.dto';
import { plainToInstance } from 'class-transformer';
import { generateSlug } from 'src/common/utils/helpers';
import { UpdatePostDTO } from './dtos/update-post.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class PostService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
    private readonly cloudinary: CloudinaryService,
  ) {}

  async createPost(
    userId: number,
    categoryId: number,
    dto: PostDto,
    file: Express.Multer.File,
  ): Promise<PostResponseDTO | null> {
    await this.isUserExist(userId);

    const category = await this.prisma.category.findUnique({
      where: { id: categoryId },
    });
    if (!category)
      throw new BadRequestException('you must create a category to add posts');
   
    //chech if post already exist

  
    const tagArray = Array.isArray(dto.tags)
      ? dto.tags
      : typeof dto.tags === 'string'
        ? JSON.parse(dto.tags)
        : [];
        console.log(tagArray, "array")
    const tags = await Promise.all(
      tagArray.map(async (tag) => {
        const slug = await generateSlug(tag);
        return this.prisma.tag.upsert({
          where: { name: tag },
          create: { name: tag, slug },
          update: {},
        });
      }),
    );
     const slug = await generateSlug(dto?.title);
  const { secure_url } = await this.cloudinary.uploadImage(file);
    const post = await this.prisma.post.create({
      data: {
        title:dto.title,
        content:dto.content,
        excerpt :dto.excerpt,
        slug,
        publishedAt: new Date(),
        author: { connect: { id: userId } },
        metaTitle: dto.metaTitle,
        metaDescription: dto.metaDescription,
        ogImage: secure_url,
        tags: {
          create: tags.map((tag) => ({
            tagId: tag.id,
          })),
        },
        category: { connect: { id: categoryId } },
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
  //   for(const tag of tags){
  //  await this.prisma.postTag.create({data:{
  //   postId:post.id,
  //   tagId: tag.
  //  }})
  //   }
    

    console.log(post);
    return plainToInstance(PostResponseDTO, {
      ...post,
    });
  }

  async getPosts(userId: number): Promise<PostResponseDTO[]> {
    await this.isUserExist(userId);
    const posts = await this.prisma.post.findMany({
      where: { authorId: userId },
      include: {
        comments: { select: { id: true, content: true } },
        tags: { select: { tag: true } },
      },
    });
    return plainToInstance(PostResponseDTO, posts);
  }
  async getPost(userId: number, postId: number): Promise<PostResponseDTO> {
    await this.isUserExist(userId);
    const post = await this.prisma.post.findUnique({
      where: { id: postId, authorId: userId },
      include: { tags: { select: { tag: { select: { name: true } } } } },
    });
    if (!post)
      throw new NotFoundException(
        `Post with id ${postId} not found for this user`,
      );
    return plainToInstance(PostResponseDTO, post);
  }

  async getPostsByCategory(categoryId:number):Promise<PostResponseDTO[]>{
   const posts = await this.prisma.post.findMany({where:{categoryId}})
   return plainToInstance(PostResponseDTO, posts)
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
