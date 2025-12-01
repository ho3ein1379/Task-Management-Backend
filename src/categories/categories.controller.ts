import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt.auth.guard';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create.category.dto';
import { User } from '../users/user.entity';
import { CurrentUser } from '../common/decorators/current.user.decorator';
import { UpdateCategoryDto } from './dto/update.category.dto';

@Controller('categories')
@UseGuards(JwtAuthGuard)
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new category' })
  @ApiResponse({
    status: 200,
    description: 'Create a new category successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  create(
    @Body() createCategoryDto: CreateCategoryDto,
    @CurrentUser() user: User,
  ) {
    return this.categoriesService.create(createCategoryDto, user.id);
  }
  @Get()
  @ApiOperation({ summary: 'Get all categories' })
  @ApiResponse({ status: 200, description: 'Get all categories successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not found' })
  findAll(@CurrentUser() user: User) {
    return this.categoriesService.findAll(user.id);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get category stats' })
  @ApiResponse({ status: 200, description: 'Get category stats successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not found' })
  getStats(@CurrentUser() user: User) {
    return this.categoriesService.getStats(user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get category by id' })
  @ApiResponse({ status: 200, description: 'Get category by id successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not found' })
  findOne(@Param('id') id: string, @CurrentUser() user: User) {
    return this.categoriesService.findOne(id, user.id);
  }
  @Patch(':id')
  @ApiOperation({ summary: 'Update category by id' })
  @ApiResponse({
    status: 200,
    description: 'Update category by id successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not found' })
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @CurrentUser() user: User,
  ) {
    return this.categoriesService.update(id, updateCategoryDto, user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete category by id' })
  @ApiResponse({
    status: 200,
    description: 'Delete category by id successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not found' })
  remove(@Param('id') id: string, @CurrentUser() user: User) {
    return this.categoriesService.remove(id, user.id);
  }
}
