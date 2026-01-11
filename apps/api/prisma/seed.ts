import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const sports = [
  { slug: 'football', name_ko: '축구', name_en: 'Football' },
  { slug: 'basketball', name_ko: '농구', name_en: 'Basketball' },
  { slug: 'tennis', name_ko: '테니스', name_en: 'Tennis' },
  { slug: 'badminton', name_ko: '배드민턴', name_en: 'Badminton' },
  { slug: 'baseball', name_ko: '야구', name_en: 'Baseball' },
  { slug: 'golf', name_ko: '골프', name_en: 'Golf' },
  { slug: 'swimming', name_ko: '수영', name_en: 'Swimming' },
  { slug: 'table-tennis', name_ko: '탁구', name_en: 'Table Tennis' },
  { slug: 'volleyball', name_ko: '배구', name_en: 'Volleyball' },
  { slug: 'running', name_ko: '러닝', name_en: 'Running' },
];

const venues = [
  {
    name: 'Gangnam Football Center',
    area: 'Seoul Gangnam-gu',
    address: '123 Gangnam-daero, Gangnam-gu, Seoul',
    category: 'PRIVATE_CENTER',
    amenities: ['PARKING', 'SHOWER', 'RENTAL'],
    sports: ['football'],
  },
  {
    name: 'Mapo Public Tennis Courts',
    area: 'Seoul Mapo-gu',
    address: '456 World Cup-ro, Mapo-gu, Seoul',
    category: 'PUBLIC_PARK',
    amenities: ['PARKING', 'RESTROOM'],
    sports: ['tennis'],
  },
  {
    name: 'Songpa Indoor Basketball Arena',
    area: 'Seoul Songpa-gu',
    address: '789 Olympic-ro, Songpa-gu, Seoul',
    category: 'PRIVATE_CENTER',
    amenities: ['PARKING', 'SHOWER', 'WATER'],
    sports: ['basketball', 'volleyball'],
  },
  {
    name: 'Hangang River Park Sports Complex',
    area: 'Seoul Banpo',
    address: 'Banpo Hangang Park',
    category: 'PUBLIC_PARK',
    amenities: ['PARKING', 'RESTROOM', 'CONVENIENCE_STORE'],
    sports: ['football', 'basketball', 'running'],
  },
];

async function main() {
  console.log('Seeding sports catalog...');
  for (const sport of sports) {
    await prisma.sport.upsert({
      where: { slug: sport.slug },
      update: { name_ko: sport.name_ko, name_en: sport.name_en },
      create: { slug: sport.slug, name_ko: sport.name_ko, name_en: sport.name_en },
    });
  }

  console.log('Seeding venues catalog...');
  for (const v of venues) {
    const supportedSports = await prisma.sport.findMany({
      where: { slug: { in: v.sports } },
    });

    const existing = await prisma.venue.findFirst({
      where: { name: v.name },
    });

    if (existing) {
      await prisma.venue.update({
        where: { id: existing.id },
        data: {
          area: v.area,
          address: v.address,
          category: v.category,
          amenities: v.amenities,
          sports: { set: supportedSports.map((s) => ({ id: s.id })) },
        },
      });
    } else {
      await prisma.venue.create({
        data: {
          name: v.name,
          area: v.area,
          address: v.address,
          category: v.category,
          amenities: v.amenities,
          sports: { connect: supportedSports.map((s) => ({ id: s.id })) },
        },
      });
    }
  }

  console.log('Seeding completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
