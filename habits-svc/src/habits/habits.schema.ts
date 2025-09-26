import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type HabitDocument = Habit & Document;

@Schema()
export class Habit {
  @Prop()
  studentId: number;

  @Prop()
  sleepHours: number;

  @Prop()
  exerciseMinutes: number;

  @Prop()
  mood: string;

  @Prop({ default: Date.now })
  date: Date;
}

export const HabitSchema = SchemaFactory.createForClass(Habit);
