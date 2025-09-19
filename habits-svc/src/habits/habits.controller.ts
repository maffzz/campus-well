import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { HabitsService } from './habits.service';
import { Habit } from './habits.schema';

@Controller()
export class HabitsController {
  constructor(private readonly habitsService: HabitsService) {}

  @Get('habits/:studentId')
  async list(@Param('studentId') id: number): Promise<Habit[]> {
    return this.habitsService.findByStudent(id);
  }

  @Post('habits')
  async create(@Body() dto: Partial<Habit>): Promise<Habit> {
    return this.habitsService.create(dto);
  }

  @Get('health')
  getHealth() {
    return { status: 'ok' };
  }
}

