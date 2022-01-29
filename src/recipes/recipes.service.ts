import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Recipe, RecipeDocument } from './schemas/recipe.schema';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe-dto';

@Injectable()
export class RecipesService {
  constructor(
    @InjectModel(Recipe.name) private recipeModel: Model<RecipeDocument>,
  ) {}

  create(createRecipeDto: CreateRecipeDto) {
    return new this.recipeModel(createRecipeDto).save();
  }

  async update(userId: string, recipeId: string, recipe: UpdateRecipeDto) {
    const recipeToBeUpdated = await this.findById(recipeId);

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
      .populate('author', 'name');

    if (!recipe) {
      throw new HttpException('Recipe not found', HttpStatus.NOT_FOUND);
    }

    return recipe;
  }

  async remove(userId: string, recipeId: string) {
    const recipeToBeRemoved = await this.findById(recipeId);

    const recipeOwner = recipeToBeRemoved.author._id.toString();

    if (userId !== recipeOwner) {
      throw new HttpException(
        'You are not authorized to remove this recipe',
        HttpStatus.UNAUTHORIZED,
      );
    }

    await recipeToBeRemoved.remove();
  }
}
