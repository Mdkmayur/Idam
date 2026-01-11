import { z } from 'zod'

export const DivisionSchema = z.object({
  country: z.enum(['INDIA','SRILANKA']),
  name: z.string().min(2),
  slug: z.string().min(2),
  tagline: z.string().min(2),
  description: z.string().min(2),
  icon: z.string().optional().nullable(),
  sortOrder: z.number().int().default(0)
})

export const ProjectSchema = z.object({
  country: z.enum(['INDIA','SRILANKA']),
  divisionId: z.string().min(5),
  title: z.string().min(2),
  slug: z.string().min(2),
  summary: z.string().min(2),
  description: z.string().min(2),
  location: z.string().optional().nullable(),
  heroUrl: z.string().url().optional().nullable(),
  tags: z.array(z.string()).default([]),
  sortOrder: z.number().int().default(0),
  isFeatured: z.boolean().default(false)
})

export const AlbumSchema = z.object({
  country: z.enum(['INDIA','SRILANKA']),
  divisionId: z.string().min(5),
  title: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().min(2),
  sortOrder: z.number().int().default(0)
})

export const AlbumMediaSchema = z.object({
  albumId: z.string().min(5),
  type: z.enum(['IMAGE','VIDEO']),
  url: z.string().url(),
  caption: z.string().optional().or(z.literal('')),
  sortOrder: z.number().int().default(0)
})

export const ProjectMediaSchema = z.object({
  projectId: z.string().min(5),
  type: z.enum(['IMAGE','VIDEO']),
  url: z.string().url(),
  caption: z.string().optional().or(z.literal('')),
  sortOrder: z.number().int().default(0)
})

export const EnquirySchema = z.object({
  country: z.enum(['INDIA','SRILANKA']),
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  division: z.string().optional(),
  message: z.string().min(10)
})
