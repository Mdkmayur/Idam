import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL || 'Mayurdkumar@gmail.com'
  const adminPassword = process.env.ADMIN_PASSWORD
  if (!adminPassword) {
    throw new Error('ADMIN_PASSWORD env var is required for seeding (do not hardcode passwords in code).')
  }

  const passwordHash = await bcrypt.hash(adminPassword, 10)

  await prisma.user.upsert({
    where: { email: adminEmail.toLowerCase() },
    update: { role: 'ADMIN', passwordHash },
    create: { email: adminEmail.toLowerCase(), name: 'Mayur', role: 'ADMIN', passwordHash },
  })

  const india = [
    {
      country: 'INDIA' as const,
      name: 'Information Technology',
      slug: 'information-technology',
      tagline: 'Software, Infrastructure & Growth',
      description:
        'Software development, hardware & networking, support desk & manpower, digital marketing, content writing, SEO/SOO.',
      sortOrder: 1,
    },
    {
      country: 'INDIA' as const,
      name: 'Agriculture',
      slug: 'agriculture',
      tagline: 'Own Farms & Contract Farming',
      description: 'We develop our own farms and also execute contract farming programs with quality and traceability.',
      sortOrder: 2,
    },
    {
      country: 'INDIA' as const,
      name: 'Infrastructure',
      slug: 'infrastructure',
      tagline: 'Design → Build → Interiors',
      description:
        'Complete one-stop solution: architecture & design, construction execution, interiors, finishing and delivery.',
      sortOrder: 3,
    },
    {
      country: 'INDIA' as const,
      name: 'Corporate Training',
      slug: 'corporate-training',
      tagline: 'People, Performance & Productivity',
      description:
        'Soft skills, industry-specific staff trainings, and Training the Trainers (ToT) for efficient learning outcomes.',
      sortOrder: 4,
    },
    {
      country: 'INDIA' as const,
      name: 'Vacation Getaway Homes',
      slug: 'vacation-getaway-homes',
      tagline: 'Premium Experiences & Team Building',
      description:
        'Corporate gatherings, farm stays, event spaces, stays, curated activities, and team-building experiences.',
      sortOrder: 5,
    },
    {
      country: 'INDIA' as const,
      name: 'Imports & Exports',
      slug: 'imports-exports',
      tagline: 'India ↔ Sri Lanka Trade',
      description: 'Cross-border imports and exports across rice, spices, vehicles, daily household items and more.',
      sortOrder: 6,
    },
  ]

  const srilanka = [
    {
      country: 'SRILANKA' as const,
      name: 'Hospitality & Tourism',
      slug: 'hospitality-tourism',
      tagline: 'Premium stays & destinations',
      description:
        'Hotels, resorts, adventure parks, camping sites, guest houses, restaurants, cafés, bars, recreation centers and catering.',
      sortOrder: 1,
    },
    {
      country: 'SRILANKA' as const,
      name: 'Eco & Agricultural Tourism',
      slug: 'eco-agri-tourism',
      tagline: 'Eco-led experiences',
      description:
        'Eco-friendly tourism and agriculture-related tourism with modern conveniences and amenities for guests.',
      sortOrder: 2,
    },
    {
      country: 'SRILANKA' as const,
      name: 'Metal Crushing & Allied Manufacturing',
      slug: 'metal-crushing',
      tagline: 'Aggregates, blocks & by-products',
      description:
        'Manufacture and supply of stones, ABC aggregates, metal chips, kerb stones, cement blocks, paving blocks and related by-products.',
      sortOrder: 3,
    },
    {
      country: 'SRILANKA' as const,
      name: 'Granite Mining & Processing',
      slug: 'granite-mining',
      tagline: 'Quarrying to export',
      description:
        'Granite mining, cutting, polishing, processing, marketing and export, including quarry rights and concessions.',
      sortOrder: 4,
    },
    {
      country: 'SRILANKA' as const,
      name: 'Gem Mining & Lapidary',
      slug: 'gem-mining',
      tagline: 'Mining to finished stones',
      description:
        'Gem mining, prospecting, lapidary operations, cutting and polishing, trading and export under Sri Lankan laws.',
      sortOrder: 5,
    },
    {
      country: 'SRILANKA' as const,
      name: 'Agriculture & Contract Farming',
      slug: 'agriculture-contract-farming',
      tagline: 'Food systems & exports',
      description:
        'Agriculture, horticulture, aquaculture, organic farming, dairy and livestock, plus processing, storage and export.',
      sortOrder: 6,
    },
    {
      country: 'SRILANKA' as const,
      name: 'Imports & Exports',
      slug: 'imports-exports',
      tagline: 'Trade & distribution',
      description:
        'Imports/exports, trading, distribution, agency representation and lawful trade across goods and machinery.',
      sortOrder: 7,
    },
    {
      country: 'SRILANKA' as const,
      name: 'Investment & Subsidiary Operations',
      slug: 'investments-subsidiaries',
      tagline: 'Strategic holdings',
      description: 'Form, acquire or hold shares in subsidiary and associate companies in related or ancillary businesses.',
      sortOrder: 8,
    },
  ]

  for (const d of [...india, ...srilanka]) {
    await prisma.division.upsert({
      where: { country_division_slug: { country: d.country, slug: d.slug } },
      update: { name: d.name, tagline: d.tagline, description: d.description, sortOrder: d.sortOrder },
      create: d,
    })
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
    console.log('Seed complete.')
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
