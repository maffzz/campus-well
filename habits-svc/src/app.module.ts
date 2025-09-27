import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HabitsModule } from './habits/habits.module';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://mongo:27017/campuswell')
,
    HabitsModule,
  ],
})
export class AppModule {}
