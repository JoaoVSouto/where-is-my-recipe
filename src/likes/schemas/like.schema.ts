import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';

import { User } from '../../users/schemas/user.schema';
import { Recipe } from '../../recipes/schemas/recipe.schema';

@Schema()
export class Like {
  @Prop({ type: SchemaTypes.ObjectId, ref: User.name })
  owner: Types.ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, ref: Recipe.name })
  recipe: Types.ObjectId;
}

export type LikeDocument = Like & Document;

export const LikeSchema = SchemaFactory.createForClass(Like);
