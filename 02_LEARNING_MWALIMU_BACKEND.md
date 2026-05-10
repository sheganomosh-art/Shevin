# Vuka V2 — Full Product Rebuild
## Sections 5–8: Learning Experience · Mwalimu AI · Backend · Supabase Schema

---

# 5. LEARNING EXPERIENCE ARCHITECTURE

## The Core Problem With Current Lessons

The current lesson is one long scroll of text followed by a 4-question quiz. That's a reading assignment with a test — not education. Educational psychology research is clear: passive reading produces ~10% retention. Active recall, spaced repetition, and application produce 60–80%. The current implementation gets you ~10%.

## Lesson Structure — The New Standard

Every lesson follows this exact structure. No exceptions.

```
LESSON ANATOMY
──────────────

[1] LESSON HEADER
    Module context + lesson number + estimated time
    No XP promise. No "earn 80 XP!" — this trains wrong behavior.

[2] LEARNING OBJECTIVES (3 max)
    "By the end of this lesson, you will be able to:"
    - Identify a CDS account and explain what it does
    - Name two requirements to open one in Kenya
    - Recognise what a licensed broker looks like
    These set intention. Users who know what they're learning for
    retain it better.

[3] CONTENT BLOCKS (alternating types)
    Each content section: max 150 words
    Types:
      → Explanation block (text)
      → Real example block ("Here's what this looks like on NSE.co.ke")
      → Term definition card (inline, expandable)
      → Concept checkpoint (mid-lesson mini-question — ungraded)
      → Warning/reality-check block (red-left-border card)
      → Kenya-specific context block (amber-left-border card)

[4] CONCEPT CHECKPOINT (mid-lesson, ungraded)
    A single question mid-lesson.
    Not graded. Not counted toward progression.
    Purpose: forces active engagement, surfaces confusion before quiz.
    If wrong: Mwalimu surfaces inline to explain.
    If right: "Exactly — keep going."

[5] LESSON SUMMARY (before quiz)
    3-bullet summary of what was covered.
    User must confirm: "I've read this lesson" — not auto-checked on scroll.
    This small act of agency improves completion intent.

[6] GRADED QUIZ
    5 questions (not 4 — odd numbers reduce "I'll guess the last one" behavior)
    Pass threshold: 80% (4/5)
    On fail: must wait 10 minutes before retry (reduces brute-force clicking)
    On fail: Mwalimu auto-activates in Concept Checker mode for wrong questions
    On pass: lesson marked complete, next lesson unlocked

[7] REFLECTION PROMPT (after pass — optional, skippable)
    One open text box:
    "In your own words: what would you tell a friend who asked what a CDS account is?"
    Not graded. Not submitted anywhere (yet — Phase 2 uses this for Mwalimu context).
    Purpose: self-explanation is the single highest-retention learning technique.
```

## Concept Checkpoint Design

```tsx
// components/learn/ConceptCheckpoint.tsx

interface ConceptCheckpointProps {
  question: string;
  options: { id: string; text: string }[];
  correctId: string;
  explanation: string;
  conceptTag: string; // fed to Mwalimu context if wrong
}

// UX behavior:
// - Appears inline between content sections, not as a separate page
// - Styled distinctly: bg-[--bg-tertiary], border-l-2 border-[--accent-blue]
// - Label: "Quick check" in mono — NOT "Quiz" (reduces anxiety)
// - No score. No XP. No pass/fail.
// - Wrong answer: gentle explanation appears inline (not from Mwalimu)
//   + conceptTag logged to user_confused_concepts table
// - Right answer: brief confirmation + continue reading
// - Cannot block lesson progress — it's a checkpoint, not a gate
```

## Quiz System — Full Rebuild

```tsx
// The quiz is a gate. It must be honest about being a gate.
// Don't hide it as "a fun challenge" — that's manipulative.

// Quiz intro screen:
// "To complete this lesson, you'll answer 5 questions.
//  You need to get 4 right to continue.
//  If you don't pass, Mwalimu will help you with the parts you missed.
//  There's no time limit."

// Question anatomy:
// - Question text: Inter, 18px, --text-primary
// - 4 options: A B C D — labeled with mono letters
// - No "I'll answer later" — answer all 5, then submit
// - Results shown after all 5 submitted (not per-question)
//   Reason: per-question results gamify the experience

// Results screen:
// PASS (4-5/5):
//   Title: "Lesson complete."
//   Subtitle: "[lesson title] is now part of your understanding."
//   List: show all 5 answers with correct/incorrect + brief explanation for each
//   CTA: "Continue to Lesson [N+1]"
//   NO confetti. NO XP popup. NO "Amazing work!"

// FAIL (0-3/5):
//   Title: "Not yet."  (not "Try again!" — honest, not dismissive)
//   Subtitle: "You got [N] out of 5. Here's what to review:"
//   List: show the wrong answers with explanations
//   Mwalimu: auto-activate Concept Checker for each wrong concept
//   CTA: "Review lesson" — links back to content at the relevant section
//   Timer: "You can retake in 10 minutes." — shown with countdown
```

