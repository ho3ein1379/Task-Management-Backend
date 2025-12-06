import { Module } from '@nestjs/common';
import { StatsController } from './stats.controller';
import { StatsService } from './stats.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from '../tasks/task.entity';
import { Category } from '../categories/categories.entity';
import { Attachment } from '../upload/attachment.entity';
import { CategoriesModule } from '../categories/categories.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Task, Category, Attachment]),
    CategoriesModule,
  ],
  controllers: [StatsController],
  providers: [StatsService],
})
export class StatsModule {}
