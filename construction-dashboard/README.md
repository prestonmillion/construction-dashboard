# Construction Dashboard

A project management dashboard for residential construction builds.

## Features
- Project management (multiple builds)
- Task tracking with drag-and-drop reordering
- Phase management (add/remove/reorder phases)
- Contractor directory with contact info
- Payment tracking per contractor
- Global payment ledger
- Receipt/expense tracking with categories
- Materials list with ordering status
- Financial overview (estimated vs actual costs, profit)
- Conditional alerts (floor outlets, stained concrete, etc.)

## Deploy to Vercel

### Option 1: GitHub Integration (Recommended)

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "Add New Project"
4. Import your GitHub repository
5. Vercel will auto-detect Vite - just click "Deploy"
6. Done! You'll get a URL like `your-project.vercel.app`

### Option 2: Vercel CLI

```bash
npm install -g vercel
vercel login
vercel
```

## Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## Tech Stack
- React 18
- Vite
- Tailwind CSS
- Lucide React (icons)

## Notes
- Data is stored in browser memory only (resets on refresh)
- For persistent data, you'd need to add a backend (Supabase, Firebase, etc.)
