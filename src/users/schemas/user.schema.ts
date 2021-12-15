import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class User {
  @Prop()
  id: number;

  @Prop()
  name: string;

  @Prop()
  email: string;

  @Prop()
  passwordHash: string;

  @Prop()
  wantEmails: boolean;
}

export type UserDocument = User & Document;

export const UserSchema = SchemaFactory.createForClass(User);
