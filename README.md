# Vuka — NSE Investing Education

A free, structured course for Kenyan beginners learning to invest on the Nairobi Securities Exchange.

## What's included

- Trust-first homepage with scam inoculation section
- 6 full lessons with real NSE content
- Quiz system (4/5 correct to pass)
- Mwalimu AI tutor (lesson-aware, secure server-side)
- Dashboard with lesson progress
- Profile page with milestones

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Add your API key
Create a file called `.env.local` in this folder and add:
```
ANTHROPIC_API_KEY=your_key_here
```
Get your key from: console.anthropic.com

### 3. Run locally
```bash
npm run dev
```
Open http://localhost:3000

### 4. Deploy to Vercel
- Go to vercel.com
- Import this project from GitHub
- Add ANTHROPIC_API_KEY in Environment Variables
- Deploy

## Notes

- Progress is saved in sessionStorage (browser only) for this demo version
- To save progress permanently across devices: connect Supabase (see planning docs)
- Mwalimu uses Claude Haiku — affordable and sufficient for lesson Q&A
- No XP, no leaderboard, no gamification — intentional design decision
