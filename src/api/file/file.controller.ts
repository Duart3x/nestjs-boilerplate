import { AuthGuard } from '@/auth/auth.guard';
import { File } from '@nest-lab/fastify-multer';
import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';

import FileUploadInterceptor from '@/interceptors/file-upload.interceptor';
import { FileService } from './file.service';

@ApiTags('file')
@Controller({
  path: 'file',
  version: '1',
})
@UseGuards(AuthGuard)
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @ApiOperation({ summary: 'Uploads a single file' })
  @ApiBody({
    required: true,
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileUploadInterceptor('file'))
  @Post('/upload/single')
  uploadFile(@UploadedFile() file: File) {
    if (!file) {
      throw new BadRequestException('File is required.');
    }
    return this.fileService.uploadFile(file);
  }

  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Uploads multiple files' })
  @UseInterceptors(FileUploadInterceptor('files', { multiple: true }))
  @ApiBody({
    required: true,
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  @Post('/upload/multiple')
  uploadFiles(@UploadedFiles() files: Array<File>) {
    if (!files.length) {
      throw new BadRequestException('Files are required.');
    }

    return this.fileService.uploadMultipleFiles(files);
  }
}
