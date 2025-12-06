import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { StatsService } from './stats.service';
import { User } from '../users/user.entity';
import { JwtAuthGuard } from '../common/guards/jwt.auth.guard';
import { CurrentUser } from '../common/decorators/current.user.decorator';
import { CategoriesService } from '../categories/categories.service';

@Controller('stats')
@UseGuards(JwtAuthGuard)
export class StatsController {
  constructor(
    private readonly statsService: StatsService,
    private readonly categoriesService: CategoriesService,
  ) {}

  @Get('overview')
  @ApiOperation({ summary: 'Get Overview' })
  @ApiResponse({ status: 200, description: 'Get Overview successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not found' })
  getOverallStats(@CurrentUser() user: User) {
    return this.statsService.getOverallStats(user.id);
  }

  @Get('categories')
  @ApiOperation({ summary: 'Get Categories' })
  @ApiResponse({ status: 200, description: 'Get Categories successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not found' })
  getCategoryStats(@CurrentUser() user: User) {
    return this.categoriesService.getStats(user.id);
  }

  @Get('upcoming')
  @ApiOperation({ summary: 'Get Upcoming' })
  @ApiResponse({ status: 200, description: 'Get Upcoming successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not found' })
  getUpcomingTasks(@CurrentUser() user: User, @Query('limit') limit?: string) {
    return this.statsService.getUpcomingTasks(
      user.id,
      limit ? parseInt(limit) : 10,
    );
  }

  @Get('overdue')
  @ApiOperation({ summary: 'Get Overdue' })
  @ApiResponse({ status: 200, description: 'Get Overdue successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not found' })
  getOverdueTasks(@CurrentUser() user: User) {
    return this.statsService.getOverdueTasks(user.id);
  }

  @Get('recent-activity')
  @ApiOperation({ summary: 'Get Recent Activity' })
  @ApiResponse({
    status: 200,
    description: 'Get Recent activities Successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not found' })
  getRecentActivity(@CurrentUser() user: User, @Query('limit') limit?: string) {
    return this.statsService.getRecentActivity(
      user.id,
      limit ? parseInt(limit) : 10,
    );
  }

  @Get('productivity')
  @ApiOperation({ summary: 'Get Productivity' })
  @ApiResponse({ status: 200, description: 'Get Productivity successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not found' })
  getProductivityTrend(
    @CurrentUser() user: User,
    @Query('days') days?: string,
  ) {
    return this.statsService.getProductivityTrend(
      user.id,
      days ? parseInt(days) : 7,
    );
  }
}
