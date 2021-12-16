import { Model } from 'mongoose';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { hash } from 'bcryptjs';

import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto) {
    const { email, password, ...restUserData } = createUserDto;

    const hasUserWithSameEmail = await this.findByEmail(email);

    if (hasUserWithSameEmail) {
      throw new HttpException(
        'User with this email already exists',
        HttpStatus.BAD_REQUEST,
      );
    }

    const passwordHash = await hash(password, 8);

    const createdUser = new this.userModel({
      email,
      passwordHash,
      ...restUserData,
    });

    return createdUser.save();
  }

  findByEmail(email: string) {
    return this.userModel.findOne({ email });
  }
}
