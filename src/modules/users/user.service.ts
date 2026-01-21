import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { PostDto } from '../posts/dtos/post.dto';
import { PostResponseDTO } from '../posts/dtos/post-response.dto';
import { UserResponseDTO } from './dtos/user-response.dto';
import { plainToInstance } from 'class-transformer';
import { UserDTO } from './dtos/user.dto';
import { UpdateUserDTO } from './dtos/update-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async getUsers(): Promise<UserResponseDTO[]> {
    const users = await this.prisma.user.findMany({ include: { role: true } });

    const data = users.map((user) => {
      return plainToInstance(UserResponseDTO, {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role.name,
      });
    });
    return data;
  }
  async getUser(userId: number): Promise<UserResponseDTO> {
    //check if user exist
    const userExist = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!userExist)
      throw new BadRequestException(
        `User with userId ${userId} does not exist`,
      );
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { role: true },
    });
    return plainToInstance(UserResponseDTO, {
      id: user?.id,
      name: user?.name,
      email: user?.email,
      role: user?.role?.name,
    });
  }
  async updateUser(
    userId: number,
    data: Partial<UpdateUserDTO>,
  ): Promise<UserResponseDTO> {
    //check if user exist
    const userExist = await this.prisma.user.findUnique({
      where: { id: userId },
      include:{role:true}
    });
    if (!userExist)
      throw new BadRequestException(
        `User with userId ${userId} does not exist`,
      );
    // get role by name

    let roleName =  userExist.role?.name;
    if(data.role){
   const role = await this.prisma.role.findUnique({
      where: { name: data.role },
    });
    if (!role)
      throw new BadRequestException(`role ${data.role} does not exist`);
    // update Role
     const updatedRole  = await this.prisma.role.update({
      where: { id: role?.id },
      data: { name: data.role },
    });
     roleName = updatedRole.name
    }
  
    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: {
        name: data.name,
        
      },
    });
    return plainToInstance(UserResponseDTO, {
        id:updatedUser.id,
        name:updatedUser.name,
        email:updatedUser.email,
        role: roleName
    })
  }
}
