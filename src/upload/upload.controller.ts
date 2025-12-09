import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import express from 'express';
import { UploadService } from './upload.service';
import { Attachment } from './attachment.entity';
import { User } from '../users/user.entity';
import { CurrentUser } from '../common/decorators/current.user.decorator';
import { cloudinaryStorage } from './cloudinary.storage';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('task/:taskId')
  @UseInterceptors(FileInterceptor('file', { storage: cloudinaryStorage }))
  @ApiOperation({ summary: 'Upload file' })
  @ApiResponse({ status: 200, description: 'Upload file successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Param('taskId') taskId: string,
    @CurrentUser() user: User,
  ): Promise<Attachment> {
    return this.uploadService.uploadFile(file, taskId, user?.id);
  }

  @Get('task/:taskId')
  @ApiOperation({ summary: 'Get task' })
  @ApiResponse({ status: 200, description: 'Get task successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not found' })
  getTasksAttachment(
    @Param('taskId') taskId: string,
    @CurrentUser() user: User,
  ) {
    return this.uploadService.getTaskAttachments(taskId, user?.id);
  }

  @Get('download/:id')
  @ApiOperation({ summary: 'Download file' })
  @ApiResponse({ status: 200, description: 'Download file successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not found' })
  async downloadFile(
    @Param('id') id: string,
    @CurrentUser() user: User,
    @Res() response: express.Response,
  ) {
    const attachment = await this.uploadService.getAttachment(id, user?.id);

    response.download(attachment.path, attachment.originalName);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete file' })
  @ApiResponse({ status: 200, description: 'Delete file successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not found' })
  async deleteAttachment(@Param('id') id: string, @CurrentUser() user: User) {
    return this.uploadService.deleteAttachment(id, user?.id);
  }
}
