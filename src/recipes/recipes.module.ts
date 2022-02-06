import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { LikesModule } from '../likes/likes.module';
import { CommentsModule } from '../comments/comments.module';
import { Recipe, RecipeSchema } from './schemas/recipe.schema';
import { RecipesController } from './recipes.controller';
import { RecipesService } from './recipes.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Recipe.name, schema: RecipeSchema }]),
    LikesModule, CommentsModule,
  ],
  controllers: [RecipesController],
  providers: [RecipesService],
})
export class RecipesModule {}
