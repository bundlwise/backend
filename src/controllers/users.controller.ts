import { Context } from 'hono';
import { UsersService } from '../services/users.service';
import { ApiError } from '../utils/api-error';
import { UserInput } from '../models/schemas/user.schema';

export class UsersController {
  private service: UsersService;

  constructor() {
    this.service = new UsersService();
  }

  register = async (c: Context) => {
    try {
      const data = await c.req.json() as UserInput;
      const user = await this.service.createUser(data);
      return c.json({ success: true, data: user }, 201);
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to register user', 500);
    }
  };

  getProfile = async (c: Context) => {
    try {
      const userId = Number(c.param('id'));
      const user = await this.service.getUserById(userId);
      
      if (!user) {
        throw new ApiError('User not found', 404);
      }
      
      return c.json({ success: true, data: user });
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to fetch user profile', 500);
    }
  };

  updateProfile = async (c: Context) => {
    try {
      const userId = Number(c.param('id'));
      const data = await c.req.json() as Partial<UserInput>;
      const user = await this.service.updateUser(userId, data);
      return c.json({ success: true, data: user });
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to update user profile', 500);
    }
  };

  deleteAccount = async (c: Context) => {
    try {
      const userId = Number(c.param('id'));
      await this.service.deleteUser(userId);
      return c.json({ success: true, message: 'Account deleted successfully' });
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to delete account', 500);
    }
  };
} 