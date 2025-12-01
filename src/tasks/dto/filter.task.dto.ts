import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { TaskPriority, TaskStatus } from '../task.entity';

export class FilterTaskDto {
  @ApiProperty({
    example: 'search with task status ( done, in-progress, ... )',
    description: 'Search with task status',
  })
  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;

  @ApiProperty({
    example: 'task status ( low, high, ... )',
    description: 'Search with task priority',
  })
  @IsEnum(TaskPriority)
  @IsOptional()
  priority?: TaskPriority;

  @ApiProperty({
    example: 'task status ( done, in-progress, ... )',
    description:
      'Search with task another way ( task title or task description, ...)',
  })
  @IsString()
  @IsOptional()
  search?: string;
}
