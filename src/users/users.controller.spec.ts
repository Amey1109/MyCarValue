import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import { User } from './user.entity';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {
    fakeUsersService = {
      findOne: (id: string) =>
        Promise.resolve({
          id,
          email: 'a@a.com',
          password: 'somePassword',
        } as User),
      find: (email: string) =>
        Promise.resolve([
          {
            id: 'abc-123',
            email,
            password: 'somePassword',
          } as User,
        ]),
      // remove: (id: string) => {},
      // update: (id: string, body: UpdateUserDto) => {},
    };
    fakeAuthService = {
      // signup: (email: string, password: string) => {},
      // signin: (email: string, password: string) => {},
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
        {
          provide: AuthService,
          useValue: fakeAuthService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