## Progression Architecture — Skill Tree

### The Three Domains

```typescript
// lib/curriculum/skillTree.ts

export const SKILL_DOMAINS = [
  {
    id: 'nse-foundations',
    title: 'NSE Foundations',
    description: 'Understanding what the NSE is and how it operates',
    skills: [
      { id: 'nse-structure', label: 'NSE structure & regulation', lessonId: 'what-is-nse' },
      { id: 'market-participants', label: 'Brokers, CDSC & CDS accounts', lessonId: 'cds-accounts' },
      { id: 'stock-listings', label: 'Reading a stock listing', lessonId: 'reading-listings' },
      { id: 'price-movements', label: 'Price movements & charts', lessonId: 'price-movements' },
      { id: 'placing-orders', label: 'Placing a buy order', lessonId: 'first-order' },
      { id: 'account-management', label: 'Statements & post-investment', lessonId: 'after-investing' },
    ]
  },
  {
    id: 'investor-mindset',
    title: 'Investor Mindset',
    description: 'The psychology and discipline of long-term investing',
    skills: [
      { id: 'risk-understanding', label: 'Understanding investment risk', lessonId: 'risk-basics' },
      { id: 'long-term-thinking', label: 'Long-term vs short-term', lessonId: 'time-horizon' },
      { id: 'diversification', label: 'Diversification fundamentals', lessonId: 'diversification' },
      { id: 'cost-averaging', label: 'Cost averaging discipline', lessonId: 'cost-averaging' },
      { id: 'panic-management', label: 'When prices fall', lessonId: 'market-downturns' },
      { id: 'scam-recognition', label: 'Recognising investment fraud', lessonId: 'scam-protection' },
    ],
    prerequisiteDomainId: 'nse-foundations'
  }
] as const;
```

### Skill Tree UI

```
[SKILL TREE COMPONENT — dashboard section]

NSE FOUNDATIONS
  ┌─────────────────────────────────────────────────────┐
  │ ● NSE structure & regulation          ✓ Understood  │
  │ ● Brokers, CDSC & CDS accounts        ✓ Understood  │
  │ ● Reading a stock listing             → In progress │
  │ ○ Price movements & charts            · Locked      │
  │ ○ Placing a buy order                 · Locked      │
  │ ○ Statements & post-investment        · Locked      │
  └─────────────────────────────────────────────────────┘
  Progress: 2 of 6 skills · [████░░░░░░]

INVESTOR MINDSET
  ┌─────────────────────────────────────────────────────┐
  │ Unlocks after completing NSE Foundations            │
  └─────────────────────────────────────────────────────┘

Legend:
  ●  Understood (quiz passed ≥80%, no unresolved confusion)
  →  In progress
  ○  Locked (prerequisite not met)
  ⚠  Needs review (quiz passed but confusion flags unresolved)
```

### The "⚠ Needs Review" State

This is the most important innovation in the progression system. A user can pass the quiz at 80% (4/5) but still have 2 concept flags from checkpoints. That means they understand enough to pass, but have genuine confusion on specific sub-concepts. The `⚠ Needs Review` state surfaces this and Mwalimu's Progress Advisor addresses it proactively.

```typescript
// lib/progress/getSkillStatus.ts

type SkillStatus = 'locked' | 'in_progress' | 'understood' | 'needs_review';

export async function getSkillStatus(
  userId: string,
  skillId: string,
  supabase: SupabaseClient
): Promise<SkillStatus> {
  const skill = SKILL_MAP[skillId];
  if (!skill) return 'locked';

  const { data: progress } = await supabase
    .from('user_lesson_progress')
    .select('status')
    .eq('user_id', userId)
    .eq('lesson_id', skill.lessonId)
    .single();

  if (!progress || progress.status === 'not_started') return 'locked';
  if (progress.status === 'in_progress') return 'in_progress';

  // Lesson complete — check for unresolved confusion
  const { data: confusedConcepts } = await supabase
    .from('user_confused_concepts')
    .select('id')
    .eq('user_id', userId)
    .eq('lesson_id', skill.lessonId)
    .eq('resolved', false);

  if (confusedConcepts && confusedConcepts.length > 0) return 'needs_review';
  return 'understood';
}
```

