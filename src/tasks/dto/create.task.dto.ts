import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { TaskPriority, TaskStatus } from '../task.entity';

export class CreateTaskDto {
  @ApiProperty({
    example: 'task title',
    description: 'Set title for new task',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: 'task description',
    description: 'Set description for new task',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: 'task status ( done, in-progress, ... )',
    description: 'Set status for new task',
  })
  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;

  @ApiProperty({
    example: 'task enum ( high, low, ... )',
    description: 'Set enum for new task',
  })
  @IsEnum(TaskPriority)
  @IsOptional()
  priority?: TaskPriority;

  @ApiProperty({
    example: 'task date',
    description: 'Set date for new task',
  })
  @IsDateString()
  @IsOptional()
  dueDate?: Date;

  @ApiProperty({
    example: 'task category-id',
    description: 'Set category-id for new task',
  })
  @IsUUID()
  @IsOptional()
  categoryId?: string;
}
