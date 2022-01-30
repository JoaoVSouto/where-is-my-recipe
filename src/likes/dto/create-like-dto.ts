import { IsMongoId } from 'class-validator';

export class CreateLikeDto {
  @IsMongoId()
  owner: string;

  @IsMongoId()
  recipe: string;
}
