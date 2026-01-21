import { Test } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('UserService', () => {
  let service: UserService;
  const prismaMock = {
    role: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    user: {
      findUnique: jest.fn(),

      update: jest.fn(),
    },
  };
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();
    service = module.get(UserService);
  });

  it('should check if user to update exist', async () => {
    prismaMock.user.findUnique.mockResolvedValue({ id: 2 });
    prismaMock.role.findUnique.mockResolvedValue({ name: 'USER' });
    prismaMock.role.update.mockResolvedValue({
      id: 3,
      name: 'USER',
    });
    const dto = {
      id: 2,
      name: 'Pelzman',
      email: '@gmail.com',
      role: 'MANAGER',
    };
    prismaMock.user.update.mockResolvedValue({
      id: 2,
      name: dto.name,
      email: '@gmail.com',
      role: dto.role,
    });

    const result = await service.updateUser(2, {
      name: dto.name,
      role: dto.role,
    });

    expect(prismaMock.user.update).toHaveBeenCalledWith({
      where: {
        id: 2,
      },
      data: {
        name: dto.name,
        email: '@gmail.com',
      },
    });
    expect(result).toEqual({
      id: 2,
      name: 'Pelzman',
    });
  });
});
