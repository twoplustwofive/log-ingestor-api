import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Log extends Document {
  @Prop({ required: true, type: Date })
  timestamp: Date;

  @Prop({ index: true })
  level: string;

  @Prop()
  message: string;

  @Prop()
  resourceId: string;

  @Prop()
  traceId: string;

  @Prop()
  spanId: string;

  @Prop()
  commit: string;

  @Prop({
    type: { parentResourceId: String },
  })
  metadata?: { parentResourceId: string };
}

export const LogSchema = SchemaFactory.createForClass(Log);
