import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';

@Schema()
export class User {
  @ApiProperty({
    example: 'John Doe',
    description: 'Name of the user',
  })
  @Prop()
  name: string;

  @ApiProperty({
    example: 'john@doe.com',
    description: 'Email of the user',
  })
  @Prop()
  email: string;

  @Prop()
  passwordHash: string;

  @ApiProperty({
    example: true,
    description: 'Indicator if the user wants to receive emails',
  })
  @Prop()
  wantEmails: boolean;
}

export type UserDocument = User & Document;

export const UserSchema = SchemaFactory.createForClass(User);
