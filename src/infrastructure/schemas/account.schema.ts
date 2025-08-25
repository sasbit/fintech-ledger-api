import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AccountDocument = Account & Document;

@Schema({ timestamps: true })
export class Account {
  @Prop({ required: true, unique: true })
  id: string;

  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true, enum: ['ASSET', 'LIABILITY', 'INCOME', 'EXPENSE'] })
  type: string;

  @Prop({
    required: true,
    type: {
      amount: { type: Number, required: true },
      currency: { type: String, required: true, default: 'USD' }
    }
  })
  balance: {
    amount: number;
    currency: string;
  };

  @Prop({ required: true })
  createdAt: Date;

  @Prop({ required: true })
  updatedAt: Date;
}

export const AccountSchema = SchemaFactory.createForClass(Account);
