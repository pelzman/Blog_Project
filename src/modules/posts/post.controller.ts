import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PostService } from './post.service';
import { PostDto } from './dtos/post.dto';
import { JwtGuard } from 'src/common/auth/guards/jwt.guard';
import { User } from 'src/common/auth/decorators/user.decorator';
import { AnyFilesInterceptor, FileInterceptor } from '@nestjs/platform-express';

@Controller()
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post('category/:categoryId/posts')
  @UseGuards(JwtGuard)
  @UseInterceptors(AnyFilesInterceptor())
  async createPost(
    @User() user,
    @Param('categoryId') categoryId: string,
    @Body() dto: PostDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    console.log(dto, '@controller');
    const file = files?.[0] || null;
    const data = await this.postService.createPost(
      user.id,
      Number(categoryId),
      dto,
      file,
    );
    return {
      status: 201,
      message: 'Post created successfully',
      data,
    };
  }
  @UseGuards(JwtGuard)
  @Get('/posts')
  async getPosts(@User() user, userId: string) {
    const data = await this.postService.getPosts(user.id);
    return {
      status: 200,
      message: 'Posts fetched successfully',
      data,
    };
  }
  @UseGuards(JwtGuard)
  @Get('posts/:postId')
  async getPost(@Param('postId') postId: string, @User() user) {
    const data = await this.postService.getPost(user.id, Number(postId));
    return {
      status: 200,
      message: 'Post fetched successfully',
      data,
    };
  }
  @UseGuards(JwtGuard)
  @Get('category/:categoryId/posts')
  async getPostsByCategory(@Param('categoryId') categoryId: string) {
    const data = await this.postService.getPostsByCategory(Number(categoryId));
    return {
      status: 200,
      message: 'Posts fetched successfully',
      data,
    };
  }
  @UseGuards(JwtGuard)
  @Get('allPosts')
  async getAllPosts(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('categoryId') categoryId?: string,
    @Query('authorId') authorId?: string,
    @Query('status') status?: string,
    @Query('tag') tag?: string,
    @Query('sort') sort?: string,
    @Query('search') search?: string,
  ) {
    const data = await this.postService.getAllPosts({
      page: Number(page),
      limit: Number(limit),
      categoryId: categoryId ? Number(categoryId) : undefined,
      authorId: authorId ? Number(authorId) : undefined,
      status,
      tag,
      sort,
      search,
    });
    return {
      status: 200,
      message: 'Posts fetched successfully',
      data,
    };
  }
  @UseGuards(JwtGuard)
  @Put('posts/:postId')
  async updatePost(
    @Param('postId') postId: string,
    @Body() dto: PostDto,
    @User() user,
  ) {
    const data = await this.postService.updatePost(
      user.id,
      Number(postId),
      dto,
    );
    return {
      status: 200,
      message: 'Post updated successfully',
      data,
    };
  }
}
