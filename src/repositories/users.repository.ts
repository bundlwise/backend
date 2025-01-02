import { Prisma } from '@prisma/client';
import { BaseRepository } from './base.repository';
import { ApiError } from '../utils/api-error';
import { UserInput } from '../models/schemas/user.schema';

export class UsersRepository extends BaseRepository {
  async findByEmail(email: string) {
    try {
      return await this.prisma.users.findFirst({
        where: { email },
      });
    } catch (error) {
      throw new ApiError('Database error while fetching user', 500);
    }
  }

  async findById(id: number) {
    try {
      return await this.prisma.users.findUnique({
        where: { user_id: id },
        select: {
          user_id: true,
          email: true,
          first_name: true,
          last_name: true,
          phone_number: true,
          country: true,
          language_preference: true,
          is_verified: true,
          created_at: true,
        },
      });
    } catch (error) {
      throw new ApiError('Database error while fetching user', 500);
    }
  }

  async create(data: UserInput & { password_hash: string }) {
    try {
      return await this.prisma.users.create({
        data,
        select: {
          user_id: true,
          email: true,
          first_name: true,
          last_name: true,
          created_at: true,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ApiError('Email already exists', 409);
        }
      }
      throw new ApiError('Failed to create user', 500);
    }
  }

  async update(id: number, data: Partial<UserInput> & { password_hash?: string }) {
    try {
      return await this.prisma.users.update({
        where: { user_id: id },
        data,
        select: {
          user_id: true,
          email: true,
          first_name: true,
          last_name: true,
          phone_number: true,
          country: true,
          language_preference: true,
          is_verified: true,
          updated_at: true,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new ApiError('User not found', 404);
        }
      }
      throw new ApiError('Failed to update user', 500);
    }
  }

  async delete(id: number) {
    try {
      await this.prisma.users.delete({
        where: { user_id: id },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new ApiError('User not found', 404);
        }
      }
      throw new ApiError('Failed to delete user', 500);
    }
  }
} 