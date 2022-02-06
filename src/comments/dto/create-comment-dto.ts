import { IsMongoId, IsString, IsNotEmpty } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty()
  description: string;

  @IsMongoId()
  author: string;

  @IsMongoId()
  recipe: string;
}
export class ReceiveCommmentDto {
  @IsString()
  @IsNotEmpty()
  description: string;
}
