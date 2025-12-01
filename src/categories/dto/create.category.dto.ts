import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({
    example: 'category name',
    description: 'Set name for new category',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'category description',
    description: 'Set description for new category',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: 'category color',
    description: 'Set color for new category',
  })
  @IsString()
  @IsOptional()
  @Matches(/^#[0-9A-F]{6}$/i, {
    message: 'Color must be a valid hex color (e.g., #FF5733)',
  })
  color?: string;
}
