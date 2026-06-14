import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../shared/prisma/prisma.service';

@Injectable()
export class LogoutSessionUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(userId?: string | null) {
    if (!userId) return;
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshTokenHash: null },
    });
  }
}
