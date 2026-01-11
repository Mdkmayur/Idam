# IDAM.World (India + Sri Lanka)

This is a premium, corporate, experiential **group website** for **Idam**.

- Country selector on `/`
- India site in `/india`
- Sri Lanka site in `/srilanka`
- Admin + Auth + CRUD
- Cloudinary uploads
- Project galleries with lightbox: swipe + pinch-to-zoom
- Analytics dashboard
- Language framework (EN now; Kannada/Sinhala/Tamil later)

## What you upload to GitHub
Upload the entire project folder (all files). The repo must include `package.json`, `app/`, `prisma/`, etc.

## Local setup
1. Copy `.env.example` to `.env` and fill values
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create DB tables:
   ```bash
   npx prisma migrate dev
   ```
4. Seed admin + divisions:
   ```bash
   npm run seed
   ```
5. Run:
   ```bash
   npm run dev
   ```

## Hostinger Node.js deployment
- Build command:
  ```bash
  npm install && npx prisma generate && npx prisma migrate deploy && npm run build
  ```
- Start command:
  ```bash
  npm run start
  ```

Set environment variables from `.env.example` in Hostinger hPanel.

## Admin
Go to `/admin` and sign in with the seeded admin user.