## Real-World Milestones

```typescript
// lib/curriculum/milestones.ts

export const MILESTONES = [
  {
    id: 'lesson-1-complete',
    title: 'You understand what the NSE is',
    description: 'Most adults in Kenya don\'t. You now do.',
    trigger: 'auto', // auto-triggered on lesson completion
    lessonId: 'what-is-nse',
  },
  {
    id: 'scam-aware',
    title: 'Scam-aware investor',
    description: 'You can recognise the signs of an investment scam.',
    trigger: 'auto',
    lessonId: 'cds-accounts', // lesson 2 covers brokers and scam recognition
  },
  {
    id: 'cds-guide-read',
    title: 'CDS account guide reviewed',
    description: 'You\'ve read what\'s required to open a CDS account in Kenya.',
    trigger: 'auto',
    lessonId: 'cds-accounts',
  },
  {
    id: 'broker-shortlisted',
    title: 'Broker shortlisted',
    description: 'You\'ve identified a licensed NSE broker you\'re considering.',
    trigger: 'self_report', // user taps "Mark as done"
    prompt: 'Have you shortlisted a licensed broker to open your account with?',
    helperText: 'You can find the full list of licensed brokers at nse.co.ke/brokers',
  },
  {
    id: 'course-complete',
    title: 'NSE Foundations complete',
    description: 'You\'ve completed all six lessons. You are prepared to invest.',
    trigger: 'auto',
    requiresAllLessons: true,
  },
  {
    id: 'cds-account-opened',
    title: 'CDS account opened',
    description: 'You\'ve taken the most important practical step.',
    trigger: 'self_report',
    prompt: 'Have you opened your CDS account?',
    helperText: 'It typically takes 3–5 business days after submitting your application.',
    // This milestone has no follow-up content gate — it's a celebration, not a requirement
  },
  {
    id: 'first-investment',
    title: 'First NSE investment made',
    description: 'You are now an investor. This took courage and preparation.',
    trigger: 'self_report',
    prompt: 'Have you made your first NSE investment?',
  },
] as const;
```

### Milestone UX

```
[MILESTONE CARD — appears on dashboard, not as a popup]

Border-left: 3px solid --accent-green (auto) or --accent-amber (self_report)

Content:
  Icon: ✓ (auto-completed) or ○ (pending)
  Title: "CDS account guide reviewed"
  Body: "You've read what's required to open a CDS account in Kenya."
  
  If self_report and pending:
    CTA button: "Mark as done"
    Helper: "nse.co.ke/brokers — full list of licensed brokers"

  If completed:
    Date: "Completed 14 Apr 2025" — 11px mono, --text-tertiary
```

---

# 6. MWALIMU AI SYSTEM

## Architecture Overview

Mwalimu is not a chatbot. It is a **context injection system** with a conversation UI. The difference: a chatbot starts blank every conversation. Mwalimu starts every conversation with the user's full learning profile, current lesson, recent mistakes, and unresolved confusion — all injected server-side before the first Claude API call.

## Four Modes — Full Specification

### Mode 1: Lesson Companion

**When:** User is mid-lesson and taps the Mwalimu button
**Trigger:** Manual, user-initiated
**Context injected:** Current lesson title, current scroll position's section heading, user's unresolved confused concepts from this lesson, previous Mwalimu conversations about this lesson

```
UI:
  Slide-up panel — 45vh, rounded-t-2xl
  Drag handle at top
  Header: "Mwalimu · Lesson [N] companion" — 13px mono
  
  [Context chip — below header]:
    "Currently reading: [H3 heading nearest to user's scroll position]"
    Detected via IntersectionObserver on lesson content headings
  
  [Proactive opening — if user has confusion flags]:
    "You've asked about [concept] before.
     Want me to connect it to what you're reading now?"
    [Yes, explain] [No, I have a different question]
  
  [Default opening — no flags]:
    "What would you like me to explain from this section?"
  
  [Quick chips — 3 options, generated from current section's key terms]:
    [What is a CDS account?] [How do I open one?] [What's a licensed broker?]
  
  [Chat input]: "Or ask anything about this lesson..."
  
  [Footer note — small, --text-tertiary]:
    "Mwalimu explains concepts. For investment advice, speak to a licensed broker."
```

### Mode 2: Concept Checker

