import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PostingDocument = Posting & Document;

@Schema({ timestamps: true })
export class Posting {
  @Prop({ required: true, unique: true })
  id: string;

  @Prop({ required: true, type: [Object] })
  entries: Array<{
    id: string;
    accountId: string;
    type: string;
    amount: {
      amount: number;
      currency: string;
    };
    description: string;
    reference?: string;
    timestamp?: Date;
    metadata?: Record<string, any>;
  }>;

  @Prop({ required: true, unique: true })
  reference: string;

  @Prop({ required: true, maxlength: 500 })
  description: string;

  @Prop({ type: Object, default: {} })
  metadata: Record<string, any>;

  @Prop({ required: true })
  previousHash: string;

  @Prop({ required: true, unique: true })
  hash: string;

  @Prop({ required: true })
  createdAt: Date;

  @Prop({ required: true })
  updatedAt: Date;
}

export const PostingSchema = SchemaFactory.createForClass(Posting);
