# Vuka — Ruthless Simplification & MVP Execution Plan
## Sections 11–20: Mobile · Emotional Retention · Performance · Cost · Build Order · Execution Plans · Final Strategy

---

# 11. MOBILE-FIRST OPTIMIZATIONS

## The real user's device

Stop designing for a MacBook Pro on a fast Wi-Fi connection. Design for:
- A Samsung Galaxy A15 or Tecno Camon (the bestselling phones in Kenya)
- Safaricom 4G — fast when it works, intermittent when it doesn't
- A user reading on a matatu, at lunch, or after work
- Chrome on Android, not Safari on iPhone
- A screen 360–390px wide
- A user who has never used a "learning platform" before

Every technical and design decision flows from this user profile.

## Lesson readability on mobile

```css
/* These are non-negotiable for lesson pages */

.lesson-content {
  font-size: 16px;          /* NOT 15px — 16px is minimum for extended reading on mobile */
  line-height: 1.85;         /* Generous — reduces eye strain on small screens */
  max-width: 100%;           /* Full width on mobile */
  padding: 0 20px;           /* 20px side padding — enough for thumbs */
  color: var(--text-primary);
}

.lesson-content p {
  margin-bottom: 1.4em;      /* Paragraphs need breathing room */
}

.lesson-content h2 {
  font-size: 22px;           /* Not 36px — that's desktop */
  margin-top: 2em;
  margin-bottom: 0.6em;
}

.lesson-content h3 {
  font-size: 18px;
  margin-top: 1.6em;
}

/* TermCard — expandable, mobile-friendly */
.term-card {
  border-left: 2px solid var(--accent-green);
  padding: 12px 16px;
  margin: 16px 0;
  background: var(--bg-tertiary);
  border-radius: 0 8px 8px 0;
  cursor: pointer;
  min-height: 48px;          /* Minimum tap target */
}

/* Warning block */
.warning-block {
  border-left: 2px solid var(--error);
  padding: 14px 16px;
  margin: 20px 0;
  background: rgba(248, 81, 73, 0.06);
  border-radius: 0 8px 8px 0;
  font-size: 15px;
}

/* Kenya context block */
.kenya-context {
  border-left: 2px solid var(--accent-amber);
  padding: 14px 16px;
  margin: 20px 0;
  background: rgba(158, 106, 3, 0.08);
  border-radius: 0 8px 8px 0;
}
```

## Tap targets — minimum sizes

```
Every interactive element must be minimum 48×48px on mobile.

Quiz option buttons:  min-height: 56px  (options need comfortable tapping)
Nav items:            min-height: 48px
Mwalimu button:       60×60px fixed position (bottom right)
"Continue" buttons:   min-height: 52px, full width on mobile
TermCard tap area:    full card is tappable
Accordion items:      min-height: 52px
```

## Bottom navigation — mobile only

```tsx
// components/layout/BottomNav.tsx
// display: none on md: and above

const items = [
  { href: '/dashboard', label: 'Home',    Icon: HomeIcon },
  { href: '/learn',     label: 'Course',  Icon: BookIcon },
  { href: '/profile',   label: 'Profile', Icon: UserIcon },
];

// Styles:
// position: fixed, bottom: 0, left: 0, right: 0
// height: 60px (plus safe area inset for notch phones)
// padding-bottom: env(safe-area-inset-bottom)  ← critical for notch phones
// background: var(--bg-secondary), border-top: 1px solid var(--border-subtle)
// z-index: 40

// Active tab: icon + label in --accent-green
// Inactive: icon only in --text-tertiary (label hidden on small screens)
```

## Mwalimu panel — mobile behavior

```tsx
// On mobile: full-screen slide-up, not 45vh panel
// Swipe down gesture to dismiss (Framer Motion drag)

const panelVariants = {
  hidden: { y: '100%' },
  visible: { y: 0, transition: { type: 'spring', damping: 30, stiffness: 300 } },
  exit:   { y: '100%', transition: { duration: 0.2 } },
};

// On mobile:
// height: 100dvh (dynamic viewport height — handles browser chrome on Android)
// Drag handle at top: 40px × 4px pill, --text-tertiary
// Header: "Mwalimu" + close button (X, 44×44px tap target)
// Input: fixed at bottom above keyboard
//   → use visualViewport API to detect keyboard height and adjust
```

## Keyboard handling on mobile

```tsx
// The most common mobile bug: keyboard pushes input off screen
// Fix with visualViewport API

useEffect(() => {
  const viewport = window.visualViewport;
  if (!viewport) return;

  const handleResize = () => {
    const keyboardHeight = window.innerHeight - viewport.height;
    // Set CSS variable
    document.documentElement.style.setProperty(
      '--keyboard-height',
      `${keyboardHeight}px`
    );
  };

  viewport.addEventListener('resize', handleResize);
  return () => viewport.removeEventListener('resize', handleResize);
}, []);

// In CSS:
// .mwalimu-input-area {
//   padding-bottom: calc(16px + var(--keyboard-height, 0px));
// }
```

## Network resilience

```tsx
// Lesson content: pre-rendered at build time (generateStaticParams)
// A user on a slow connection gets the lesson HTML instantly
// No spinner for lesson content — it's static

// Quiz submission: optimistic update
// Show results immediately, sync to server in background
// If sync fails: retry once, then show subtle error
// User's answers never lost

// Mwalimu: loading indicator immediately on submit
// Don't wait for API response to show activity
// Stream response word-by-word (ReadableStream)
// If connection drops mid-stream: show partial response + retry button

// Image policy: no images in Phase 1
// Every image is a network request that can fail
// Typography + color + spacing is the design language
// No illustrations needed
```

