import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { Category } from './categories.entity';
import { Task } from '../tasks/task.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Category, Task])],
  providers: [CategoriesService],
  controllers: [CategoriesController],
  exports: [CategoriesService],
})
export class CategoriesModule {}
