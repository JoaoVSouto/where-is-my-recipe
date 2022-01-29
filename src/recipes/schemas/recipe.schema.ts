import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';

import { User } from '../../users/schemas/user.schema';

@Schema({ timestamps: true })
export class Recipe {
  @Prop()
  title: string;

  @Prop()
  ingredients: string;

  @Prop()
  directions: string;

  @Prop()
  servings: number;

  @Prop()
  preparationTime: number;

  @Prop({ type: SchemaTypes.ObjectId, ref: User.name })
  author: Types.ObjectId;
}

export type RecipeDocument = Recipe & Document;

export const RecipeSchema = SchemaFactory.createForClass(Recipe);