## Offline behavior — minimal but honest

```
Phase 1 offline strategy: be honest, not clever.

If user is offline:
  - Lesson content loads (it's static HTML, already in browser cache after first visit)
  - Quiz submission fails gracefully:
    "No connection. Your answers are saved here.
     Submit when you're back online."
    (store quiz answers in sessionStorage, submit on reconnect)
  - Mwalimu: show "No connection. Ask Mwalimu when you're back online."
  - Dashboard: show last known state from server (Next.js page cache)

Do NOT build a full offline PWA in Phase 1.
Service workers add complexity. You don't have the user base to justify it yet.
```

---

# 12. EMOTIONAL RETENTION SYSTEMS

## The core problem with fake gamification

XP, badges, and streaks work for Duolingo because:
1. Language learning is inherently repetitive (daily practice matters)
2. Duolingo has a research team studying retention psychology
3. The product trains habits, not understanding

NSE investing education is different:
- It's a one-time course, not a daily habit app
- The goal is understanding, not repetition
- The reward is real-world capability, not app engagement
- Fake achievement feels patronizing to a 28-year-old professional

## What actually creates emotional momentum in educational products

Research-backed retention mechanisms that don't feel childish:

### 1. Cumulative comprehension — the feeling of "it's clicking"

```
How to design for it:

Each lesson opens with a "What you already know" section.
2–3 sentences referencing concepts from previous lessons.

Example opening of Lesson 3:
"In the last lesson, you learned what a CDS account is
 and how to verify a licensed broker. Now let's look at
 what you'd actually be buying through that broker —
 a share in a listed company."

This activates prior knowledge before introducing new concepts.
It makes the user feel their previous effort compounded into this moment.
That feeling — "I understand this because of what I learned before" —
is genuine momentum. No XP required.
```

### 2. Progress anchored to real-world capability

```
Instead of: "You've earned 240 XP"
Show:        "You now know enough to open a CDS account"

Instead of: "3/6 lessons complete"
Show:        "You understand what the NSE is, what a CDS account does,
              and how to read a stock listing.
              Next: why prices move."

The user sees what they can DO, not a number.
This is intrinsically motivating for adults learning a skill.
```

### 3. Honest difficulty acknowledgment

```
Lesson 3 header (after the title):
"This is the most information-dense lesson.
 Take breaks. It's normal to need to re-read sections."

Quiz fail state:
"3 out of 5. Lesson 3 has the highest re-attempt rate in the course.
 You're not behind — you're in exactly the right place."

This does two things:
  1. Normalizes struggle (reduces anxiety, increases persistence)
  2. Creates social proof without fake numbers
     ("highest re-attempt rate" feels real and researched, not manufactured)
```

### 4. "Before/After" framing at lesson end

```
On lesson completion (not a modal — integrated into the lesson page):

┌─────────────────────────────────────────────────┐
│ Before this lesson, you might have wondered:    │
│ "What exactly is a CDS account?"               │
│                                                 │
│ You can now answer that question.               │
│                                                 │
│ Next: reading a stock listing.                  │
│ [Continue →]                                    │
└─────────────────────────────────────────────────┘

No exclamation marks. No confetti. No XP.
Just a calm statement of what the user now knows.
This is more motivating than any badge because it's TRUE.
```

### 5. The course is finite and that's a feature

```
Always show:
"Lesson 3 of 6"
"~3 weeks at your pace"
"Most learners finish on weekends"

Finitude reduces intimidation.
A beginner who can see the end of the tunnel is more likely to enter it.
Duolingo hides the end (no clear completion point — engagement treadmill).
Vuka shows the end — because the goal is to graduate users, not retain them.
```

### 6. Micro-completions within lessons

```
These replace XP ticks without feeling gamified:

- TermCard expanded: the card slightly changes color and the term stays visible
  as you scroll (sticky summary at top of lesson). Feels like "I learned that."

- ConceptCheckpoint correct: brief inline text — "Exactly right." 
  Not "Correct! +10 XP!" Just: "Exactly right." Then continue reading.

- ConceptCheckpoint wrong: "Not quite — here's the distinction:" [explanation]
  Then continue reading. No score shown. No consequence. Just learning.

- Reaching the quiz: the lesson content fades slightly and the quiz appears.
  The transition itself signals: "You've read enough to be tested."
  No button click needed — the scroll depth triggers it automatically.
```

### 7. Real-world milestone moments — designed carefully

```tsx
// components/learn/LessonComplete.tsx
// Shown after quiz pass — NOT a modal (modals interrupt)
// Integrated into the page below the quiz results

// The text changes based on which lesson was just completed:

const LESSON_COMPLETE_MESSAGES: Record<string, { 
  capability: string; 
  nextPreview: string 
}> = {
  'what-is-nse': {
    capability: 'You now understand what the NSE is, who regulates it, and what investing on it means.',
    nextPreview: 'Next: how to open a CDS account and what a licensed broker actually looks like.',
  },
  'cds-accounts': {
    capability: 'You can now identify a legitimate broker and understand what a CDS account does. That puts you ahead of most people who think about investing but never start.',
    nextPreview: 'Next: reading a stock listing — what the numbers on NSE.co.ke actually mean.',
  },
  'reading-listings': {
    capability: 'You can read a stock listing. Most investors skip this step and invest blind.',
    nextPreview: 'Next: why prices move — and why short-term movements usually don\'t matter.',
  },
  'price-movements': {
    capability: 'You understand price movements. You now have the context to invest without panicking at normal market fluctuations.',
    nextPreview: 'Next: the exact process of placing your first buy order.',
  },
  'first-order': {
    capability: 'You know how to place a buy order. One lesson left.',
    nextPreview: 'Final lesson: what happens after you invest — statements, dividends, and what to do when prices fall.',
  },
  'after-investing': {
    capability: 'You have completed the NSE Foundations course. You understand what the NSE is, how to open a CDS account, how to read a listing, and what to do after you invest. You are prepared.',
    nextPreview: null,
  },
};

// Tone: matter-of-fact, not celebratory
// Color: --accent-green border-left, not confetti
// Size: compact — 3 lines of text + button
// No animation beyond a simple fadeIn
```

