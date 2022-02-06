import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RecipesService } from './recipes.service';
import { CreateRecipeWithoutAuthorDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe-dto';
import { CreateCommentDto, ReceiveCommmentDto } from 'src/comments/dto/create-comment-dto';

@Controller('recipes')
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Request() req,
    @Body() createRecipeDto: CreateRecipeWithoutAuthorDto,
  ) {
    return this.recipesService.create({
      ...createRecipeDto,
      author: req.user.id,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Request() req,
    @Param('id') recipeId,
    @Body() updateRecipeDto: UpdateRecipeDto,
  ) {
    return this.recipesService.update(req.user.id, recipeId, updateRecipeDto);
  }

  @Get()
  index() {
    return this.recipesService.findAll();
  }

  @Get(':id')
  show(@Param('id') id: string) {
    return this.recipesService.findById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    return this.recipesService.remove(req.user.id, id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/likes')
  createLike(@Request() req, @Param('id') id: string) {
    return this.recipesService.createLike(req.user.id, id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id/likes')
  removeLike(@Request() req, @Param('id') id: string) {
    return this.recipesService.removeLike(req.user.id, id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/comment')
  createComment(@Request() req, @Param('id') id: string, @Body() receiveCommentDto:ReceiveCommmentDto) {
    return this.recipesService.createComment(req.user.id, id, receiveCommentDto.description);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':recipeId/comment/:commentId')
  removeComment(@Request() req, @Param('recipeId') recipeId: string, @Param('commentId')commentId: string) {
    return this.recipesService.removeComment(req.user.id, recipeId, commentId);
  }
  @UseGuards(JwtAuthGuard)
  @Patch(':recipeId/comment/:commentId')
  updateComment(@Request() req, @Param('recipeId') recipeId: string, @Param('commentId')commentId: string, @Body() receiveCommentDto:ReceiveCommmentDto) {
    return this.recipesService.updateComment(req.user.id, recipeId, commentId, receiveCommentDto.description);
  }
}
