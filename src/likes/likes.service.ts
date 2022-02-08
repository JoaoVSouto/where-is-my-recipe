import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Like, LikeDocument } from './schemas/like.schema';
import { CreateLikeDto } from './dto/create-like-dto';

@Injectable()
export class LikesService {
  constructor(@InjectModel(Like.name) private likeModel: Model<LikeDocument>) {}

  async create(createLikeDto: CreateLikeDto) {
    const hasUserAlreadyLikedRecipe = await this.likeModel.findOne({
      owner: createLikeDto.owner,
      recipe: createLikeDto.recipe,
    });

    if (hasUserAlreadyLikedRecipe) {
      throw new HttpException(
        'You have already liked this recipe',
        HttpStatus.BAD_REQUEST,
      );
    }

    return new this.likeModel(createLikeDto).save();
  }

  findAllByRecipe(recipeId: string) {
    return this.likeModel.find({ recipe: recipeId });
  }

  findAll() {
    return this.likeModel.find();
  }

  async remove(userId: string, recipeId: string) {
    const likes = await this.findAllByRecipe(recipeId);

    const likeToBeRemoved = likes.find(
      like => like.owner._id.toString() === userId,
    );

    if (!likeToBeRemoved) {
      throw new HttpException(
        'You have not liked this recipe',
        HttpStatus.BAD_REQUEST,
      );
    }

    await likeToBeRemoved.remove();
  }

  removeAllByRecipe(recipeId: string) {
    return this.likeModel.deleteMany({ recipe: recipeId });
  }
}