### 8. The course completion state — handle it with gravity

```
Most apps celebrate course completion with confetti and a big achievement screen.
That feels appropriate for a 5-minute quiz game.

For a course about making real financial decisions, it should feel different.

COURSE COMPLETE PAGE (/learn/complete):

"NSE Foundations — Complete"
[Instrument Serif, large, no animation]

"You've finished all six lessons.

 You now understand the NSE well enough to make an informed first investment.
 Not a guaranteed one. An informed one. That distinction matters.
 
 The next step is yours: open a CDS account, choose a licensed broker,
 and make your first investment when you're ready.
 
 There's no timeline. No pressure. The knowledge stays with you."

[CDS account guide →] (links to CDSC.co.ke)
[Licensed brokers list →] (links to NSE.co.ke/brokers)
[Ask Mwalimu a question] (opens Mwalimu panel)

No badge. No certificate in Phase 1. No email blast.
Just the information they need to take the next real step.
```

---

# 13. PERFORMANCE OPTIMIZATIONS

## The non-negotiables for a Kenya-context web app

### 1. Static lesson content

```typescript
// app/learn/[lessonId]/page.tsx

// Generate all lesson pages at build time
export async function generateStaticParams() {
  return LESSON_IDS.map(id => ({ lessonId: id }));
}

// Revalidate every 24 hours (lesson content rarely changes)
export const revalidate = 86400;

// What this means:
// User on 3G loads lesson page → gets pre-built HTML from CDN edge
// No database query. No server computation. Near-instant.
// On Vercel: this is free and automatic.
```

### 2. Route-level code splitting — automatic with Next.js App Router

```
Each route is its own bundle.
A user reading a lesson doesn't download quiz code.
A user on the homepage doesn't download dashboard code.
This is automatic — don't fight it.

DON'T: import heavy components at route level and conditionally render them
DO: use dynamic imports for anything not needed on initial render

import dynamic from 'next/dynamic';

const MwalimuPanel = dynamic(
  () => import('@/components/mwalimu/MwalimuPanel'),
  { loading: () => null } // panel is hidden by default — no flash
);
```

### 3. Font loading — minimize FOUT

```html
<!-- In app/layout.tsx <head> -->

<!-- Preconnect first -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

<!-- Load only what you need -->
<!-- Instrument Serif: regular + italic (headings only) -->
<!-- Inter: 400 + 500 (body + medium weight — no 600, 700 — use Inter's optical sizing) -->
<link 
  href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@400;500&display=swap" 
  rel="stylesheet"
/>

<!-- Result: 2 font files, ~30KB total. Acceptable. -->
<!-- DO NOT load JetBrains Mono separately — use system monospace for labels -->
<!-- font-family: 'SF Mono', 'Fira Code', 'Courier New', monospace -->
```

### 4. Image policy

```
Phase 1: zero images.
No hero illustrations. No avatars. No stock photos.
Every image is a network request. Every failed request is a broken experience.
Typography IS the design. Trust it.

When images become necessary (Phase 2):
  - Use next/image exclusively
  - Always provide explicit width and height (prevents layout shift)
  - Use WebP format
  - Lazy load everything below the fold
  - Never use images for decorative purposes
```

### 5. Bundle size discipline

```
Current dependencies audit — what stays and what goes:

KEEP:
  next, react, react-dom     — required
  framer-motion              — animations (tree-shakeable — only import what you use)
  @supabase/ssr              — auth
  @anthropic-ai/sdk          — AI API (server-only — never in client bundle)

REMOVE:
  zustand                    — replace with server components + useState
  clsx                       — use template literals or Tailwind's cx utility inline

CHECK SIZE:
  framer-motion full import adds ~100KB
  Only import what you use:
  import { motion, AnimatePresence } from 'framer-motion'; // NOT import * as
```

### 6. Core Web Vitals targets

```
LCP (Largest Contentful Paint): < 2.5s on 4G
  → Achieved by: static lesson content, no hero images, system fonts as fallback

FID/INP (Interaction to Next Paint): < 200ms
  → Achieved by: no heavy JS on initial load, quiz interactions are local state

CLS (Cumulative Layout Shift): < 0.1
  → Achieved by: explicit font-display: swap, no dynamic content above fold,
                 skeleton loaders have exact height of content they replace

Measure with: Lighthouse in Chrome DevTools
Test on: Chrome DevTools "Slow 4G" throttle + "Mid-tier mobile" CPU throttle
```

---

# 14. COST REDUCTION STRATEGIES

## AI costs — the main variable expense

