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
import { JwtAuthGuard } from '../common/guards/jwt.auth.guard';
import { CurrentUser } from '../common/decorators/current.user.decorator';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create.task.dto';
import { User } from '../users/user.entity';
import { FilterTaskDto } from './dto/filter.task.dto';
import { UpdateTaskDto } from './dto/update.task.dto';

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  Create(@Body() createTaskDto: CreateTaskDto, @CurrentUser() user: User) {
    return this.tasksService.create(createTaskDto, user.id);
  }

  @Get()
  findAll(@CurrentUser() user: User, @Query() filterDto: FilterTaskDto) {
    return this.tasksService.findAll(user.id, filterDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: User) {
    return this.tasksService.findOne(id, user.id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @CurrentUser() user: User,
  ) {
    return this.tasksService.update(id, updateTaskDto, user.id);
  }
  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: User) {
    return this.tasksService.remove(id, user.id);
  }
}
