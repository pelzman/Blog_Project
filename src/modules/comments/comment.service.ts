import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PostService } from '../posts/post.service';
import { UserService } from '../users/user.service';
import { AddCommentDTO } from './dtos/add-comment.dto';
import { connect } from 'http2';
import { CommentResponseDTO } from './dtos/comment-response.dto';
import { plainToInstance } from 'class-transformer';
import { UpdateCommentDTO } from './dtos/update-comment.dto';

@Injectable()
export class CommentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly postservice: PostService,
    private readonly userService: UserService,
  ) {}

  async addComment(userId:number, postId:number, dto:AddCommentDTO){
    // check user exist
    const userExist = await this.userService.getUser(userId)
    if(!userExist)throw new BadRequestException("User does not exist")
        //check if post exist for the user
        const postExist = await this.postservice.getPost(userId, postId)
        if(!postExist) throw new BadRequestException("Post not exist for this user")
            // add the comment to post
        return await this.prisma.comment.create({
            data:{
                content:dto.content,
                post:{connect:{id:postId}},
                user:{connect:{id:userId}}
            },
            include:{post:true,
               user :{select:{name:true, email:true}}
            }
      
        })
  }

   async getComments(userId:number, postId:number):Promise<CommentResponseDTO[]>{
    return await this.prisma.comment.findMany({where:{userId, postId}})
   }
   async getComment(userId:number, commentId:number):Promise<CommentResponseDTO>{
    const comment = await this.prisma.comment.findUnique({where:{id:commentId, userId,}})

    return plainToInstance(CommentResponseDTO, comment)
   }

    async updateComment(userId:number, commentId:number, dto:Partial<UpdateCommentDTO>):Promise<CommentResponseDTO>{
      // get comment to update
    const commentToUpdate = await this.getComment(userId, commentId)
    if(!commentToUpdate) throw new NotFoundException("Comment not found")
        if(commentToUpdate.id !== userId){
            throw new BadRequestException('You can only update your own comment')
        }
    const comment = await this.prisma.comment.update({where:{id:commentToUpdate.id},data:{
      content: dto.content
    }})

    return plainToInstance(CommentResponseDTO, comment)
   }
   async deleteComment(userId:number, commentId:number):Promise<CommentResponseDTO>{

    const comment = await this.prisma.comment.delete({where:{id:commentId, userId, }})
     const commentToDelete = await this.prisma.comment.findUnique({where:{id:commentId}})
       if(!commentToDelete) throw new BadRequestException("comment does not exist")
        if(commentToDelete?.id !== userId){
            throw new BadRequestException('You can only update your own comment')
        }
    return plainToInstance(CommentResponseDTO, comment)
   }
  
}
