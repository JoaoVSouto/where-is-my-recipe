import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';

import { User } from '../../users/schemas/user.schema';
import { Recipe } from '../../recipes/schemas/recipe.schema';
@Schema()
export class Comment{
    @Prop()
    description: string;

    @Prop({ type: SchemaTypes.ObjectId, ref: User.name })
    author: Types.ObjectId;

    @Prop({ type: SchemaTypes.ObjectId, ref: Recipe.name })
    recipe: Types.ObjectId;
}

export type CommentDocument = Comment & Document;

export const CommentSchema = SchemaFactory.createForClass(Comment);