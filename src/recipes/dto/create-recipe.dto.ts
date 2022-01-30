import { OmitType } from '@nestjs/mapped-types';
import {
  IsString,
  IsNumber,
  IsMongoId,
  IsPositive,
  IsNotEmpty,
} from 'class-validator';

export class CreateRecipeDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  ingredients: string;

  @IsString()
  @IsNotEmpty()
  directions: string;

  @IsNumber({ allowNaN: false, allowInfinity: false, maxDecimalPlaces: 0 })
  @IsPositive()
  servings: number;

  @IsNumber({ allowNaN: false, allowInfinity: false, maxDecimalPlaces: 0 })
  @IsPositive()
  preparationTime: number;

  @IsMongoId()
  author: string;
}

export class CreateRecipeWithoutAuthorDto extends OmitType(CreateRecipeDto, [
  'author',
]) {}
