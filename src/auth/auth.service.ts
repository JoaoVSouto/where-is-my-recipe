import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcryptjs';

import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      return null;
    }

    const isSamePassword = await compare(password, user.passwordHash);

    if (!isSamePassword) {
      return null;
    }

    return {
      id: user._id,
      email: user.email,
      name: user.name,
    };
  }

  async login(user: any) {
    const payload = {
      sub: user.id,
      username: user.name,
      email: user.email,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
