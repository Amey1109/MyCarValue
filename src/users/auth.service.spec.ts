import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('Auth Service', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;
  beforeEach(async () => {
    const users: User[] = [];
    fakeUsersService = {
      find: (email: string) => {
        const filteredUsers = users.filter((user) => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      create: (email: string, password: string) => {
        const user = {
          id: crypto.randomUUID(),
          email,
          password,
        } as User;
        users.push(user);
        return Promise.resolve(user);
      },
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('Can create the instance of auth service', async () => {
    expect(service).toBeDefined();
  });

  it('It creates user with salted and hashed password ', async () => {
    const user = await service.signup('testuser@test.com', 'test1231!');
    expect(user.password).not.toEqual('test1231!');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('Throws an error if user tries to sign-up with existing email', async () => {
    await service.signup('testuser@test.com', 'test1231!');
    await expect(
      service.signup('testuser@test.com', 'test1231!'),
    ).rejects.toThrow(BadRequestException);
  });

  it('User tries to signin with non-existing email', async () => {
    await expect(
      service.signin('testuser@test.com', 'test1231!'),
    ).rejects.toThrow(NotFoundException);
  });

  it('User tries to signin with incorrect password', async () => {
    await service.signup('a@a.com', '!@AB#');
    await expect(service.signin('a@a.com', '!@A')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('User tries to signin with Correct password', async () => {
    await service.signup('a@a.com', '!@AB');
    const user = await service.signin('a@a.com', '!@AB');
    expect(user).toBeDefined();
  });
});
