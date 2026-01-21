import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../users/user.service';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

describe('AuthService', () => {
  let service: AuthService;
  const prismaMock = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    role: {
      upsert: jest.fn(),
    },
  };
  const jwtMock = {
    sign: jest.fn(),
  };


  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        JwtService,
        { provide: PrismaService, useValue: prismaMock },
        { provide: JwtService, useValue: jwtMock },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('should create create role if role not exist', async () => {
    prismaMock.user.findUnique.mockResolvedValue(null);

    prismaMock.role.upsert.mockResolvedValue({ id: 3, role: 'USER' });
    prismaMock.user.create.mockResolvedValue({
      id: 10,
      email: 'example@gmail.com',

      role: { name:'USER' },
    });
    const dto = {
      name: 'walex',
      email: 'example@gmail.com',
      role: 'USER',
      password:'PASSWORD',
      token: 'mock-token'
      
    };
    jwtMock.sign.mockReturnValue('mock-token');

    const result = await service.signUp(dto as any);
    expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
      where: { email: dto.email },
    });
    expect(prismaMock.role.upsert).toHaveBeenCalled();
    expect(prismaMock.user.create).toHaveBeenCalled()
     
    expect(jwtMock.sign).toHaveBeenCalled();
    expect(result.token).toBe('mock-token');
  });
});
