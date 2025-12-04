import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt.auth.guard';
import { CurrentUser } from '../common/decorators/current.user.decorator';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create.task.dto';
import { User } from '../users/user.entity';
import { UpdateTaskDto } from './dto/update.task.dto';
import { GetTasksQueryDto } from './dto/get.tasks.query-dto';

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new task' })
  @ApiResponse({ status: 200, description: 'Create a new task successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  Create(@Body() createTaskDto: CreateTaskDto, @CurrentUser() user: User) {
    return this.tasksService.create(createTaskDto, user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all tasks' })
  @ApiResponse({ status: 200, description: 'Get all tasks successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not found' })
  findAll(@CurrentUser() user: User, @Query() query: GetTasksQueryDto) {
    const { page, limit, ...filterDto } = query;
    return this.tasksService.findAll(user.id, filterDto, { page, limit });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get task by id' })
  @ApiResponse({ status: 200, description: 'Get task by id successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not found' })
  findOne(@Param('id') id: string, @CurrentUser() user: User) {
    return this.tasksService.findOne(id, user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update task by id' })
  @ApiResponse({ status: 200, description: 'Update task successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not found' })
  update(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @CurrentUser() user: User,
  ) {
    return this.tasksService.update(id, updateTaskDto, user.id);
  }
  @Delete(':id')
  @ApiOperation({ summary: 'Delete task by id' })
  @ApiResponse({ status: 200, description: 'Delete task successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not found' })
  remove(@Param('id') id: string, @CurrentUser() user: User) {
    return this.tasksService.remove(id, user.id);
  }
}