```
Phase 1 cost model:

Model: claude-haiku-4-5-20251001 (not Sonnet)
  Input:  $0.80 per million tokens
  Output: $4.00 per million tokens

Per message:
  Input:  ~800 tokens × $0.80/M  = $0.00064
  Output: ~200 tokens × $4.00/M  = $0.00080
  Total per message:               $0.00144

Per user per day (20 message limit):
  $0.00144 × 20 = $0.029/user/day

At different user scales:
  50 DAU (all hitting limit):  $1.44/day  → $43/month
  200 DAU:                     $5.76/day  → $173/month
  500 DAU:                     $14.4/day  → $432/month

At 500 DAU you have a real business. $432/month in AI costs is fine.
Most users won't hit the 20-message daily limit.
Realistic cost: 40-60% of ceiling estimates.
```

## 5 cost reduction tactics for Mwalimu

```
1. USE HAIKU, NOT SONNET
   Haiku is 5x cheaper. For explaining what a CDS account is to a beginner,
   Haiku is entirely adequate. Only upgrade to Sonnet when you have specific
   evidence that Haiku's responses are insufficient.

2. HARD DAILY LIMIT: 20 messages
   No exceptions. User hits limit → friendly message → come back tomorrow.
   This caps your worst-case cost per user.

3. TRIM CONVERSATION HISTORY
   Only send last 6 messages (3 exchanges) as context.
   Older messages add tokens but rarely add value for educational Q&A.
   A user asking "what is a dividend?" doesn't need their question about
   CDS accounts from 10 minutes ago in the context.

4. SHORT SYSTEM PROMPT
   The simplified prompt is ~250 tokens.
   The previous multi-mode prompt was ~800 tokens.
   Difference: 550 tokens × every message × every user.
   At 10,000 messages/month: 5.5M tokens saved = ~$4.40 on Haiku.
   Small now. Compounds at scale.

5. CONTENT_EXCERPT INSTEAD OF FULL LESSON
   The lesson content_excerpt field stores the first 1200 characters (~300 tokens).
   The full lesson is 800–1200 words (~1000 tokens).
   Saving 700 tokens per message context = significant at scale.
   A well-chosen excerpt (intro + key terms) gives Mwalimu enough context.
```

## Supabase costs

```
Supabase free tier:
  500MB database
  1GB file storage
  50,000 monthly active users
  Unlimited API requests

Phase 1 usage estimate:
  7 tables, ~1000 users, ~10KB per user of data
  Total: ~10MB of data
  Well within free tier for a long time.

When you'll hit limits:
  ai_sessions table stores full conversation history as JSONB
  At 100 messages/user with 100 users: ~10MB of AI conversations
  Solution: delete ai_sessions older than 30 days (a 5-line cron job)
  Or: truncate messages array to last 10 exchanges before storing
```

## Hosting costs

```
Vercel Hobby (free):
  Unlimited static deployments
  100GB bandwidth
  Serverless functions: 100GB-hours compute
  Sufficient for: up to ~5,000 monthly visitors

Vercel Pro ($20/month):
  When you need: team collaboration, faster builds, more compute
  Upgrade when: hobby tier limits are consistently hit (you'll know)

Total Phase 1 infrastructure cost:
  Supabase: $0 (free tier)
  Vercel:   $0 (hobby tier)
  Anthropic: ~$10–50/month depending on usage
  Domain:   ~$12/year
  ─────────────────────────────
  Total:    ~$10–50/month

This is not a cost problem. Build the product.
```

---

# 15. EXACT BUILD ORDER

No phases named after mythical animals. Just numbered steps, in order, with clear exit criteria.

## Step 0 — Stop (Day 1)

```
Before writing a single new line of code:

ACTION 1: Move Anthropic API key to server
  File: app/api/mwalimu/route.ts
  Remove: any client-side fetch to api.anthropic.com
  Time: 2 hours

ACTION 2: Remove XP from all user-facing UI
  Search codebase for: "XP", "xp", "experience points"
  Remove from: dashboard, profile, any badge/label
  Time: 1 hour

ACTION 3: Delete the leaderboard
  Remove component, remove from dashboard, remove related state
  Time: 1 hour

ACTION 4: Kill Zustand
  The app has no real server state yet — localStorage was the persistence layer
  Replace with: useState for UI state, server components for data
  Time: 3 hours (most of this is tracing where Zustand was used)

Total Step 0: ~1 day
Exit criteria: App runs without localStorage as persistence, API key is server-only
```

## Step 1 — Supabase Foundation (Days 2–5)

```
FILES TO CREATE:
  lib/supabase/server.ts         (server client with cookie handling)
  lib/supabase/client.ts         (browser client)
  middleware.ts                  (auth redirect logic)
  lib/types/database.ts          (generated from Supabase — run: supabase gen types)

SUPABASE SETUP:
  Run schema SQL (Section 7 of this document — 7 tables)
  Set up RLS policies
  Enable email auth
  Add ANTHROPIC_API_KEY to environment variables (server-only)
  Add SUPABASE_SERVICE_ROLE_KEY to environment variables (server-only, for events table)

TEST:
  Sign up → profile created automatically (via trigger)
  Sign in → redirect to /dashboard
  Visit /dashboard without auth → redirect to /login
  Sign out → redirect to /

Time: 3–4 days (include debugging auth edge cases)
Exit criteria: Auth works. Profile created on signup. Middleware protects routes.
```

## Step 2 — Design System (Days 6–8)

