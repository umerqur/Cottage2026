# Cottage 2026 Voting App

A beautiful, mobile-first web application for group voting on cottage rental options. Built with React, TypeScript, Tailwind CSS, and Supabase.

## Features

- **Gallery View**: Browse 6 cottage options with images, pricing, and amenities
- **Smart Voting**: Vote Yes/Maybe/No on each option with persistent storage
- **Top 2 Ranking**: Pick your top two choices with weighted points (1st = 2pts, 2nd = 1pt)
- **Live Results**: See real-time vote tallies and leaderboard
- **Admin Panel**: Manage cottage options and reset votes (password protected)
- **Mobile First**: Premium UI optimized for phones and tablets

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL database)
- **Hosting**: Netlify
- **Routing**: React Router

## Local Development Setup

### Prerequisites

- Node.js 18+ and npm
- A Supabase account (free tier works)
- Git

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd Cottage2026
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to the SQL Editor in your Supabase dashboard
3. Copy the contents of `supabase-schema.sql` and run it
4. This will create all necessary tables and sample data

### 3. Configure Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Fill in your Supabase credentials in `.env`:
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   VITE_ADMIN_PASSWORD=your-chosen-admin-password
   ```

   You can find your Supabase URL and anon key in:
   - Supabase Dashboard → Settings → API

### 4. Add Cottage Images

Place 6 cottage images in `/public/options/` named:
- A.jpg
- B.jpg
- C.jpg
- D.jpg
- E.jpg
- F.jpg

These will be the default images for each option (you can override via admin panel later).

### 5. Run Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## Deploying to Netlify

### Option 1: Netlify CLI (Recommended)

1. Install Netlify CLI:
   ```bash
   npm install -g netlify-cli
   ```

2. Login to Netlify:
   ```bash
   netlify login
   ```

3. Initialize and deploy:
   ```bash
   netlify init
   ```

   Follow the prompts to:
   - Create a new site or link to existing
   - Set build command: `npm run build`
   - Set publish directory: `dist`

4. Set environment variables in Netlify:
   ```bash
   netlify env:set VITE_SUPABASE_URL "your_supabase_url"
   netlify env:set VITE_SUPABASE_ANON_KEY "your_anon_key"
   netlify env:set VITE_ADMIN_PASSWORD "your_admin_password"
   ```

5. Deploy:
   ```bash
   netlify deploy --prod
   ```

### Option 2: Netlify Dashboard

1. Push your code to GitHub
2. Go to [Netlify](https://app.netlify.com)
3. Click "Add new site" → "Import an existing project"
4. Connect to your GitHub repo
5. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
6. Add environment variables in Site settings → Environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_ADMIN_PASSWORD`
7. Deploy!

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
3. Edit cottage details (nickname, pricing, amenities, etc.)
4. Reset all votes if needed to start fresh

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

**votes**
- Stores individual votes (yes/maybe/no)
- One vote per user per option
- Unique constraint on (voterName, optionId)

**rankings**
- Stores top 2 picks for each user
- One ranking per user
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

**Votes not saving?**
- Check browser console for errors
- Verify Supabase credentials in environment variables
- Ensure Row Level Security policies are set correctly

**Images not loading?**
- Make sure images are in `/public/options/` with correct names
- Check image URLs in the database (can be updated via admin panel)

**Admin password not working?**
- Verify `VITE_ADMIN_PASSWORD` is set in environment variables
- Remember to redeploy after changing environment variables on Netlify

## Support

For issues or questions, please open an issue on GitHub.

## License

MIT