**When:** User submits quiz and gets one or more wrong
**Trigger:** Automatic — no user action required
**Context injected:** Wrong question text, wrong answer chosen, correct answer, concept tag, full lesson content for that section

```
UI:
  NOT a separate panel. Integrated into the quiz results screen.
  
  [After quiz results display]
  [For each wrong answer:]
  
    ┌─────────────────────────────────────────────┐
    │ 🤔 Let's look at this one                   │
    │ ─────────────────────────────────────────── │
    │ You chose: "A CDS account is a savings..."  │
    │ The correct answer: "A CDS account is..."   │
    │                                             │
    │ [Mwalimu explanation — 3–5 sentences,       │
    │  pre-generated via API call triggered on    │
    │  quiz submission, streamed in]              │
    │                                             │
    │ [Still confused?] → opens full Mwalimu chat │
    └─────────────────────────────────────────────┘
  
  Implementation note:
  On quiz submission (server action), if any answers are wrong:
  1. Log wrong concept tags to user_confused_concepts
  2. Immediately fire background API call for each wrong concept
  3. Cache the generated explanation in ai_explanations table
  4. Render on results screen without additional loading state
```

### Mode 3: Progress Advisor

**When:** User opens dashboard (weekly, if new advice available)
**Trigger:** Automatic — shown as a card on dashboard, not a popup
**Context injected:** All lesson progress, all confused concepts, recent quiz scores, days since last activity, milestone status

```
UI:
  [ADVISORY CARD — dashboard, below skill tree]
  
  Card header: "Mwalimu · Weekly review" — 11px mono
  
  Content examples (generated, not templated):
  
  — "You completed 'Reading a stock listing' 5 days ago
     and got question 3 wrong (about P/E ratios).
     Before moving to price movements, it's worth
     spending 10 minutes on this: [specific concept link]."
  
  — "You haven't opened a lesson in 8 days.
     That's fine — but the lesson on CDS accounts
     takes 20 minutes and unlocks the rest of the course.
     Pick it up when you're ready."
  
  — "You've completed 4 of 6 lessons with no unresolved confusion.
     You're ready for lesson 5. It covers the practical steps
     of your first buy order — this is the lesson people
     find most useful."
  
  [CTA — specific, not generic]:
    "Continue: Price movements & charts →"
  
  [Refresh]: "Get new advice" — tapping regenerates
```

### Mode 4: Open Chat

**When:** User navigates to /mwalimu
**Trigger:** Manual navigation
**Context injected:** Full learning profile, all lesson progress, all confused concepts, previous conversation history (last 10 messages)

```
UI: Full page chat — sidebar + main chat area
    (see Section 9 — Dashboard for full layout)

Opening message (generated, not static):
  If <2 lessons complete:
    "You're at the beginning of the course.
     What do you want to understand before you continue?"
  
  If mid-course:
    "You've completed [N] lessons. Your last quiz showed you
     found [concept] tricky. Want to work through that,
     or do you have a different question?"
  
  If course complete:
    "You've finished all six lessons. What questions do you have
     before opening your CDS account?"
```

## System Prompt — Full Implementation

```typescript
// lib/ai/buildMwalimuPrompt.ts

import type { MwalimuContext } from '@/lib/types/ai';

export function buildMwalimuPrompt(ctx: MwalimuContext): string {
  const { user, lesson, mode, confusedConcepts, recentQuizResults } = ctx;

  return `You are Mwalimu, a patient and knowledgeable NSE investing tutor for Kenyan beginners.

## Character
You are NOT a chatbot. You are a curriculum-aware learning companion integrated into a structured course about the Nairobi Securities Exchange.

Your character:
- Calm, precise, and warm — like a trusted older colleague who happens to know investing
- You use Swahili words naturally when they add warmth or clarity: "hisa" (shares), "soko" (market), "pesa" (money), "faida" (profit) — but never forced or performative
- You are honest about risk. You never make investing sound easy or guaranteed.
- You are deeply familiar with the Kenyan investing context: NSE, CDS accounts, CDSC, licensed brokers, M-Pesa funding, KES-denominated thinking, the 2008 NSE crash, common Kenyan investment scams
- You acknowledge Kenya's history with pyramid schemes and forex scams matter-of-factly, without drama
- You never recommend specific stocks or act as a financial advisor

## Absolute rules
1. Never recommend buying or selling specific securities
2. Never quote current stock prices or market data as if they are current
3. Never claim to be a financial advisor or compare yourself to one
4. For actual investment decisions: "Speak to a licensed NSE broker" — mention CDSC.co.ke for the verified list
5. If asked about pyramid schemes, forex bots, crypto investment packages: acknowledge, explain the risk clearly, redirect
6. Keep responses under 180 words unless the user explicitly asks for a full explanation
7. Never use bullet-pointed lists as your primary format — write in clear, direct prose
8. Never start a response with "Great question!" or any sycophantic opener

