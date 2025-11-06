import { PrismaClient } from '@prisma/client';
import { villas } from './data/villas';
import { initialPosts } from './data/bulletin';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');
  console.log(`📊 Found ${villas.length} villas to seed`);

  // Use UPSERT so we don't break foreign key constraints
  for (const villa of villas) {
    const createdVilla = await prisma.villa.upsert({
      where: { id: villa.id },
      update: {
        name: villa.name,
        description: villa.description,
        image: villa.image,
        bedrooms: villa.bedrooms,
        bathrooms: villa.bathrooms,
        guests: villa.guests,
        amenities: JSON.stringify(villa.amenities),
      },
      create: {
        id: villa.id,
        name: villa.name,
        description: villa.description,
        image: villa.image,
        bedrooms: villa.bedrooms,
        bathrooms: villa.bathrooms,
        guests: villa.guests,
        amenities: JSON.stringify(villa.amenities),
      },
    });

    console.log(`✅ Seeded villa: ${createdVilla.name} (ID: ${createdVilla.id})`);
  }

  for (const post of initialPosts) {
    const createdPost = await prisma.post.upsert({
      where: { id: post.id },
      update: {
        title: post.title,
        content: post.content,
        author: post.author,
        date: new Date(post.date), // ✅ Fix: convert string to Date
        priority: post.priority as any,
      },
      create: {
        id: post.id,
        title: post.title,
        content: post.content,
        author: post.author,
        date: new Date(post.date), // ✅ Fix: convert string to Date
        priority: post.priority as any,
      },
    });

    console.log(`📝 Seeded post: ${createdPost.title} (ID: ${createdPost.id})`);
  }

  const villaCount = await prisma.villa.count();
  const postCount = await prisma.post.count();

  console.log(`📈 Total villas in database: ${villaCount}`);
  console.log(`📢 Total posts in database: ${postCount}`);
  console.log('🎉 Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    console.log('🔌 Disconnecting from database...');
    await prisma.$disconnect();
  });
