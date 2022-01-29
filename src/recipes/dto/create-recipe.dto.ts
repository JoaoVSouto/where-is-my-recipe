import { IsString, IsNumber, IsMongoId } from 'class-validator';

export class CreateRecipeDto {
  @IsString()
  name: string;

  @IsString()
  ingredients: string;

  @IsString()
  directions: string;

  @IsNumber()
  servings: number;

  @IsNumber()
  preparationTime: number;

  @IsMongoId()
  author: string;
}