## User learning context
Name: ${user.name}
Lessons completed: ${user.lessonsCompleted} of ${user.totalLessons}
Current lesson: ${user.currentLesson ?? 'None — not in a lesson'}
Experience level: ${user.experience}
Investing goal: ${user.investingGoal ?? 'Not specified'}
Preferred language: ${user.preferredLanguage === 'sw' ? 'Kiswahili (respond in Kiswahili)' : 'English'}

Concepts this user has found confusing (from quiz mistakes and checkpoints):
${confusedConcepts.length > 0 ? confusedConcepts.map(c => `- ${c.conceptTag} (appeared ${c.occurrences}x, lesson: ${c.lessonId})`).join('\n') : 'None flagged yet'}

Recent quiz performance:
${recentQuizResults.length > 0
  ? recentQuizResults.map(r => `- ${r.lessonTitle}: ${r.score}/${r.total} ${r.passed ? '✓' : '✗'}`).join('\n')
  : 'No quizzes taken yet'}

${lesson ? `
## Current lesson context
The user is currently studying: "${lesson.title}"
Key concepts in this lesson: ${lesson.keyTerms.join(', ')}
Current section being read: ${ctx.currentSection ?? 'Beginning of lesson'}

Lesson content summary (use for context, do not reproduce verbatim):
${lesson.contentSummary}
` : ''}

## Mode: ${mode}
${mode === 'lesson_companion'
  ? 'The user has a question mid-lesson. Be concise — they want to understand something specific and get back to reading. Reference the current section if relevant.'
  : ''}
${mode === 'concept_checker'
  ? `The user just got a quiz question wrong. The wrong concept: ${ctx.wrongConcept}. The correct answer was: ${ctx.correctAnswer}. Explain the concept gently and clearly in 3–5 sentences. Connect it to something real in Kenya where possible. Do not make them feel bad for being wrong.`
  : ''}
${mode === 'progress_advisor'
  ? 'Generate a specific, honest advisory message based on the user\'s progress. Reference actual lessons and concepts they\'ve encountered. Be direct — not motivational. Tell them what to do next and why.'
  : ''}
${mode === 'open_chat'
  ? 'The user has a free-form question. Ground your answer in the NSE and Kenyan investing context. Acknowledge what they\'ve already learned in the course where relevant.'
  : ''}`;
}
```

## Backend: Secure API Route

```typescript
// app/api/mwalimu/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { createServerClient } from '@/lib/supabase/server';
import { buildMwalimuPrompt } from '@/lib/ai/buildMwalimuPrompt';
import { rateLimit } from '@/lib/ai/rateLimit';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

export async function POST(req: NextRequest) {
  // 1. Auth — always first
  const supabase = createServerClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // 2. Rate limit — 30 messages per day per user
  const { allowed, remaining } = await rateLimit(user.id, 30);
  if (!allowed) {
    return NextResponse.json(
      { error: 'Daily message limit reached. Come back tomorrow.' },
      { status: 429 }
    );
  }

  // 3. Parse request
  const { messages, lessonId, mode, wrongConcept, correctAnswer } = await req.json();

  // 4. Fetch user context — parallel queries
  const [profileResult, confusedResult, quizResult, lessonResult] = await Promise.all([
    supabase.from('profiles')
      .select('full_name, preferred_lang, investing_goal, experience')
      .eq('id', user.id).single(),
    supabase.from('user_confused_concepts')
      .select('concept_tag, lesson_id, occurrences')
      .eq('user_id', user.id).eq('resolved', false),
    supabase.from('user_quiz_attempts')
      .select('lesson_id, score, total, passed')
      .eq('user_id', user.id)
      .order('attempted_at', { ascending: false }).limit(6),
    lessonId
      ? supabase.from('lessons')
          .select('title, key_terms, content_summary')
          .eq('id', lessonId).single()
      : Promise.resolve({ data: null }),
  ]);

  const { data: progress } = await supabase
    .from('user_lesson_progress')
    .select('lesson_id, status')
    .eq('user_id', user.id)
    .eq('status', 'completed');

  const profile = profileResult.data;
  const lessonsCompleted = progress?.length ?? 0;

  const systemPrompt = buildMwalimuPrompt({
    user: {
      name: profile?.full_name ?? 'there',
      lessonsCompleted,
      totalLessons: 6,
      currentLesson: lessonResult.data?.title ?? null,
      experience: profile?.experience ?? 'beginner',
      investingGoal: profile?.investing_goal ?? null,
      preferredLanguage: profile?.preferred_lang ?? 'en',
    },
    lesson: lessonResult.data ? {
      title: lessonResult.data.title,
      keyTerms: lessonResult.data.key_terms ?? [],
      contentSummary: lessonResult.data.content_summary ?? '',
    } : null,
    confusedConcepts: confusedResult.data ?? [],
    recentQuizResults: (quizResult.data ?? []).map(q => ({
      lessonTitle: q.lesson_id,
      score: q.score,
      total: q.total,
      passed: q.passed,
    })),
    mode,
    wrongConcept,
    correctAnswer,
    currentSection: null, // passed from client via IntersectionObserver
  });

  // 5. Stream response
  const stream = await anthropic.messages.stream({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 600,
    system: systemPrompt,
    messages: messages.slice(-10), // last 10 messages only — cost control
  });

  // 6. Persist session asynchronously (don't await — don't block response)
  const fullResponse = await stream.finalText();

  supabase.from('ai_sessions').insert({
    user_id: user.id,
    lesson_id: lessonId ?? null,
    mode,
    messages: [...messages, { role: 'assistant', content: fullResponse }],
  }).then(() => {}).catch(console.error);

  // 7. Return streamed response
  return new NextResponse(stream.toReadableStream(), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'X-Remaining-Messages': remaining.toString(),
    },
  });
}
```