```
FILES TO CREATE/REPLACE:
  app/globals.css                 (new color tokens, typography, base styles)
  components/ui/Button.tsx        (primary + secondary + ghost variants)
  components/ui/Card.tsx          (standard + interactive)
  components/ui/Input.tsx         (with label + error state)
  components/ui/MonoLabel.tsx     (11px mono uppercase)
  components/ui/Skeleton.tsx      (loading placeholder)

REPLACE IN globals.css:
  #00C896 → #238636 (everywhere)
  Remove: neon pulse animation, gradient backgrounds
  Add: CSS custom properties from Section 4 of Part 1

TEST:
  Homepage renders with new design system
  Auth pages render correctly
  Mobile: check all tap targets ≥ 48px

Time: 2–3 days
Exit criteria: Design system implemented, tested on real Android device (not just DevTools)
```

## Step 3 — Homepage (Days 9–11)

```
FILE: app/(marketing)/page.tsx (full replace)

SECTIONS TO BUILD (in order):
  1. Navbar (minimal — wordmark + sign in link only)
  2. Hero (trust-first, no badge, no stats)
  3. Trust bar (4 honest statements)
  4. Curriculum path (6 lessons listed)
  5. "What Vuka Is Not" (3 cards)
  6. FAQ accordion (5 questions)
  7. Final CTA

DO NOT BUILD YET:
  Testimonial section (no real testimonials yet)
  Any animation beyond simple fadeIn on scroll

COMPONENTS TO CREATE:
  components/marketing/Hero.tsx
  components/marketing/TrustBar.tsx
  components/marketing/CurriculumPath.tsx
  components/marketing/WhatVukaIsNot.tsx
  components/marketing/FAQ.tsx

TEST:
  Read the homepage as if you are a skeptical 28-year-old in Nairobi
  who has seen investment scams. Does it pass? Get 2 real people to read it.

Time: 2–3 days
Exit criteria: Homepage passes trust test with 2 real Kenyan users
```

## Step 4 — Auth + Onboarding (Days 12–14)

```
FILES:
  app/(auth)/signup/page.tsx     (name, email, password, country)
  app/(auth)/login/page.tsx      (email, password)
  app/(auth)/layout.tsx          (minimal layout)
  app/(app)/onboarding/page.tsx  (2 steps: goal + experience)
  lib/actions/auth.ts            (server actions: signUp, signIn, signOut)
  lib/actions/profile.ts         (server action: completeOnboarding)

ONBOARDING STEPS:
  Step 1: "What's your main goal?" — 4 radio options
  Step 2: "How much do you know?" — 3 radio options
  No progress bar animation. No third step.
  Submit → set onboarding_done = true → redirect to /dashboard

TEST:
  Sign up → onboarding → dashboard (empty state)
  Sign in → skip onboarding → dashboard
  Incomplete onboarding → middleware redirects back to /onboarding

Time: 2–3 days
Exit criteria: Full auth + onboarding flow works on mobile
```

## Step 5 — Write Lesson 1 Content (Days 15–17)

```
This is not a coding task. This is the most important step.

WRITE IN: Google Docs or Notion (not in MDX yet)

LESSON 1: "What is the NSE?"
  Target: 650–800 words
  Structure: objectives → 4 content sections → TermCards → WarningBlock → KenyaContext → summary
  Quiz: 5 questions (write these in the same doc, below the lesson)

GET FEEDBACK FROM:
  1 Kenyan non-developer who has never invested
  Ask them to read it and mark anything confusing
  Revise based on feedback

CONVERT TO MDX:
  content/lessons/what-is-nse.mdx
  content/quizzes/what-is-nse.ts  (TypeScript constants)

UPDATE SUPABASE:
  Insert lesson 1 row into lessons table
  Set is_published = true
  Fill key_terms array
  Fill content_excerpt (first 1200 chars of MDX content, plain text)

Time: 2–3 days (content takes time — don't rush it)
Exit criteria: One real person reads lesson 1 and can correctly answer 4 of 5 quiz questions
```

## Step 6 — Lesson Page (Days 18–22)

```
FILES TO CREATE:
  app/(app)/learn/[lessonId]/page.tsx      (server component — fetches lesson + progress)
  components/learn/LessonLayout.tsx
  components/learn/LessonHeader.tsx
  components/learn/LessonContent.tsx       (MDX renderer)
  components/learn/TermCard.tsx
  components/learn/WarningBlock.tsx
  components/learn/KenyaContextBlock.tsx
  components/learn/ConceptCheckpoint.tsx
  components/learn/LessonSidebar.tsx       (desktop only — lesson list)
  components/layout/BottomNav.tsx          (mobile only)

MDX SETUP:
  Install: @next/mdx, @mdx-js/loader, next-mdx-remote
  Configure: next.config.ts to handle .mdx files
  Create: MDX component map (mdx-components.tsx in root)

LESSON PAGE STATE MACHINE (client component wrapper):
  'reading'   → lesson content visible, quiz hidden
  'quiz'      → quiz visible (triggered at 80% scroll depth)
  'complete'  → quiz results + next lesson link

SCROLL DEPTH TRACKING:
  useEffect with scroll event listener
  When scrollY / (document.body.scrollHeight - window.innerHeight) > 0.8:
    setLessonState('quiz')
  This replaces the "I've read this" button — less friction, same intent gate

PROGRESS TRACKING:
  On lesson page mount: call server action startLesson(lessonId)
  Creates/updates user_lesson_progress row with status: 'in_progress'

TEST:
  Lesson 1 renders on Android (real device, not DevTools)
  MDX components render correctly
  Scroll-to-quiz works
  Progress saved to Supabase on page load

Time: 4–5 days
Exit criteria: Lesson 1 readable on mobile with all MDX components working
```

