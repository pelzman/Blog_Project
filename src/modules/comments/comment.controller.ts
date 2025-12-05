import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { AddCommentDTO } from './dtos/add-comment.dto';
import { JwtGuard } from 'src/common/auth/guards/jwt.guard';
import { User } from 'src/common/auth/decorators/user.decorator';

@Controller()
export class CommentController {
  constructor(private readonly commentService: CommentService) {}
  @UseGuards(JwtGuard)
  @Post('posts/:postId/comments')
  async addComment(
    @Param('postId') postId: string,
    @Body() dto: AddCommentDTO,
    @User() user,
  ) {
    const data = await this.commentService.addComment(
      user.id,
      Number(postId),
      dto,
    );
    return {
      status: 201,
      message: 'Comment added successfully',
      data,
    };
  }
  @UseGuards(JwtGuard)
  @Get('posts/:postId/comments')
  async getComments(@Param('postId') postId: string, @User() user) {
    const data = await this.commentService.getComments(user.id, Number(postId));
    return {
      status: 200,
      message: 'Comments fetched successfully',
      data,
    };
  }
  @UseGuards(JwtGuard)
  @Get('comments:commentId')
  async getComment(@Param('commentId') commentId: string, @User() user) {
    const data = await this.commentService.getComment(
      user.id,
      Number(commentId),
    );
    return {
      status: 200,
      message: 'Comment fetched successfully',
      data,
    };
  }
  @UseGuards(JwtGuard)
  @Put('comments:commentId')
  async updateComment(
    @Param('commentId') commentId: string,
    @Body() dto: AddCommentDTO,
    @User() user,
  ) {
    const data = await this.commentService.updateComment(
      user.id,

      Number(commentId),
      dto,
    );
    return {
      status: 200,
      message: 'Comment updated successfully',
      data,
    };
  }
  @UseGuards(JwtGuard)
  @Delete('comments:commentId')
  async deleteComment(
    @Param()   commentId: string ,
    @User() user
  ) {
    const data = await this.commentService.deleteComment(
      user.id,
   
      Number(commentId),
    );
    return {
      status: 200,
      message: 'Comment deleted successfully',
      data,
    };
  }
}
