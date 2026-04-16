import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum UserRole {
  ADMIN = 'ADMIN',
  AGENT = 'AGENT',
}

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, select: false }) 
  password: string;

  @Prop({ required: true })
  fullName: string;

  @Prop({
    type: String,
    enum: UserRole,
    default: UserRole.AGENT,
  })
  role: UserRole;

  @Prop({ select: false })
  refreshToken?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
