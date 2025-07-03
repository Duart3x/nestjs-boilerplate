import { Module } from '@nestjs/common';
import { FileModule } from './file/file.module';
import { HealthModule } from './health/health.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from '@/database/prisma.module';

@Module({
  imports: [HealthModule, UserModule, FileModule, PrismaModule],
})
export class ApiModule {}