## Step 7 — Quiz System (Days 23–26)

```
FILES TO CREATE:
  components/quiz/QuizShell.tsx      (state machine: answering → submitted → pass/fail)
  components/quiz/QuizQuestion.tsx
  components/quiz/OptionButton.tsx
  components/quiz/QuizResults.tsx
  components/quiz/RetryCountdown.tsx
  lib/actions/quiz.ts                (server action: submitQuiz)

SERVER ACTION: submitQuiz(lessonId, answers)
  1. Validate answers against quiz constants
  2. Calculate score
  3. Insert into user_quiz_attempts
  4. If passed: call markLessonComplete(lessonId)
  5. If failed: log wrong concept tags to user_confused_concepts
  6. Log event (lesson_completed or quiz_failed)
  7. Return { passed, score, total, wrongConcepts }

markLessonComplete(lessonId):
  Update user_lesson_progress: status = 'completed', completed_at = now()
  revalidatePath('/dashboard')

QUIZ PASS STATE:
  "Lesson complete."
  [before/after message from LESSON_COMPLETE_MESSAGES]
  [Continue to Lesson 2 →]

QUIZ FAIL STATE:
  "3 out of 5."
  Wrong answers listed with explanations (from quiz constants — no API call)
  RetryCountdown: "Retake available in [minutes]"
  "Review lesson" button (scrolls back to top)

NO MWALIMU IN QUIZ FAIL STATE IN MVP
Wrong answer explanations come from the quiz constants, not from AI.
AI is expensive. Good static explanations are free and instant.
Add AI concept checker in Phase 2 when you have evidence users need more than the static explanation.

TEST:
  Pass path: lesson complete, dashboard updated, next lesson unlocked
  Fail path: correct retry timer, wrong concepts logged to DB
  Mobile: options are tappable, results readable

Time: 3–4 days
Exit criteria: Full quiz flow works. Wrong answers logged. Progress persisted.
```

## Step 8 — Dashboard (Days 27–30)

```
FILES TO CREATE:
  app/(app)/dashboard/page.tsx        (server component — fetches all data)
  components/dashboard/NextActionCard.tsx
  components/dashboard/LessonList.tsx
  lib/dashboard/getNextAction.ts      (pure function — computes next action from progress)

DASHBOARD DATA FETCH (single parallel query):
  const [progress, profile] = await Promise.all([
    supabase.from('user_lesson_progress').select('*').eq('user_id', userId),
    supabase.from('profiles').select('full_name').eq('id', userId).single(),
  ]);

LESSON LIST COMPONENT:
  Reads from LESSONS constant (TypeScript, not DB)
  Overlays status from progress data
  Simple: completed ✓ / in_progress → / not_started ·

NEXT ACTION CARD:
  Logic in getNextAction() — pure TypeScript function
  Input: lesson progress array + lesson metadata
  Output: { type, lessonId, lessonTitle }
  Single card, single button. No multiple CTAs.

TEST:
  Dashboard shows correct next action after each lesson/quiz state
  Lesson list updates after lesson completion
  Mobile: card is readable, button is tappable

Time: 3–4 days
Exit criteria: Dashboard accurately reflects user progress from DB
```

## Step 9 — Mwalimu Integration (Days 31–36)

```
FILES TO CREATE:
  app/api/mwalimu/route.ts           (secure API route — key never on client)
  components/mwalimu/MwalimuPanel.tsx (slide-up, mobile-fullscreen)
  components/mwalimu/MwalimuChat.tsx  (message list)
  components/mwalimu/MwalimuMessage.tsx
  components/mwalimu/MwalimuInput.tsx
  lib/ai/buildSimplePrompt.ts

MWALIMU PANEL TRIGGER:
  Fixed button on lesson page: "Ask Mwalimu" (bottom right, 60×60px)
  Click → MwalimuPanel slides up
  Panel knows: which lesson page it's on (passed as prop)

STREAMING IMPLEMENTATION:
  API route returns ReadableStream
  Client reads stream with: for await (const chunk of response.body)
  Each chunk appended to message as it arrives
  User sees response appear word by word — feels fast, is fast

ADD LESSON: content_excerpt column
  Fill for lesson 1 (and each lesson as you write them)
  Plain text, no MDX, first ~1200 characters

TEST:
  Ask Mwalimu a question about Lesson 1
  Verify: response is contextually relevant (mentions NSE, not generic)
  Verify: rate limit works (after 20 messages, friendly error)
  Verify: API key never appears in browser DevTools Network tab
  Verify: works on Slow 4G throttle (streaming makes this feel fast)

Time: 5–6 days
Exit criteria: Mwalimu answers lesson-relevant questions. Rate limit works. Key is secure.
```

## Step 10 — Write Lessons 2–6 + Ship (Days 37–60)

```
Parallel track: while testing/debugging Steps 6–9, write content.

WEEK 6: Write Lessons 2 and 3
WEEK 7: Write Lessons 4 and 5
WEEK 8: Write Lesson 6. Full QA pass. Fix bugs from real device testing.

For each new lesson:
  1. Write in Google Docs
  2. Get one non-developer to read and mark confusion
  3. Revise
  4. Convert to MDX
  5. Write TypeScript quiz constants
  6. Insert lesson row to Supabase
  7. Fill content_excerpt for Mwalimu

FINAL QA (before any marketing):
  Complete the entire course yourself as a new user
  Get 3 real users (Kenyan, non-developers) to complete at least 2 lessons
  Fix every confusion point they hit

LAUNCH:
  Not ProductHunt. Not a big announcement.
  Share with 10 people personally. Watch them use it. Fix what's broken.
  Then share more broadly.
```

