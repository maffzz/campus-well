import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Habit, HabitDocument } from './habits.schema';

@Injectable()
export class HabitsService {
  constructor(@InjectModel(Habit.name) private habitModel: Model<HabitDocument>) {}

  async create(data: Partial<Habit>): Promise<Habit> {
    const created = new this.habitModel(data);
    return created.save();
  }

  async findByStudent(studentId: number): Promise<Habit[]> {
    return this.habitModel.find({ studentId }).limit(200);
  }
}
