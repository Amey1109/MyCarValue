import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private userService: UsersService) {}

  async signup(email: string, password: string) {
    const resultUser = await this.userService.find(email);
    if (resultUser.length) {
      throw new BadRequestException('Email in use');
    }

    //* Hash the User password

    //! Creating salt
    const salt = randomBytes(8).toString('hex');

    //! hashing the password given by user
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    //! password which we're going to store salt.hashedPassword
    const resultPassword = salt + '.' + hash.toString('hex');

    const newUser = await this.userService.create(email, resultPassword);
    return newUser;
  }

  async signin(email: string, password: string) {
    const [resultUser] = await this.userService.find(email);
    if (!resultUser) {
      throw new NotFoundException('User does not exists');
    }
    const [salt, expectedHash] = resultUser.password.split('.');

    const anticipatedHash = (await scrypt(password, salt, 32)) as Buffer;

    if (expectedHash !== anticipatedHash.toString('hex')) {
      throw new BadRequestException('Incorrect Password');
    }
    return resultUser;
  }
}
