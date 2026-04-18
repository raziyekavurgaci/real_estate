import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum UserRole {
  AGENCY = 'AGENCY',
  AGENT = 'AGENT',
}

@Schema({ timestamps: true, versionKey: false })
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

  // AGENT'ların bağlı olduğu ana AGENCY'yi referans alır
  @Prop({ type: Types.ObjectId, ref: 'User' })
  agency?: User;

  @Prop({ type: String, select: false, default: null })
  refreshToken: string | null;
}

export const UserSchema = SchemaFactory.createForClass(User);
