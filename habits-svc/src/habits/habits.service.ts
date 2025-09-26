import { Injectable, BadRequestException, ServiceUnavailableException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Habit, HabitDocument } from './habits.schema';

@Injectable()
export class HabitsService {
  constructor(@InjectModel(Habit.name) private habitModel: Model<HabitDocument>) {}

  async create(data: Partial<Habit>): Promise<Habit> {
    const base = process.env.PSYCH_BASE || 'http://psych-svc:8081';
    const studentId = (data as any)?.studentId;
    if (studentId === undefined || studentId === null) {
      throw new BadRequestException('student_id_required');
    }
    try {
      const resp = await fetch(`${base}/api/students/${studentId}`);
      if (!resp.ok) {
        throw new BadRequestException('student_not_found');
      }
    } catch (err) {
      if (err instanceof BadRequestException) throw err;
      throw new ServiceUnavailableException('psych_unreachable');
    }
    const created = new this.habitModel(data);
    return created.save();
  }

  async findByStudent(studentId: number): Promise<Habit[]> {
    return this.habitModel.find({ studentId }).limit(200);
  }
}
