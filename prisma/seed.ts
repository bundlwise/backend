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

    // Create subscription plans with realistic details
    const basicPlan = await prisma.subscription_plans.create({
      data: {
        name: 'Basic Plan',
        description: 'Stream on one device in HD quality.',
        price: 9.99,
        duration_days: 30,
        is_trial_available: true,
        max_profiles: 1,
        region_availability: 'GLOBAL',
      },
    });

    const standardPlan = await prisma.subscription_plans.create({
      data: {
        name: 'Standard Plan',
        description: 'Enjoy on two devices simultaneously in Full HD.',
        price: 14.99,
        duration_days: 30,
        is_trial_available: true,
        max_profiles: 2,
        region_availability: 'GLOBAL',
      },
    });

    // Create a genuine user with realistic details
    const passwordHash = await hash('SecureP@ssw0rd!', 10);
    const user = await prisma.users.create({
      data: {
        email: 'jane.doe@example.com',
        password_hash: passwordHash,
        first_name: 'Jane',
        last_name: 'Doe',
        is_verified: true,
        country: 'US',
        language_preference: 'en',
      },
    });

    // Create user profile
    const profile = await prisma.profiles.create({
      data: {
        user_id: user.user_id,
        name: "Jane's Profile",
        language_preference: 'en',
      },
    });

    // Create content with realistic movie data
    const movies = [
      {
        content_id: 'mv_001',
        title: 'Lost Horizons',
        description: 'An evocative journey through the landscapes of memory and dreams.',
        genre: 'Drama',
        duration: 7500, // approx 2 hours 5 minutes
        release_date: new Date('2022-11-10'),
        language: 'en',
        is_premium: false,
      },
      {
        content_id: 'mv_002',
        title: 'City of Echoes',
        description: 'A thrilling dive into the secrets hidden within a sprawling metropolis.',
        genre: 'Thriller',
        duration: 6800, // approx 1 hour 53 minutes
        release_date: new Date('2023-03-20'),
        language: 'en',
        is_premium: true,
      },
    ];

    for (const movie of movies) {
      await prisma.content_metadata.create({ data: movie });
    }

    // Create a subscription for the user
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

    // Record a payment for the subscription
    await prisma.payments.create({
      data: {
        user_id: user.user_id,
        subscription_id: subscription.subscription_id,
        amount: standardPlan.price,
        payment_method: 'CREDIT_CARD',
        payment_status: 'COMPLETED',
        transaction_id: 'txn_987654321',
        region: 'US',
      },
    });

    // Log watch history for the user
    await prisma.watch_history.create({
      data: {
        profile_id: profile.profile_id,
        content_id: movies[0].content_id,
        watch_time: 4200, // e.g., 70 minutes watched
        completed: false,
      },
    });

    // Set realistic user preferences
    await prisma.user_preferences.create({
      data: {
        user_id: user.user_id,
        genre_preferences: { favorites: ['Drama', 'Thriller'] },
        language_preferences: { preferred: ['en'] },
        watch_time_preferences: { preferred_time: 'evening' },
      },
    });

    console.log('Genuine seed data created successfully');
  } catch (error) {
    console.error('Error seeding genuine data:', error);
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