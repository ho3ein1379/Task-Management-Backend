import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './categories.entity';
import { CreateCategoryDto } from './dto/create.category.dto';
import { UpdateCategoryDto } from './dto/update.category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

  async create(
    createCategoryDto: CreateCategoryDto,
    userId: string,
  ): Promise<Category> {
    const category = this.categoriesRepository.create({
      ...createCategoryDto,
      userId,
    });
    return this.categoriesRepository.save(category);
  }

  async findAll(userId: string): Promise<Category[]> {
    return this.categoriesRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string, userId: string): Promise<Category> {
    const category = await this.categoriesRepository.findOne({
      where: { id, userId },
      relations: ['tasks'],
    });

    if (!category) {
      throw new NotFoundException(`Category with ID "${id}" not found`);
    }

    return category;
  }

  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
    userId: string,
  ): Promise<Category> {
    const category = await this.findOne(id, userId);

    Object.assign(category, updateCategoryDto);

    return this.categoriesRepository.save(category);
  }

  async remove(id: string, userId: string): Promise<void> {
    const category = await this.findOne(id, userId);
    await this.categoriesRepository.remove(category);
  }

  async getStats(userId: string) {
    const categories = await this.categoriesRepository
      .createQueryBuilder('category')
      .leftJoinAndSelect('category.tasks', 'task')
      .where('category.userId = :userId', { userId })
      .getMany();

    return categories.map((category) => ({
      id: category.id,
      name: category.name,
      color: category.color,
      taskCount: category.tasks?.length || 0,
    }));
  }
}
