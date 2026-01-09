# Cottage 2026 Voting App

A beautiful, mobile-first web application for group voting on cottage rental options. Built with React, TypeScript, Tailwind CSS, and Supabase.

## Features

- **Gallery View**: Browse 6 cottage options with images, pricing, and amenities
- **Smart Voting**: Vote Yes/Maybe/No on each option with persistent storage
- **Top 2 Ranking**: Pick your top two choices with weighted points (1st = 2pts, 2nd = 1pt)
- **Live Results**: See real-time vote tallies and leaderboard with shared group results
- **Admin Panel**: Manage cottage options, seed defaults, and reset votes (password protected)
- **Mobile First**: Premium UI optimized for phones and tablets
- **Graceful Setup**: Shows helpful setup screen if Supabase env vars are missing

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL database) - for shared group results
- **Hosting**: Netlify
- **Routing**: React Router

## Quick Setup (4 Steps)

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project
3. Wait for the project to finish setting up

### 2. Run Database Schema

1. In your Supabase dashboard, go to the **SQL Editor**
2. Copy the entire contents of `supabase-schema.sql` from this repo
3. Paste it into the SQL Editor and click **Run**
4. This creates all tables with proper constraints and seeds 6 sample options

### 3. Set Netlify Environment Variables

1. Deploy to Netlify (connect your GitHub repo)
2. In Netlify: **Site settings** → **Environment variables**
3. Add these two required variables:
   - `VITE_SUPABASE_URL` - Your Supabase project URL (find in Supabase → Settings → API)
   - `VITE_SUPABASE_ANON_KEY` - Your Supabase anon/public key (find in Supabase → Settings → API)
4. Optional: `VITE_ADMIN_PASSWORD` - Custom admin password (defaults to `cottage2026admin`)

### 4. Redeploy

1. In Netlify, go to **Deploys** → **Trigger deploy** → **Deploy site**
2. Your app is now live with shared group results!

**Note**: If env vars are missing, the app will show a helpful setup screen instead of crashing.

## Local Development

### Prerequisites

- Node.js 18+ and npm
- A Supabase account (free tier works)
- Git

### Setup Steps

```bash
# Clone and install
git clone <your-repo-url>
cd Cottage2026
npm install

# Create .env file
cp .env.example .env

# Add your Supabase credentials to .env
# VITE_SUPABASE_URL=https://your-project.supabase.co
# VITE_SUPABASE_ANON_KEY=your-anon-key
# VITE_ADMIN_PASSWORD=your-admin-password

# Run dev server
npm run dev
```

The app will be available at `http://localhost:5173`

### Add Cottage Images (Optional)

Place 6 cottage images in `/public/options/` named A.jpg through F.jpg. These will be used as default images (you can update via admin panel later).

## Usage Guide

### For Voters

1. Visit the app and enter your name
2. Browse the 6 cottage options
3. Vote Yes/Maybe/No on each option
4. Pick your top 2 choices for the ranked vote
5. View live results to see how everyone voted

### For Admins

1. Go to `/admin`
2. Enter the admin password
3. **Seed default options**: Click "Seed Default Options (A-F)" to populate 6 placeholder cottages (only if options table is empty)
4. **Edit cottage details**: Update nickname, pricing, amenities, images, etc.
5. **Reset votes**: Clear all votes and rankings to start fresh

## Project Structure

```
Cottage2026/
├── public/
│   └── options/          # Cottage images (A.jpg - F.jpg)
├── src/
│   ├── components/       # React components
│   │   ├── CottageCard.tsx
│   │   ├── CottageModal.tsx
│   │   └── RankingPicker.tsx
│   ├── pages/           # Page components
│   │   ├── Home.tsx
│   │   ├── Results.tsx
│   │   └── Admin.tsx
│   ├── lib/             # Utilities
│   │   └── supabase.ts  # Supabase client & API
│   ├── types/           # TypeScript types
│   │   └── index.ts
│   ├── App.tsx          # Main app component
│   ├── main.tsx         # Entry point
│   └── index.css        # Global styles
├── supabase-schema.sql  # Database schema
├── netlify.toml         # Netlify configuration
└── package.json
```

## Database Schema

### Tables

**options**
- Stores the 6 cottage options with all details
- Fields: code, nickname, title, location, pricing, capacity, perks, images, etc.
- Unique constraint on `code` (A-F)

**votes**
- Stores individual votes (yes/maybe/no)
- **Unique constraint** on `(voterName, optionId)` - prevents duplicate votes
- Uses **upsert logic** - updates existing vote instead of creating duplicates

**rankings**
- Stores top 2 picks for each user
- **Unique constraint** on `voterName` - one ranking per voter
- Uses **upsert logic** - updates existing ranking instead of creating duplicates
- Points: 1st place = 2pts, 2nd place = 1pt

## Customization

### Changing Colors

Edit `tailwind.config.js` to customize the color scheme:

```js
theme: {
  extend: {
    colors: {
      primary: {
        // Your custom color palette
      },
    },
  },
}
```

### Adding More Options

The app is designed for exactly 6 options (A-F). To add more:
1. Update the SQL schema to allow more codes
2. Add corresponding images
3. Insert new rows in the options table

## Troubleshooting

**Seeing "Admin Setup Required" screen?**
- This means Supabase environment variables are missing
- Follow the setup screen instructions to add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to Netlify
- Redeploy your site after adding the variables

**No cottage options showing?**
- Go to `/admin` and click "Seed Default Options (A-F)" to populate 6 placeholder cottages
- Then edit them via the admin panel with real cottage details

**Votes not saving?**
- Check browser console for errors
- Verify Supabase credentials are correct in environment variables
- Ensure the database schema was run successfully in Supabase SQL Editor

**Images not loading?**
- Default images should be in `/public/options/` named A.jpg through F.jpg
- You can update image URLs via the admin panel to use any hosted images

**Admin password not working?**
- Default password is `cottage2026admin` if `VITE_ADMIN_PASSWORD` env var is not set
- Remember to redeploy after changing environment variables on Netlify

## Support

For issues or questions, please open an issue on GitHub.

## License

MIT
