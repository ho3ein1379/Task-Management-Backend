import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { StatsService } from './stats.service';
import { User } from '../users/user.entity';
import { JwtAuthGuard } from '../common/guards/jwt.auth.guard';
import { CurrentUser } from '../common/decorators/current.user.decorator';

@Controller('stats')
@UseGuards(JwtAuthGuard)
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get('overview')
  getOverallStats(@CurrentUser() user: User) {
    return this.statsService.getOverallStats(user.id);
  }

  @Get('categories')
  getCategoryStats(@CurrentUser() user: User) {
    return this.statsService.getCategoryStats(user.id);
  }

  @Get('upcoming')
  getUpcomingTasks(@CurrentUser() user: User, @Query('limit') limit?: string) {
    return this.statsService.getUpcomingTasks(
      user.id,
      limit ? parseInt(limit) : 10,
    );
  }

  @Get('overdue')
  getOverdueTasks(@CurrentUser() user: User) {
    return this.statsService.getOverdueTasks(user.id);
  }

  @Get('recent-activity')
  getRecentActivity(@CurrentUser() user: User, @Query('limit') limit?: string) {
    return this.statsService.getRecentActivity(
      user.id,
      limit ? parseInt(limit) : 10,
    );
  }

  @Get('productivity')
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
