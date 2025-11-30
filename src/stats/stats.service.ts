import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task, TaskPriority, TaskStatus } from '../tasks/task.entity';
import { Attachment } from '../upload/attachment.entity';
import { Category } from '../categories/categories.entity';

interface CategoryRaw {
  category_id: string;
  category_name: string;
  category_color: string;
  taskCount: string;
}

@Injectable()
export class StatsService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
    @InjectRepository(Attachment)
    private attachmentsRepository: Repository<Attachment>,
  ) {}

  async getOverallStats(userId: string) {
    const totalTasks = await this.tasksRepository.count({
      where: { userId },
    });

    const todoTasks = await this.tasksRepository.count({
      where: { userId, status: TaskStatus.TODO },
    });

    const inProgressTasks = await this.tasksRepository.count({
      where: { userId, status: TaskStatus.IN_PROGRESS },
    });

    const doneTasks = await this.tasksRepository.count({
      where: { userId, status: TaskStatus.DONE },
    });

    const highPriorityTasks = await this.tasksRepository.count({
      where: { userId, priority: TaskPriority.HIGH },
    });

    const mediumPriorityTasks = await this.tasksRepository.count({
      where: { userId, priority: TaskPriority.MEDIUM },
    });

    const lowPriorityTasks = await this.tasksRepository.count({
      where: { userId, priority: TaskPriority.LOW },
    });

    const totalCategories = await this.categoriesRepository.count({
      where: { userId },
    });

    const totalAttachments = await this.attachmentsRepository
      .createQueryBuilder('attachment')
      .innerJoin('attachment.task', 'task')
      .where('task.userId = :userId', { userId })
      .getCount();

    const totalStorageResult = await this.attachmentsRepository
      .createQueryBuilder('attachment')
      .innerJoin('attachment.task', 'task')
      .select('SUM(attachment.size)', 'total')
      .where('task.userId = :userId', { userId })
      .getRawOne<{ total: string }>();

    const totalStorageMB =
      parseFloat(totalStorageResult?.total || '0') / (1024 * 1024);

    const completionRate =
      totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

    return {
      overview: {
        totalTasks,
        totalCategories,
        totalAttachments,
        totalStorageMB: parseFloat(totalStorageMB.toFixed(2)),
        completionRate,
      },
      tasksByStatus: {
        todo: todoTasks,
        inProgress: inProgressTasks,
        done: doneTasks,
      },
      tasksByPriority: {
        high: highPriorityTasks,
        medium: mediumPriorityTasks,
        low: lowPriorityTasks,
      },
    };
  }

  async getCategoryStats(userId: string) {
    const categories = await this.categoriesRepository
      .createQueryBuilder('category')
      .leftJoin('category.tasks', 'task')
      .where('category.userId = :userId', { userId })
      .select([
        'category.id',
        'category.name',
        'category.color',
        'COUNT(task.id) as taskCount',
      ])
      .groupBy('category.id')
      .addGroupBy('category.name')
      .addGroupBy('category.color')
      .getRawMany<CategoryRaw>();

    return categories.map((cat) => ({
      id: cat.category_id,
      name: cat.category_name,
      color: cat.category_color,
      taskCount: parseInt(cat.taskCount) || 0,
    }));
  }

  async getUpcomingTasks(userId: string, limit = 10) {
    const now = new Date();

    return this.tasksRepository
      .createQueryBuilder('task')
      .where('task.userId = :userId', { userId })
      .andWhere('task.status != :status', { status: TaskStatus.DONE })
      .andWhere('task.dueDate IS NOT NULL')
      .andWhere('task.dueDate >= :now', { now })
      .orderBy('task.dueDate', 'ASC')
      .limit(limit)
      .getMany();
  }

  async getOverdueTasks(userId: string) {
    const now = new Date();

    return this.tasksRepository
      .createQueryBuilder('task')
      .where('task.userId = :userId', { userId })
      .andWhere('task.status != :status', { status: TaskStatus.DONE })
      .andWhere('task.dueDate IS NOT NULL')
      .andWhere('task.dueDate < :now', { now })
      .orderBy('task.dueDate', 'ASC')
      .getMany();
  }

  async getRecentActivity(userId: string, limit = 10) {
    const recentTasks = await this.tasksRepository
      .createQueryBuilder('task')
      .leftJoinAndSelect('task.category', 'category')
      .where('task.userId = :userId', { userId })
      .orderBy('task.updatedAt', 'DESC')
      .limit(limit)
      .getMany();

    return recentTasks.map((task) => ({
      id: task.id,
      title: task.title,
      status: task.status,
      priority: task.priority,
      category: task.category
        ? { id: task.category.id, name: task.category.name }
        : null,
      updatedAt: task.updatedAt,
    }));
  }

  async getProductivityTrend(userId: string, days = 7) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const completedTasks = await this.tasksRepository
      .createQueryBuilder('task')
      .select('DATE(task.updatedAt)', 'date')
      .addSelect('COUNT(*)', 'count')
      .where('task.userId = :userId', { userId })
      .andWhere('task.status = :status', { status: TaskStatus.DONE })
      .andWhere('task.updatedAt >= :startDate', { startDate })
      .groupBy('DATE(task.updatedAt)')
      .orderBy('DATE(task.updatedAt)', 'ASC')
      .getRawMany<{ date: string; count: string }>();

    return completedTasks.map((item) => ({
      date: item.date,
      completedTasks: parseInt(item.count),
    }));
  }
}
