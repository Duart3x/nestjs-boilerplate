import { SocketModule } from '@/shared/socket/socket.module';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health.controller';
import { PrismaModule } from '@/database/prisma.module';

@Module({
  imports: [TerminusModule, HttpModule, SocketModule, PrismaModule],
  controllers: [HealthController],
})
export class HealthModule {}
