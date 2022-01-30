import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { LikesService } from '../likes/likes.service';
import { Recipe, RecipeDocument } from './schemas/recipe.schema';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe-dto';

@Injectable()
export class RecipesService {
  constructor(
    @InjectModel(Recipe.name) private recipeModel: Model<RecipeDocument>,
    private readonly likesService: LikesService,
  ) {}

  create(createRecipeDto: CreateRecipeDto) {
    return new this.recipeModel(createRecipeDto).save();
  }

  async update(userId: string, recipeId: string, recipe: UpdateRecipeDto) {
    const recipeToBeUpdated = await this.recipeModel.findById(recipeId);

    if (!recipeToBeUpdated) {
      throw new HttpException('Recipe not found', HttpStatus.NOT_FOUND);
    }

    const recipeOwner = recipeToBeUpdated.author._id.toString();

    if (userId !== recipeOwner) {
      throw new HttpException(
        'You are not authorized to update this recipe',
        HttpStatus.UNAUTHORIZED,
      );
    }

    if (recipe.author && userId !== recipe.author) {
      throw new HttpException(
        "You can't change the author of the recipe",
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.recipeModel.findByIdAndUpdate(
      recipeId,
      {
        $set: recipe,
      },
      { new: true },
    );
  }

  findAll() {
    return this.recipeModel
      .find()
      .sort('-createdAt')
      .populate('author', 'name -_id')
      .select('title preparationTime servings createdAt');
  }

  async findById(recipeId: string) {
    const recipe = await this.recipeModel
      .findById(recipeId)
      .populate('author', 'name -_id');

    if (!recipe) {
      throw new HttpException('Recipe not found', HttpStatus.NOT_FOUND);
    }

    const likes = await this.likesService.findAllByRecipe(recipeId);

    return Object.assign(recipe.toObject(), { likes: likes.length });
  }

  async remove(userId: string, recipeId: string) {
    const recipeToBeRemoved = await this.recipeModel.findById(recipeId);

    if (!recipeToBeRemoved) {
      throw new HttpException('Recipe not found', HttpStatus.NOT_FOUND);
    }

    const recipeOwner = recipeToBeRemoved.author._id.toString();

    if (userId !== recipeOwner) {
      throw new HttpException(
        'You are not authorized to remove this recipe',
        HttpStatus.UNAUTHORIZED,
      );
    }

    await Promise.all([
      recipeToBeRemoved.remove(),
      this.likesService.removeAllByRecipe(recipeId),
    ]);
  }

  async createLike(userId: string, recipeId: string) {
    const doesRecipeExist = await this.recipeModel.exists({ _id: recipeId });

    if (!doesRecipeExist) {
      throw new HttpException('Recipe not found', HttpStatus.NOT_FOUND);
    }

    return this.likesService.create({ owner: userId, recipe: recipeId });
  }

  removeLike(userId: string, recipeId: string) {
    return this.likesService.remove(userId, recipeId);
  }
}
