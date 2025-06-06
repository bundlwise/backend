import { PrismaClient } from '@prisma/client';

export abstract class BaseRepository {
  protected prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }
} 