## Rate Limiting — Simple Supabase-Based

```typescript
// lib/ai/rateLimit.ts

export async function rateLimit(
  userId: string,
  dailyLimit: number
): Promise<{ allowed: boolean; remaining: number }> {
  const supabase = createServerClient();
  const since = new Date(Date.now() - 86_400_000).toISOString();

  const { count } = await supabase
    .from('ai_sessions')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .gte('created_at', since);

  const used = count ?? 0;
  return {
    allowed: used < dailyLimit,
    remaining: Math.max(0, dailyLimit - used),
  };
}
```

---

# 7. BACKEND ARCHITECTURE

## Separation of Concerns

```
SERVER RESPONSIBILITIES:
  - Auth validation (every protected request)
  - All database reads/writes
  - All Anthropic API calls (key never on client)
  - Progress calculation logic
  - Skill unlock logic
  - Analytics event logging
  - Rate limiting

CLIENT RESPONSIBILITIES:
  - UI state (active tab, panel open/closed, scroll position)
  - Form state (input values before submit)
  - Optimistic UI updates
  - Framer Motion animations
  - IntersectionObserver for section tracking

NEVER ON CLIENT:
  - ANTHROPIC_API_KEY
  - Raw database queries (use server actions or API routes)
  - Business logic (quiz pass/fail, skill unlocking)
```

## Supabase Client Setup

```typescript
// lib/supabase/server.ts
import { createServerClient as _createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Database } from '@/lib/types/database';

export function createServerClient() {
  const cookieStore = cookies();
  return _createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) { return cookieStore.get(name)?.value; },
        set(name, value, options) {
          try { cookieStore.set({ name, value, ...options }); } catch {}
        },
        remove(name, options) {
          try { cookieStore.set({ name, value: '', ...options }); } catch {}
        },
      },
    }
  );
}

// lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@/lib/types/database';

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
```

## Middleware — Auth Protection

```typescript
// middleware.ts
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

const PROTECTED = ['/dashboard', '/learn', '/quiz', '/mwalimu', '/profile', '/milestones'];
const AUTH_PAGES = ['/login', '/signup'];

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request: { headers: request.headers } });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) { return request.cookies.get(name)?.value; },
        set(name, value, options) {
          request.cookies.set({ name, value, ...options });
          response = NextResponse.next({ request: { headers: request.headers } });
          response.cookies.set({ name, value, ...options });
        },
        remove(name, options) {
          request.cookies.set({ name, value: '', ...options });
          response = NextResponse.next({ request: { headers: request.headers } });
          response.cookies.set({ name, value: '', ...options });
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  const path = request.nextUrl.pathname;

  const isProtected = PROTECTED.some(p => path.startsWith(p));
  const isAuthPage = AUTH_PAGES.some(p => path.startsWith(p));

  if (isProtected && !user) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('next', path);
    return NextResponse.redirect(url);
  }

  if (isAuthPage && user) {
    const url = request.nextUrl.clone();
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  // Redirect new users without completed onboarding
  if (user && path === '/dashboard') {
    const { data: profile } = await supabase
      .from('profiles')
      .select('onboarding_done')
      .eq('id', user.id)
      .single();
    if (!profile?.onboarding_done) {
      const url = request.nextUrl.clone();
      url.pathname = '/onboarding';
      return NextResponse.redirect(url);
    }
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/auth).*)'],
};
```

