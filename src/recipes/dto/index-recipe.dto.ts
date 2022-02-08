import { IsOptional, IsString, Matches } from 'class-validator';

export class IndexRecipeDto {
  @IsOptional()
  @Matches(/^title|likes|preparationTime|createdAt$/i)
  orderBy: string;

  @IsOptional()
  @Matches(/^asc|desc$/i)
  sort: string;

  @IsOptional()
  @IsString()
  title: string;
}
