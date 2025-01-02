import express from 'express';
import type { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import Joi from 'joi';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const prisma = new PrismaClient();

app.use(express.json());

interface UserInput {
  name: string;
  email: string;
  is_active?: boolean;
}

// Validation Schemas
const userSchema = Joi.object<UserInput>({
  name: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  is_active: Joi.boolean(),
});

// Health Check Endpoint
app.get('/', (_req: Request, res: Response): void => {
  res.send('API is running...');
});

// Create a new user
app.post('/users', async (req: Request, res: Response): Promise<void> => {
  const { error, value } = userSchema.validate(req.body);
  if (error) {
    res.status(400).json({ error: error.details[0].message });
    return;
  }

  const { name, email } = value;
  try {
    const user = await prisma.user.create({
      data: {
        name,
        email,
      },
    });
    res.status(201).json(user);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get all users with pagination
app.get('/users', async (req: Request, res: Response): Promise<void> => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  try {
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        skip,
        take: limit,
        orderBy: {
          id: 'asc',
        },
      }),
      prisma.user.count(),
    ]);

    res.json({
      users,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: skip + limit < total,
        hasPreviousPage: page > 1,
      },
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get a single user by ID
app.get('/users/:id', async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
    });
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Update a user by ID
app.put('/users/:id', async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { name, email, is_active } = req.body as Partial<UserInput>;
  try {
    const user = await prisma.user.update({
      where: { id: parseInt(id) },
      data: { name, email, is_active },
    });
    res.json(user);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a user by ID
app.delete('/users/:id', async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    await prisma.user.delete({
      where: { id: parseInt(id) },
    });
    res.json({ message: 'User deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Search users with filters
app.get('/users/search', async (req: Request, res: Response): Promise<void> => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;
  const { name, email, is_active } = req.query;

  try {
    // Build search conditions
    const whereConditions: any = {
      AND: [],
    };

    if (name) {
      whereConditions.AND.push({
        name: {
          contains: String(name),
          mode: 'insensitive',
        },
      });
    }

    if (email) {
      whereConditions.AND.push({
        email: {
          contains: String(email),
          mode: 'insensitive',
        },
      });
    }

    if (is_active !== undefined) {
      whereConditions.AND.push({
        is_active: is_active === 'true',
      });
    }

    // Remove AND if no filters are applied
    if (whereConditions.AND.length === 0) {
      delete whereConditions.AND;
    }

    // Execute search query with pagination
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: {
          id: 'asc',
        },
      }),
      prisma.user.count({
        where: whereConditions,
      }),
    ]);

    res.json({
      users,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: skip + limit < total,
        hasPreviousPage: page > 1,
        filters: {
          name: name || null,
          email: email || null,
          is_active: is_active !== undefined ? is_active === 'true' : null,
        },
      },
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Start the server
const PORT = parseInt(process.env.PORT || '3000');
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});