---

# 8. SUPABASE SCHEMA — COMPLETE

```sql
-- ════════════════════════════════════════════════════
-- EXTENSIONS
-- ════════════════════════════════════════════════════
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";


-- ════════════════════════════════════════════════════
-- PROFILES
-- Extends auth.users — one row per user
-- ════════════════════════════════════════════════════
CREATE TABLE public.profiles (
  id               UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name        TEXT NOT NULL,
  country_code     TEXT NOT NULL DEFAULT 'KE',
  phone            TEXT,
  preferred_lang   TEXT NOT NULL DEFAULT 'en'
                   CHECK (preferred_lang IN ('en', 'sw')),
  investing_goal   TEXT,
  experience       TEXT CHECK (experience IN ('none','some','experienced')),
  risk_answer      TEXT,          -- Response to risk checkpoint question
  onboarding_done  BOOLEAN NOT NULL DEFAULT FALSE,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_select_own" ON public.profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);
-- INSERT handled by trigger on auth.users


-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Learner')
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- ════════════════════════════════════════════════════
-- CURRICULUM (read-only for users, managed by admin)
-- ════════════════════════════════════════════════════
CREATE TABLE public.modules (
  id                    TEXT PRIMARY KEY,  -- 'nse-foundations'
  title                 TEXT NOT NULL,
  description           TEXT,
  order_index           INT NOT NULL,
  prerequisite_module_id TEXT REFERENCES public.modules(id),
  is_published          BOOLEAN NOT NULL DEFAULT FALSE,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.lessons (
  id               TEXT PRIMARY KEY,  -- 'what-is-nse'
  module_id        TEXT NOT NULL REFERENCES public.modules(id),
  title            TEXT NOT NULL,
  content_mdx      TEXT NOT NULL,    -- Full MDX content
  content_summary  TEXT,             -- 500-word summary for Mwalimu context injection
  key_terms        TEXT[] NOT NULL DEFAULT '{}',
  section_headings TEXT[] NOT NULL DEFAULT '{}', -- For IntersectionObserver labels
  estimated_mins   INT NOT NULL DEFAULT 20,
  order_index      INT NOT NULL,
  is_published     BOOLEAN NOT NULL DEFAULT FALSE,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.quiz_questions (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lesson_id       TEXT NOT NULL REFERENCES public.lessons(id),
  question        TEXT NOT NULL,
  options         JSONB NOT NULL,
  -- Format: [{"id": "a", "text": "..."}, {"id": "b", "text": "..."}, ...]
  correct_id      TEXT NOT NULL,
  explanation     TEXT NOT NULL,
  concept_tag     TEXT NOT NULL,  -- 'cds-account', 'candlestick', 'broker'
  order_index     INT NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS: curriculum is read-only for all authenticated users
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "modules_read_published" ON public.modules
  FOR SELECT USING (is_published = TRUE);
CREATE POLICY "lessons_read_published" ON public.lessons
  FOR SELECT USING (is_published = TRUE);
CREATE POLICY "quiz_questions_read_all" ON public.quiz_questions
  FOR SELECT USING (auth.role() = 'authenticated');


-- ════════════════════════════════════════════════════
-- LEARNING PROGRESS
-- ════════════════════════════════════════════════════
CREATE TABLE public.user_lesson_progress (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id       TEXT NOT NULL REFERENCES public.lessons(id),
  status          TEXT NOT NULL DEFAULT 'not_started'
                  CHECK (status IN ('not_started', 'in_progress', 'completed')),
  started_at      TIMESTAMPTZ,
  completed_at    TIMESTAMPTZ,
  time_spent_secs INT NOT NULL DEFAULT 0,
  last_section    TEXT,  -- Last H2/H3 heading user was at (from IntersectionObserver)
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, lesson_id)
);

ALTER TABLE public.user_lesson_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "progress_own" ON public.user_lesson_progress
  FOR ALL USING (auth.uid() = user_id);


CREATE TABLE public.user_quiz_attempts (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id        UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id      TEXT NOT NULL REFERENCES public.lessons(id),
  answers        JSONB NOT NULL,
  -- Format: [{"question_id": "uuid", "chosen_id": "b", "correct_id": "c", "correct": false}]
  score          INT NOT NULL,
  total          INT NOT NULL,
  passed         BOOLEAN NOT NULL,
  attempt_number INT NOT NULL DEFAULT 1,
  attempted_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.user_quiz_attempts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "quiz_attempts_own" ON public.user_quiz_attempts
  FOR ALL USING (auth.uid() = user_id);


CREATE TABLE public.user_skills (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id      UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  skill_id     TEXT NOT NULL,  -- 'nse-foundations.cds-accounts'
  status       TEXT NOT NULL DEFAULT 'understood'
               CHECK (status IN ('understood', 'needs_review')),
  unlocked_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, skill_id)
);

ALTER TABLE public.user_skills ENABLE ROW LEVEL SECURITY;
CREATE POLICY "skills_own" ON public.user_skills
  FOR ALL USING (auth.uid() = user_id);


CREATE TABLE public.user_milestones (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id          UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  milestone_id     TEXT NOT NULL,
  is_self_reported BOOLEAN NOT NULL DEFAULT FALSE,
  achieved_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, milestone_id)
);

ALTER TABLE public.user_milestones ENABLE ROW LEVEL SECURITY;
CREATE POLICY "milestones_own" ON public.user_milestones
  FOR ALL USING (auth.uid() = user_id);


-- ════════════════════════════════════════════════════
-- AI / MWALIMU
-- ════════════════════════════════════════════════════
CREATE TABLE public.user_confused_concepts (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id      UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  concept_tag  TEXT NOT NULL,
  lesson_id    TEXT NOT NULL REFERENCES public.lessons(id),
  occurrences  INT NOT NULL DEFAULT 1,
  resolved     BOOLEAN NOT NULL DEFAULT FALSE,
  resolved_at  TIMESTAMPTZ,
  last_seen    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, concept_tag)
);

ALTER TABLE public.user_confused_concepts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "confused_concepts_own" ON public.user_confused_concepts
  FOR ALL USING (auth.uid() = user_id);


CREATE TABLE public.ai_sessions (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id   TEXT REFERENCES public.lessons(id),
  mode        TEXT NOT NULL
              CHECK (mode IN ('lesson_companion','concept_checker','progress_advisor','open_chat')),
  messages    JSONB NOT NULL DEFAULT '[]',
  -- Format: [{"role": "user"|"assistant", "content": "..."}]
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.ai_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ai_sessions_own" ON public.ai_sessions
  FOR ALL USING (auth.uid() = user_id);


-- Pre-generated concept explanations (avoids re-generating for same wrong answers)
CREATE TABLE public.ai_explanations (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  concept_tag  TEXT NOT NULL,
  lesson_id    TEXT NOT NULL REFERENCES public.lessons(id),
  explanation  TEXT NOT NULL,
  generated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(concept_tag, lesson_id)
);
-- No RLS — read-only reference table, no user data


-- ════════════════════════════════════════════════════
-- ANALYTICS (server-write only, no user-facing reads)
-- ════════════════════════════════════════════════════
CREATE TABLE public.events (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID,  -- nullable for anonymous page views
  event_type  TEXT NOT NULL,
  -- Enum of types:
  -- 'page_view', 'lesson_started', 'lesson_completed',
  -- 'checkpoint_answered', 'quiz_submitted', 'quiz_passed', 'quiz_failed',
  -- 'mwalimu_opened', 'mwalimu_message_sent',
  -- 'milestone_achieved', 'skill_unlocked',
  -- 'signup_completed', 'onboarding_completed'
  properties  JSONB,
  session_id  TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- No RLS on events — written by server only (service role key)
-- Indexed for querying
CREATE INDEX events_user_id_idx    ON public.events (user_id);
CREATE INDEX events_type_idx       ON public.events (event_type);
CREATE INDEX events_created_at_idx ON public.events (created_at DESC);


-- ════════════════════════════════════════════════════
-- INDEXES FOR PERFORMANCE
-- ════════════════════════════════════════════════════
CREATE INDEX lesson_progress_user_id ON public.user_lesson_progress (user_id);
CREATE INDEX quiz_attempts_user_id   ON public.user_quiz_attempts (user_id);
CREATE INDEX quiz_attempts_lesson_id ON public.user_quiz_attempts (lesson_id);
CREATE INDEX confused_user_lesson    ON public.user_confused_concepts (user_id, lesson_id);
CREATE INDEX ai_sessions_user_id     ON public.ai_sessions (user_id);
CREATE INDEX ai_sessions_created_at  ON public.ai_sessions (created_at DESC);
```
