// import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
// import { Document } from "mongoose";

// Database schema definition (MongoDB example)

// @Schema({ collection: "examples", timestamps: true })
export class ExampleSchema {
  // @Prop({ required: true })
  name: string;

  // @Prop({ required: true, min: 0 })
  amount: number;

  // @Prop({ default: true })
  isActive: boolean;

  // Timestamps are added automatically by mongoose
  createdAt: Date;
  updatedAt: Date;

  // TODO: Add more properties, validations, indexes as needed
}

// export const ExampleSchemaFactory = SchemaFactory.createForClass(ExampleSchema);

// TODO: Add indexes for better performance
// ExampleSchemaFactory.index({ name: 1 });
// ExampleSchemaFactory.index({ amount: -1 });
