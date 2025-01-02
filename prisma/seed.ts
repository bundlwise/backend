import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  try {
    // Clean up existing data
    await prisma.$transaction([
      prisma.watch_history.deleteMany(),
      prisma.user_interests.deleteMany(),
      prisma.user_preferences.deleteMany(),
      prisma.user_notifications.deleteMany(),
      prisma.audit_logs.deleteMany(),
      prisma.payments.deleteMany(),
      prisma.subscriptions.deleteMany(),
      prisma.subscription_plans.deleteMany(),
      prisma.profiles.deleteMany(),
      prisma.users.deleteMany(),
      prisma.content_metadata.deleteMany(),
    ]);

    // Create subscription plans
    const basicPlan = await prisma.subscription_plans.create({
      data: {
        name: 'Basic Plan',
        description: 'Watch on one screen at a time in HD',
        price: 8.99,
        duration_days: 30,
        is_trial_available: true,
        max_profiles: 1,
        region_availability: 'GLOBAL',
      },
    });

    const standardPlan = await prisma.subscription_plans.create({
      data: {
        name: 'Standard Plan',
        description: 'Watch on two screens at a time in Full HD',
        price: 13.99,
        duration_days: 30,
        is_trial_available: true,
        max_profiles: 2,
        region_availability: 'GLOBAL',
      },
    });

    // Create test user
    const passwordHash = await hash('password123', 10);
    const user = await prisma.users.create({
      data: {
        email: 'test@example.com',
        password_hash: passwordHash,
        first_name: 'Test',
        last_name: 'User',
        is_verified: true,
        country: 'US',
        language_preference: 'en',
      },
    });

    // Create user profile
    const profile = await prisma.profiles.create({
      data: {
        user_id: user.user_id,
        name: 'Main Profile',
        language_preference: 'en',
      },
    });

    // Create content
    const movies = [
      {
        content_id: 'movie1',
        title: 'The Adventure Begins',
        description: 'An epic journey through time and space',
        genre: 'Adventure',
        duration: 7200, // 2 hours in seconds
        release_date: new Date('2023-01-01'),
        language: 'en',
        is_premium: false,
      },
      {
        content_id: 'movie2',
        title: 'Mystery of the Deep',
        description: 'Underwater thriller that will keep you on the edge',
        genre: 'Thriller',
        duration: 6300, // 1:45 hours in seconds
        release_date: new Date('2023-02-15'),
        language: 'en',
        is_premium: true,
      },
    ];

    for (const movie of movies) {
      await prisma.content_metadata.create({ data: movie });
    }

    // Create subscription
    const subscription = await prisma.subscriptions.create({
      data: {
        user_id: user.user_id,
        plan_id: standardPlan.plan_id,
        start_date: new Date(),
        end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        is_active: true,
        renewal_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });

    // Create payment
    await prisma.payments.create({
      data: {
        user_id: user.user_id,
        subscription_id: subscription.subscription_id,
        amount: standardPlan.price,
        payment_method: 'CREDIT_CARD',
        payment_status: 'COMPLETED',
        transaction_id: 'txn_test_123',
        region: 'US',
      },
    });

    // Create watch history
    await prisma.watch_history.create({
      data: {
        profile_id: profile.profile_id,
        content_id: movies[0].content_id,
        watch_time: 3600, // 1 hour in seconds
        completed: false,
      },
    });

    // Create user preferences
    await prisma.user_preferences.create({
      data: {
        user_id: user.user_id,
        genre_preferences: { favorites: ['Adventure', 'Thriller'] },
        language_preferences: { preferred: ['en'] },
        watch_time_preferences: { preferred_time: 'evening' },
      },
    });

    console.log('Seed data created successfully');
  } catch (error) {
    console.error('Error seeding data:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 