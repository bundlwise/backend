# Bundlwise Backend Documentation 📚

## Table of Contents
- [Project Structure](#project-structure)
- [Technology Stack](#technology-stack)
- [Setup Guide](#setup-guide)
- [Database Management](#database-management)
- [Development Guide](#development-guide)
- [API Documentation](#api-documentation)
- [Common Issues](#common-issues)

## Project Structure 🏗️

```bash
bundlwise_backend/
├── prisma/
│   ├── schema.prisma    # Database schema
│   ├── seed.ts         # Seed data
│   └── migrations/     # Database migrations
├── src/
│   ├── controllers/    # Request handlers
│   ├── services/       # Business logic
│   ├── models/        # Data models
│   ├── routes/        # API routes
│   ├── middleware/    # Express middleware
│   ├── utils/         # Helper functions
│   └── config/        # Configuration files
└── .env               # Environment variables
```

## Technology Stack 🛠️

- **Node.js & TypeScript**
- **Database**: PostgreSQL
- **ORM**: Prisma
- **API Framework**: Hono
- **Authentication**: JWT

## Setup Guide 🚀

### 1. Environment Setup
```bash
# Create .env file
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/bundlwise"
PORT=3000
JWT_SECRET="your-secret-key"
NODE_ENV="development"
```

### 2. Database Setup
```bash
# Start PostgreSQL
brew services start postgresql

# Create Database
createdb bundlwise

# Verify
psql -l | grep bundlwise
```

### 3. Project Setup
```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Seed database
npx prisma db seed
```

### 4. Start Development Server
```bash
npm run dev
```

## Database Management 🐘

### Prisma Commands
```bash
# Update database schema
npx prisma migrate dev

# Reset database
npx prisma migrate reset

# View data in GUI
npx prisma studio
```

### Schema Structure
```prisma
// Example from schema.prisma
model users {
  user_id    Int      @id @default(autoincrement())
  email      String   @unique
  // ... other fields
}
```

### Seed Data
- Test user: jane.doe@example.com
- Test movies and content
- Subscription plans
- Watch history

## Development Guide 💻

### Running the Project
```bash
# Development mode
npm run dev

# Build project
npm run build

# Type checking
npm run type-check
```

### API Structure
- Controllers handle requests
- Services contain business logic
- Models define data structures
- Routes define API endpoints

### Testing
```bash
# Run tests (currently disabled)
# npm test

# Test specific file (currently disabled)
# npm test -- users.test.ts
```

## API Documentation 📝

### Authentication
```typescript
// Login
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "password123"
}

// Register
POST /api/auth/register
{
  "email": "new@example.com",
  "password": "newpass123"
}
```

### Content Endpoints
```typescript
// Get all content
GET /api/content

// Get single content
GET /api/content/:id
```

## Common Issues & Solutions 🔧

### Database Connection Issues
```bash
# Check PostgreSQL status
brew services list

# Restart PostgreSQL
brew services restart postgresql
```

### Prisma Issues
```bash
# Regenerate Prisma client
npx prisma generate --force

# Reset database
npx prisma migrate reset
```

### Server Issues
```bash
# Clear node modules
rm -rf node_modules
npm install

# Check logs
tail -f logs/app.log
```

## Best Practices 💡

1. **Code Organization**
   - Use proper folder structure
   - Follow naming conventions
   - Keep controllers thin

2. **Database**
   - Use migrations for changes
   - Backup data regularly
   - Use transactions for related operations

3. **Security**
   - Never commit .env files
   - Use proper authentication
   - Validate all inputs

4. **Development**
   - Write clean, documented code
   - Use TypeScript features
   - Handle errors properly

## Deployment Checklist ✅

- [ ] Environment variables set
- [ ] Database migrations applied
- [ ] Build successful
- [ ] Tests passing
- [ ] API documentation updated
- [ ] Security checks done

## Useful Commands 🛠️

```bash
# Database
psql -U postgres -d bundlwise
npx prisma studio

# Development
npm run dev
npm run build
npm run lint

# Deployment
npm run build
npm start
```

## Need Help? 🤝

- Check the error logs
- Review Prisma documentation
- Check Node.js version
- Verify PostgreSQL connection
- Review environment variables

## Artifact Repository Setup

If you're deploying to Google Cloud Run and using Artifact Registry, you'll need to create a Docker repository in your Google Cloud project (bundlwise16). You can create a repository by running the following command in Cloud Shell (or any terminal where the Google Cloud SDK is installed):

```bash
gcloud services enable artifactregistry.googleapis.com

gcloud artifacts repositories create bundlwise-backend \
  --repository-format=docker \
  --location=asia-south1 \
  --description="Docker repository for bundlwise-backend"
```

This will set up the repository in the specified region so your Docker images can be pushed successfully.

---

Last Updated: [Current Date]
Version: 1.0.0