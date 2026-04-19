import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../../users/schemas/user.schema';

@Schema({ timestamps: true, versionKey: false })
export class Listing extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  location: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  listingAgent: User;
}

export const ListingSchema = SchemaFactory.createForClass(Listing);
