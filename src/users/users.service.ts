import { Model } from 'mongoose';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { hash } from 'bcryptjs';

import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

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

    await createdUser.save();

    createdUser.passwordHash = null;

    return createdUser;
  }

  findByEmail(email: string) {
    return this.userModel.findOne({ email });
  }

  async findById(userId: string) {
    const user = await this.userModel.findById(userId);

    user.passwordHash = null;

    return user;
  }

  async update(userId: string, userToBeUpdatedId: string, user: UpdateUserDto) {
    if (userId !== userToBeUpdatedId) {
      throw new HttpException(
        'You are not allowed to update this user',
        HttpStatus.FORBIDDEN,
      );
    }

    const userEmail = user.email;

    if (userEmail) {
      const hasUserWithSameEmail = await this.findByEmail(userEmail);

      if (hasUserWithSameEmail) {
        throw new HttpException(
          'User with this email already exists',
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    const userPassword = user.password;
    let passwordHash = null;

    if (userPassword) {
      const hashedPassword = await hash(userPassword, 8);

      passwordHash = hashedPassword;
    }

    const updatedUser = await this.userModel.findByIdAndUpdate(
      userId,
      {
        $set: {
          ...user,
          ...(passwordHash ? { passwordHash } : {}),
        },
      },
      { new: true },
    );

    updatedUser.passwordHash = null;

    return updatedUser;
  }

  async remove(userId: string, userToBeDeletedId: string) {
    if (userId !== userToBeDeletedId) {
      throw new HttpException(
        'You are not allowed to delete this user',
        HttpStatus.FORBIDDEN,
      );
    }

    await this.userModel.findByIdAndRemove(userToBeDeletedId);
  }
}