---

# 16. 30-DAY EXECUTION PLAN

```
WEEK 1 (Days 1–7):
  Day 1:     Step 0 — Security fixes (API key, remove XP/leaderboard, kill Zustand)
  Days 2–5:  Step 1 — Supabase schema + auth foundation
  Days 6–7:  Step 2 — Design system (color tokens, core components)

WEEK 2 (Days 8–14):
  Days 8–10: Step 3 — Homepage rebuild
  Days 11–12: Step 4 — Auth + onboarding flow
  Days 13–14: Step 5 — Write Lesson 1 (content only — no MDX yet)
              Get feedback from 1 real person

WEEK 3 (Days 15–21):
  Day 15:    Revise Lesson 1 based on feedback. Convert to MDX.
  Days 16–20: Step 6 — Lesson page + MDX component system
  Day 21:    Test lesson 1 on real Android device

WEEK 4 (Days 22–30):
  Days 22–25: Step 7 — Quiz system
  Days 26–28: Step 8 — Dashboard
  Days 29–30: Integration test: full flow from signup to lesson 1 complete

END OF DAY 30 GOAL:
  A real user can sign up, read Lesson 1, pass the quiz,
  and see their progress on the dashboard.
  That's the milestone. Everything else is secondary.
```

---

# 17. 60-DAY EXECUTION PLAN

```
DAYS 1–30: As above

DAY 31–36: Step 9 — Mwalimu integration
  Mwalimu works on lesson 1 page
  Streaming works on slow connection
  Rate limit works

DAY 37–42: Write Lessons 2 and 3
  Lesson 2: CDS accounts & licensed brokers
  Lesson 3: Reading a stock listing
  Each lesson: write → feedback → revise → MDX → quiz constants → publish

DAY 43–48: Write Lessons 4 and 5
  Lesson 4: Understanding price movements (include risk checkpoint)
  Lesson 5: Your first buy order
  Same workflow

DAY 49–52: Write Lesson 6 + Profile Page
  Lesson 6: After you invest
  Profile page: lesson completion status + milestone cards (static, computed from progress)
  No milestone DB table — compute from lesson progress

DAY 53–56: Full QA pass
  Complete the entire course as a new user
  Test on: Chrome Android (Slow 4G), Samsung Galaxy A-series
  Fix: any layout breaks, any confusing copy, any broken quiz logic
  Test Mwalimu on every lesson

DAY 57–60: Beta with real users
  Find 5–10 Kenyan non-developers
  Watch them use the product (screen share or sit beside them)
  Don't explain anything — observe where they get stuck
  Fix the top 3 problems you observe

END OF DAY 60 GOAL:
  Complete 6-lesson course is live
  Mwalimu works on all lesson pages
  5+ real users have completed at least 2 lessons
  You have real feedback — not hypothetical product decisions
```

---

# 18. WHAT NOT TO BUILD

This is the most valuable section. Every item here will feel like it should be built. It shouldn't be. Not yet.

```
❌ A separate /mwalimu page (open chat)
   Why: Lesson Companion is bounded and evaluable.
        Open chat is unbounded and expensive to monitor.
        Phase 2 — after you know what users actually ask.

❌ Mwalimu Progress Advisor mode
   Why: Requires historical data you don't have.
        You're building an advisor for a pattern you haven't observed yet.

❌ Email notifications or weekly digests
   Why: You need a content team or significant automation investment.
        Phase 2, after you have completion data worth emailing about.

❌ Social features (comments, cohorts, discussion)
   Why: Community requires critical mass. You don't have it.
        A ghost town community is worse than no community.

❌ User-generated content of any kind
   Why: Moderation burden. Legal risk. Wrong phase.

❌ NSE live price data
   Why: NSE's API access is not free or simple.
        Displaying live prices makes you look like a trading platform.
        Educational content is timeless. Price data is not.

❌ A portfolio tracker
   Why: Users haven't made their first investment yet.
        Build this after they have. Not before.

❌ Broker referral links or affiliate relationships
   Why: Destroys the "no commissions" trust signal.
        Your core differentiation is: we have no financial interest in what you do.
        The moment you add referral links, that's gone.
        Revenue model is a Phase 3 problem.

❌ Gamification that competes with understanding
   Why: XP, leaderboards, and achievement badges train users to
        optimize for engagement, not comprehension.
        You've already decided this. Don't un-decide it.

❌ Adaptive learning algorithms
   Why: Requires: user data at scale, ML expertise, A/B testing infrastructure.
        You have none of these yet.
        "Adaptive learning" in Phase 1 means: you update lesson content
        based on which quiz questions most users get wrong.
        That's it. That's the algorithm. It's called "editing."

❌ A mobile app (React Native / Expo)
   Why: Your mobile web experience should be excellent first.
        If it's excellent, most users won't ask for a native app.
        If it's not excellent, a native app won't fix it.
        Native app = maintaining two codebases. Wrong phase.

❌ Multi-language support (Kiswahili, French)
   Why: Translation requires fluent native speakers reviewing every word.
        Bad translation is worse than no translation.
        English first. Excellent Swahili second — with real reviewers.

❌ An admin CMS for content management
   Why: MDX files in a GitHub repo are your CMS.
        You're the only content author for now.
        Build a CMS when you have a second content author.

❌ Stripe or any payment infrastructure
   Why: The product is free. Revenue is a Phase 3 problem.
        Don't add payment complexity to a free product.
```

