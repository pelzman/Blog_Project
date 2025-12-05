import { Body, Controller, Get, Post, Query, UseGuards } from "@nestjs/common";
import { TagService } from "./tag.service";
import { JwtGuard } from "src/common/auth/guards/jwt.guard";
import { CreateTagDTO } from "./dtos/create-tag.dto";

 
 @Controller("tags")
 export class TagController{
    constructor(
        private readonly tagService:TagService
    ){} 

    @Post()
    @UseGuards(JwtGuard)
     async createTag(@Body() dto:CreateTagDTO){
      const data = await this.tagService.createTag(dto) 
          return {
      status: 201,
      message: 'Tag created successfully',
      data,
    };
     }

    @Get()
    @UseGuards(JwtGuard)
     async listTags(){
      const data = await this.tagService.listTags() 
          return {
      status: 200,
      message: 'Tags fetched successfully',
      data,
    };
     }

    @Get("suggest")
    @UseGuards(JwtGuard)
     async suggetTags(@Query('q') query: string){
      const data = await this.tagService.suggestTag(query) 
          return {
      status: 200,
      message: 'Tags fetched successfully',
      data,
    };
     }
 }