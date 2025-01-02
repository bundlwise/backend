import { PrismaClient, Prisma } from '@prisma/client';
import { ApiError } from '../utils/api-error';
import { UserInput } from '../models/schemas/user.schema';
import { userSchema } from '../models/schemas/user.schema';
import { hashPassword } from '../utils/auth';

export class UsersService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async createUser(data: UserInput) {
    try {
      const validatedData = userSchema.parse(data);
      
      // Check if email already exists
      const existingUser = await this.prisma.users.findFirst({
        where: { email: validatedData.email },
      });

      if (existingUser) {
        throw new ApiError('Email already registered', 409);
      }

      const hashedPassword = await hashPassword(validatedData.password);

      const user = await this.prisma.users.create({
        data: {
          ...validatedData,
          password_hash: hashedPassword,
        },
        select: {
          user_id: true,
          email: true,
          first_name: true,
          last_name: true,
          created_at: true,
        },
      });

      return user;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to create user', 500);
    }
  }

  async getUserById(id: number) {
    try {
      const user = await this.prisma.users.findUnique({
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

      if (!user) {
        throw new ApiError('User not found', 404);
      }

      return user;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to fetch user', 500);
    }
  }

  async updateUser(id: number, data: Partial<UserInput>) {
    try {
      const validatedData = userSchema.partial().parse(data);

      if (validatedData.password) {
        validatedData.password_hash = await hashPassword(validatedData.password);
        delete validatedData.password;
      }

      const user = await this.prisma.users.update({
        where: { user_id: id },
        data: validatedData,
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

      return user;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new ApiError('User not found', 404);
        }
      }
      throw new ApiError('Failed to update user', 500);
    }
  }

  async deleteUser(id: number) {
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