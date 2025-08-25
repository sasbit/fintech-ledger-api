import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type EntryDocument = EntryMongoSchema & Document;

@Schema({ timestamps: true })
export class EntryMongoSchema {
  @Prop({ required: true, unique: true })
  id: string;

  @Prop({ required: true })
  accountId: string;

  @Prop({ required: true, enum: ['DEBIT', 'CREDIT'] })
  type: string;

  @Prop({
    required: true,
    type: {
      amount: { type: Number, required: true },
      currency: { type: String, required: true, default: 'USD' }
    }
  })
  amount: {
    amount: number;
    currency: string;
  };

  @Prop({ required: true, maxlength: 500 })
  description: string;

  @Prop({ maxlength: 100 })
  reference?: string;

  @Prop({ required: false })
  timestamp?: Date;

  @Prop({ type: Object, default: {} })
  metadata: Record<string, any>;

  @Prop({ required: true })
  createdAt: Date;

  @Prop({ required: true })
  updatedAt: Date;
}

export const EntrySchema = SchemaFactory.createForClass(EntryMongoSchema);
