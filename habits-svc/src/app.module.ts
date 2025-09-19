import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HabitsModule } from './habits/habits.module';

@Module({
  imports: [
    // 👇 Aquí configuras la conexión a Mongo
    MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost:27017/campuswell'),
    HabitsModule,
  ],
})
export class AppModule {}