---

# 19. BIGGEST FOUNDER MISTAKES TO AVOID

These are the exact failure modes for a product like Vuka, based on the pattern of how this architecture has already evolved over 4 conversations.

## Mistake 1: Mistaking architectural sophistication for product progress

```
SYMPTOM: You spend 3 hours designing a perfect database schema
         for a feature no user has asked for yet.

WHAT HAPPENED: You built a 12-table schema before writing a single lesson.

RULE: No new infrastructure until you have a user who needs it.
      "Users will need this" is not a user need.
      "A user asked for this" is a user need.
```

## Mistake 2: AI as the product rather than the assistant

```
SYMPTOM: You spend more time on Mwalimu's context injection system
         than on the lesson content Mwalimu is there to support.

WHAT HAPPENED: 4 Mwalimu modes designed before lesson 1 was written.

RULE: The lesson content is the product. Mwalimu is a support layer.
      If the lessons are bad, Mwalimu can't save them.
      If the lessons are excellent, Mwalimu adds 20% more value.
```

## Mistake 3: Building for the user you imagine, not the user who exists

```
SYMPTOM: You design for a user who reads every lesson carefully,
         engages with concept checkpoints, uses reflection prompts,
         opens Mwalimu proactively, and self-reports milestones.

REALITY: Your first 50 users will scan lessons, guess quiz answers,
         never open Mwalimu, and forget about the app for 2 weeks.

RULE: Design for the lazy, distracted, skeptical version of your user.
      Everything else is a bonus.
```

## Mistake 4: Perfect design before validated content

```
SYMPTOM: You spend 3 days perfecting the lesson page layout
         for content that one person has read and hasn't validated yet.

RULE: Content quality drives completion rates. Layout quality drives first impressions.
      Get content right first. Layout is fixable in a day.
      Bad content is not fixable with good layout.
```

## Mistake 5: Shipping to scale before shipping to learn

```
SYMPTOM: You plan a ProductHunt launch before anyone has completed the course.

RULE: The first version is for learning, not for growth.
      Ship to 10 people you can watch and talk to.
      Fix what you observe. Then scale.
      Launching to 1000 people with unvalidated content = 1000 bad first impressions.
```

## Mistake 6: Treating this document as a todo list instead of a strategy

```
SYMPTOM: You try to implement all 20 sections of this document
         before shipping lesson 1.

RULE: Ship lesson 1 to real users before implementing section 12.
      Real user feedback will make half of this document irrelevant
      and reveal things it doesn't cover.
      Strategy serves shipping. It doesn't replace it.
```

## Mistake 7: Keeping Zustand for "when we need it later"

```
SYMPTOM: "I'll keep Zustand in the codebase in case we need it for Phase 2."

REALITY: Zustand with localStorage persistence was the primary data store.
         Keeping it means two sources of truth: Supabase and localStorage.
         Two sources of truth means bugs that are hard to reproduce and hard to fix.

RULE: Remove it completely. If Phase 2 genuinely needs client-side state management,
      you'll add it then with a clear use case. Not as a precaution.
```

---

# 20. RUTHLESS FINAL PRODUCT STRATEGY

## What Vuka actually is, in 2025

A 6-lesson text course about the NSE, delivered as a web app, with an AI that can answer follow-up questions, and progress saved to a database so users can pick up where they left off.

That's it. Everything else is Phase 2 or later.

## The one metric that matters in Phase 1

**Course completion rate.**

Not signups. Not DAU. Not Mwalimu usage. Not time-on-site.

If users who start Lesson 1 go on to complete all 6 lessons, you have:
- Content that works
- Trust that holds
- A product worth scaling

If they don't, nothing else matters.

Measure it weekly: `COUNT(lesson_completed where lesson_id = 'after-investing') / COUNT(lesson_completed where lesson_id = 'what-is-nse')`

## The counterintuitive thing about your audience

Your users are skeptical of financial products. They've been burned or seen others burned.
The thing that will make them trust Vuka is not:
- Better design
- More features
- A more sophisticated AI
- Gamification

It's this: **the content being so clearly, honestly correct that they trust you by Lesson 2.**

When a user reads Lesson 2 and thinks "this is exactly what I needed to know about licensed brokers — and nobody told me this before" — that's the moment the product works.

Build toward that moment. Everything else is decoration.

## The only competitive advantage worth having in Phase 1

Six lessons that a Kenyan beginner can read, understand, and act on — that are more honest, more accurate, and more locally relevant than anything else available.

Not the AI. Not the design. Not the progression system.

**The content.**

Write it with that weight.

## Final build checklist — the only things that matter before launch

```
□ API key is on the server, not the client
□ Lesson progress saves to Supabase, not localStorage
□ Homepage passes the "scam product" smell test with 3 real Kenyan users
□ Lesson 1 can be read and understood by a Kenyan non-developer
□ Quiz questions test understanding, not memory
□ Quiz wrong answers have clear, honest static explanations (no AI needed)
□ Mwalimu gives relevant answers about the current lesson
□ Dashboard shows exactly one next action
□ The entire flow works on a mid-range Android phone on slow 4G
□ At least 3 real people have completed Lesson 1 before you tell anyone else about Vuka

If every box is checked: launch.
If any box is unchecked: fix that box first.
No exceptions.
```
