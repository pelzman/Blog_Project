import { Body, Controller, Get, Param, Post, Put } from "@nestjs/common";
import { PostService } from "./post.service";
import { PostDto } from "./dtos/post.dto";
 
@Controller("users/:userId/posts")
export class PostController {
    constructor(
        private readonly postService:PostService
    ){}

    @Post()
    async createPost(@Param('userId') userId:string, @Body() dto:PostDto){
       const data = await this.postService.createPost(Number(userId), dto)
          return {
      status: 201,
      message: 'Post created successfully',
      data,
    };  
    }
    @Get()
    async getPosts(@Param('userId') userId:string ){
       const data = await this.postService.getPosts(Number(userId))
          return {
      status: 200,
      message: 'Posts fetched successfully',
      data,
    };  
    }
    @Get(':postId')
    async getPost(@Param() params:{userId:string, postId:string}){
       const data = await this.postService.getPost(Number(params.userId), Number(params.postId))
          return {
      status: 200,
      message: 'Post fetched successfully',
      data,
    };  
    }
    @Put(':postId')
    async updatePost(@Param() params:{userId:string, postId:string} ,@Body() dto:PostDto){
       const data = await this.postService.updatePost(Number(params.userId),Number(params.postId) ,dto)
          return {
      status: 200,
      message: 'Post updated successfully',
      data,
    };  
    }
}