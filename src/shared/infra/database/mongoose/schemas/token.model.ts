import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Token extends Document {
  @Prop({ type: String, required: true })
  _id: string;

  @Prop({ type: String, required: true })
  userId: string;

  @Prop()
  expiresIn: Date;
}

export const TokenSchema = SchemaFactory.createForClass(Token);
