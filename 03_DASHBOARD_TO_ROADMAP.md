# Vuka V2 — Full Product Rebuild
## Sections 9–24: Dashboard · Lesson Flow · Components · Architecture · Roadmap

---

# 9. DASHBOARD REDESIGN

## Philosophy
The dashboard must answer one question instantly: "What should I do next?" Everything else is secondary.

## Layout — Desktop (sidebar + main)

```
┌──────────────────────────────────────────────────────────────────┐
│ NAVBAR — h-14, sticky, blur backdrop                             │
├────────────┬─────────────────────────────────────────────────────┤
│            │                                                     │
│  SIDEBAR   │  MAIN CONTENT                                       │
│  w-56      │  flex-1, max-w-3xl, px-8, py-8                     │
│            │                                                     │
│  Logo      │  [GREETING]                                         │
│  ──────    │  "Good morning, Wanjiku."                           │
│  Dashboard │  11px mono, Day 4 of learning                      │
│  Learn     │                                                     │
│  Mwalimu   │  [NEXT ACTION CARD — primary, full width]          │
│  Profile   │  Single card. One action. Always.                   │
│  ──────    │                                                     │
│  Progress  │  [SKILL TREE — 2 domains, collapsible]             │
│  mini-card │                                                     │
│            │  [MILESTONES — 3 most relevant]                    │
│            │                                                     │
│            │  [MWALIMU ADVISORY — weekly, if new]               │
│            │                                                     │
└────────────┴─────────────────────────────────────────────────────┘
```

## Next Action Card — The Most Important Element

```tsx
// components/dashboard/NextActionCard.tsx
// Server component — receives computed next action

type NextAction =
  | { type: 'start_lesson'; lessonId: string; lessonTitle: string; estimatedMins: number }
  | { type: 'continue_lesson'; lessonId: string; lessonTitle: string; lastSection: string }
  | { type: 'retake_quiz'; lessonId: string; lessonTitle: string; minutesUntilRetry: number | null }
  | { type: 'resolve_confusion'; conceptTag: string; lessonId: string }
  | { type: 'course_complete' };

// Visual for 'continue_lesson':
//
// ┌────────────────────────────────────────────────────────────────┐
// │ LESSON 3 · CONTINUE                        [11px mono, muted] │
// │                                                                │
// │ Reading a stock listing                    [18px, --primary]  │
// │ You were at: "What the price column means" [13px, --secondary]│
// │                                                                │
// │ Estimated time remaining: ~12 min          [12px mono, muted] │
// │                                                                │
// │                              [Continue lesson →]  [primary btn]│
// └────────────────────────────────────────────────────────────────┘

// Visual for 'retake_quiz' (cooling off):
//
// ┌────────────────────────────────────────────────────────────────┐
// │ QUIZ · REVIEW PERIOD                       [11px mono, muted] │
// │                                                                │
// │ You scored 3/5 on Lesson 2                 [18px, --primary]  │
// │ Review what you missed before retaking.    [13px, --secondary]│
// │                                                                │
// │ Retake available in: 08:42                 [12px mono, amber] │
// │                                                                │
// │ [Review wrong answers]  [Ask Mwalimu]                        │
// └────────────────────────────────────────────────────────────────┘
```

## Computing Next Action — Server Logic

```typescript
// lib/dashboard/getNextAction.ts
'use server';

export async function getNextAction(userId: string, supabase: SupabaseClient): Promise<NextAction> {
  // 1. Any lesson in_progress?
  const { data: inProgress } = await supabase
    .from('user_lesson_progress')
    .select('lesson_id, last_section')
    .eq('user_id', userId)
    .eq('status', 'in_progress')
    .limit(1).single();

  if (inProgress) {
    const lesson = await getLesson(inProgress.lesson_id, supabase);
    return {
      type: 'continue_lesson',
      lessonId: inProgress.lesson_id,
      lessonTitle: lesson.title,
      lastSection: inProgress.last_section ?? 'Beginning',
    };
  }

  // 2. Any failed quiz with cooling-off period?
  const { data: recentFail } = await supabase
    .from('user_quiz_attempts')
    .select('lesson_id, attempted_at')
    .eq('user_id', userId).eq('passed', false)
    .order('attempted_at', { ascending: false })
    .limit(1).single();

  if (recentFail) {
    const minutesSince = (Date.now() - new Date(recentFail.attempted_at).getTime()) / 60000;
    if (minutesSince < 10) {
      return {
        type: 'retake_quiz',
        lessonId: recentFail.lesson_id,
        lessonTitle: (await getLesson(recentFail.lesson_id, supabase)).title,
        minutesUntilRetry: Math.ceil(10 - minutesSince),
      };
    }
  }

  // 3. Next unstarted lesson
  const completedLessonIds = await getCompletedLessonIds(userId, supabase);
  const { data: nextLesson } = await supabase
    .from('lessons')
    .select('id, title, estimated_mins')
    .eq('is_published', true)
    .not('id', 'in', `(${completedLessonIds.join(',')})`)
    .order('order_index')
    .limit(1).single();

  if (nextLesson) {
    return {
      type: 'start_lesson',
      lessonId: nextLesson.id,
      lessonTitle: nextLesson.title,
      estimatedMins: nextLesson.estimated_mins,
    };
  }

  return { type: 'course_complete' };
}
```

## Sidebar

```tsx
// components/layout/Sidebar.tsx

// Desktop sidebar — w-56, fixed height, py-6, px-4
// Mobile: hidden — replaced by bottom tab bar (see Section 17)

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: HomeIcon },
  { href: '/learn',     label: 'Course',    icon: BookOpenIcon },
  { href: '/mwalimu',  label: 'Mwalimu',   icon: ChatBubbleIcon },
  { href: '/profile',  label: 'Profile',   icon: UserIcon },
];

// Active state: bg-[--bg-overlay] border-l-2 border-[--accent-green]
// Inactive:     text-[--text-secondary] hover:text-[--text-primary] hover:bg-[--bg-overlay]

// Bottom of sidebar — progress mini-card
// ┌──────────────────────────┐
// │ NSE Foundations          │
// │ ████░░ 2 of 6 skills     │
// │                          │
// │ Next: Lesson 3           │
// └──────────────────────────┘
```

---

# 10. LESSON FLOW REDESIGN

## URL Structure

```
/learn                          — Course overview (all modules)
/learn/nse-foundations          — Module overview
/learn/nse-foundations/what-is-nse  — Lesson page
/learn/nse-foundations/what-is-nse/quiz  — Quiz page
```

## Lesson Page — Component Tree

```
LessonPage (server component — fetches lesson, progress, Mwalimu context)
│
├── LessonLayout
│   ├── LessonSidebar (sticky, desktop only)
│   │   ├── LessonProgressList      — all lessons, status indicators
│   │   ├── LessonMetadata          — time estimate, section headings
│   │   └── MwalimuQuickAccess      — "Ask Mwalimu" button
│   │
│   └── LessonMain
│       ├── LessonBreadcrumb        — "NSE Foundations → Lesson 3"
│       ├── LessonHeader
│       │   ├── MonoLabel           — "LESSON 03 · ~25 MIN"
│       │   ├── LessonTitle         — Instrument Serif, 36px
│       │   └── LearningObjectives  — 3 bullets, collapsible
│       │
│       ├── LessonContent           — MDX rendered
│       │   ├── ExplanationBlock    — standard prose
│       │   ├── TermCard            — expandable definition
│       │   ├── RealExampleBlock    — "Here's what this looks like..."
│       │   ├── WarningBlock        — red-left-border callout
│       │   ├── KenyaContextBlock   — amber-left-border callout
│       │   └── ConceptCheckpoint   — inline ungraded question
│       │
│       ├── LessonSummary           — 3 bullet recap
│       ├── LessonConfirmation      — "I've read this lesson" button
│       └── LessonFooter
│           ├── PreviousButton
│           └── TakeQuizButton      — disabled until confirmed
│
└── MwalimuPanel (client component, portal)
    — slide-up, z-50, activated by MwalimuQuickAccess button
```

## Lesson Content — MDX Component Map

```tsx
// content/lessons/what-is-nse.mdx example:

---
id: what-is-nse
title: What is the NSE?
estimatedMins: 15
keyTerms: ['NSE', 'CMA', 'listed company', 'shares', 'stockbroker']
sectionHeadings:
  - 'What the NSE actually is'
  - 'Who regulates it'
  - 'What gets traded'
  - 'Who can invest'
objectives:
  - 'Explain what the Nairobi Securities Exchange is'
  - 'Name the regulator that oversees it'
  - 'Identify who is eligible to invest'
---

<KenyaContext>
  The NSE was established in 1954. It's one of the oldest exchanges in Africa,
  and one of the few regulated by a government authority —
  the Capital Markets Authority (CMA).
</KenyaContext>

## What the NSE actually is

The Nairobi Securities Exchange is a market — like any market, except
what's being bought and sold are small pieces of ownership in companies.

<TermCard term="Listed company">
  A company that has gone through a formal process to offer pieces of itself
  for public ownership. Not every Kenyan company is listed — only those that
  have met the NSE's requirements. Currently, about 60 companies are listed.
</TermCard>

When a company lists on the NSE, it's saying: "We will sell portions of our
business to the public, and those portions can be freely traded."

## Who regulates it

<ConceptCheckpoint
  question="Which organisation regulates the NSE?"
  options={[
    { id: 'a', text: 'The Central Bank of Kenya' },
    { id: 'b', text: 'The Capital Markets Authority' },
    { id: 'c', text: 'The NSE regulates itself' },
    { id: 'd', text: 'The Ministry of Finance' },
  ]}
  correctId="b"
  explanation="The Capital Markets Authority (CMA) is Kenya's independent capital markets regulator, established by the Capital Markets Act. The NSE operates under its oversight."
  conceptTag="nse-regulation"
/>
```

## Quiz Page — Component Tree

```
QuizPage (client component — interactive state machine)
│
├── QuizHeader
│   ├── LessonContext          — "Quiz: What is the NSE?"
│   ├── ProgressBar            — questions answered / total
│   └── QuizInstructions       — "Answer all 5. Submit when ready."
│
├── QuizBody (state: 'answering' | 'submitted' | 'cooling_off')
│   │
│   ├── [answering state]
│   │   ├── QuizQuestion (x5, paginated — one at a time on mobile)
│   │   │   ├── QuestionText
│   │   │   └── OptionList
│   │   │       └── OptionButton (A/B/C/D, selectable, mono label)
│   │   └── SubmitButton       — disabled until all answered
│   │
│   ├── [submitted: passed]
│   │   ├── PassHeader         — "Lesson complete."
│   │   ├── AnswerReview       — all 5 with correct/wrong + explanation
│   │   └── NextLessonButton
│   │
│   ├── [submitted: failed]
│   │   ├── FailHeader         — "Not yet. [N]/5 correct."
│   │   ├── WrongAnswerReview  — wrong answers with explanations
│   │   ├── MwalimuConceptCheckers (x wrong answers)
│   │   ├── RetryCountdown     — "Retake available in 09:47"
│   │   └── ReviewLessonButton
│   │
│   └── [cooling_off — if user returns during cooldown]
│       ├── CountdownDisplay
│       └── ReviewWhileWaiting — links to specific lesson sections
```

---

# 11. PROGRESSION SYSTEM — FULL IMPLEMENTATION

```typescript
// lib/progress/progressionEngine.ts
'use server';

/**
 * Called after every quiz pass.
 * Determines: skill unlock, milestone award, needs_review flag.
 */
export async function processLessonCompletion(
  userId: string,
  lessonId: string,
  quizAttemptId: string,
  supabase: SupabaseClient
): Promise<{
  skillUnlocked: string | null;
  milestonesAwarded: string[];
  needsReview: boolean;
}> {
  // 1. Mark lesson complete
  await supabase.from('user_lesson_progress').upsert({
    user_id: userId,
    lesson_id: lessonId,
    status: 'completed',
    completed_at: new Date().toISOString(),
  }, { onConflict: 'user_id,lesson_id' });

  // 2. Check for unresolved confusion (determines skill status)
  const { data: unresolved } = await supabase
    .from('user_confused_concepts')
    .select('id')
    .eq('user_id', userId)
    .eq('lesson_id', lessonId)
    .eq('resolved', false);

  const needsReview = (unresolved?.length ?? 0) > 0;

  // 3. Unlock skill
  const skillId = LESSON_TO_SKILL_MAP[lessonId];
  let skillUnlocked: string | null = null;
  if (skillId) {
    await supabase.from('user_skills').upsert({
      user_id: userId,
      skill_id: skillId,
      status: needsReview ? 'needs_review' : 'understood',
    }, { onConflict: 'user_id,skill_id' });
    skillUnlocked = skillId;
  }

  // 4. Check and award auto milestones
  const milestonesAwarded = await checkAutoMilestones(userId, lessonId, supabase);

  // 5. Log event
  await supabase.from('events').insert({
    user_id: userId,
    event_type: 'lesson_completed',
    properties: {
      lesson_id: lessonId,
      quiz_attempt_id: quizAttemptId,
      skill_unlocked: skillId,
      needs_review: needsReview,
      milestones_awarded: milestonesAwarded,
    },
  });

  return { skillUnlocked, milestonesAwarded, needsReview };
}

async function checkAutoMilestones(
  userId: string,
  lessonId: string,
  supabase: SupabaseClient
): Promise<string[]> {
  const awarded: string[] = [];

  const AUTO_MILESTONES: { id: string; triggerLessonId: string }[] = [
    { id: 'lesson-1-complete', triggerLessonId: 'what-is-nse' },
    { id: 'scam-aware',        triggerLessonId: 'cds-accounts' },
    { id: 'cds-guide-read',    triggerLessonId: 'cds-accounts' },
  ];

  for (const milestone of AUTO_MILESTONES) {
    if (milestone.triggerLessonId !== lessonId) continue;

    const { data: existing } = await supabase
      .from('user_milestones')
      .select('id')
      .eq('user_id', userId)
      .eq('milestone_id', milestone.id)
      .single();

    if (!existing) {
      await supabase.from('user_milestones').insert({
        user_id: userId,
        milestone_id: milestone.id,
        is_self_reported: false,
      });
      awarded.push(milestone.id);
    }
  }

  // Check course completion
  const { count } = await supabase
    .from('user_lesson_progress')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('status', 'completed');

  if (count === 6) {
    await supabase.from('user_milestones').upsert({
      user_id: userId,
      milestone_id: 'course-complete',
      is_self_reported: false,
    }, { onConflict: 'user_id,milestone_id' });
    awarded.push('course-complete');
  }

  return awarded;
}
```

---

# 12. COMPONENT ARCHITECTURE

## Full Component Tree

```
components/
│
├── ui/                         [Design system primitives]
│   ├── Button.tsx              — primary | secondary | ghost variants
│   ├── Card.tsx                — base | interactive | elevated | warning variants
│   ├── Input.tsx               — with label, error state
│   ├── MonoLabel.tsx           — 11px mono uppercase label
│   ├── ProgressBar.tsx         — labeled, animated width
│   ├── Skeleton.tsx            — loading placeholder
│   ├── Tooltip.tsx             — hover/tap definitions
│   ├── Accordion.tsx           — FAQ, collapsible sections
│   ├── Badge.tsx               — status chips (small, restrained)
│   └── Spinner.tsx             — minimal loading indicator
│
├── layout/
│   ├── Navbar.tsx              — marketing | app variants
│   ├── Sidebar.tsx             — desktop app navigation
│   ├── BottomNav.tsx           — mobile app navigation
│   ├── AppShell.tsx            — sidebar + main wrapper
│   └── PageHeader.tsx          — consistent page title block
│
├── marketing/                  [Homepage & public pages]
│   ├── Hero.tsx
│   ├── TrustBar.tsx
│   ├── CurriculumPath.tsx
│   ├── WhatVukaIsNot.tsx       — scam inoculation section
│   ├── Testimonial.tsx
│   ├── FAQ.tsx
│   └── FinalCTA.tsx
│
├── learn/                      [Lesson experience]
│   ├── LessonLayout.tsx
│   ├── LessonSidebar.tsx
│   ├── LessonHeader.tsx
│   ├── LessonContent.tsx       — MDX renderer wrapper
│   ├── LessonSummary.tsx
│   ├── LessonConfirmation.tsx  — "I've read this" gate
│   ├── LessonProgressList.tsx  — sidebar lesson list
│   ├── ConceptCheckpoint.tsx   — inline ungraded question
│   ├── TermCard.tsx            — expandable definition
│   ├── ExplanationBlock.tsx
│   ├── RealExampleBlock.tsx
│   ├── WarningBlock.tsx
│   └── KenyaContextBlock.tsx
│
├── quiz/
│   ├── QuizShell.tsx           — state machine wrapper
│   ├── QuizQuestion.tsx
│   ├── OptionButton.tsx
│   ├── QuizResults.tsx         — pass/fail branching
│   ├── AnswerReview.tsx
│   ├── RetryCountdown.tsx
│   └── WrongAnswerCard.tsx
│
├── mwalimu/
│   ├── MwalimuPanel.tsx        — lesson companion slide-up
│   ├── MwalimuChat.tsx         — conversation UI (shared)
│   ├── MwalimuMessage.tsx      — individual message bubble
│   ├── MwalimuChips.tsx        — quick suggestion chips
│   ├── MwalimuInput.tsx        — textarea + send button
│   ├── MwalimuAdvisory.tsx     — dashboard advisory card
│   ├── ConceptExplainer.tsx    — inline concept checker (quiz results)
│   └── MwalimuFullPage.tsx     — /mwalimu open chat page
│
├── dashboard/
│   ├── DashboardGreeting.tsx
│   ├── NextActionCard.tsx
│   ├── SkillTree.tsx
│   ├── SkillDomain.tsx
│   ├── SkillItem.tsx
│   ├── MilestoneList.tsx
│   ├── MilestoneCard.tsx
│   └── ProgressMiniCard.tsx    — sidebar widget
│
└── onboarding/
    ├── OnboardingShell.tsx     — step manager
    ├── GoalStep.tsx
    ├── ExperienceStep.tsx
    ├── RiskCheckpoint.tsx      — the introspective risk question
    └── OnboardingComplete.tsx
```

---

# 13. FOLDER STRUCTURE

```
vuka/
│
├── app/
│   ├── (marketing)/
│   │   ├── page.tsx                    ← Homepage
│   │   ├── layout.tsx                  ← Marketing layout (no sidebar)
│   │   └── not-found.tsx
│   │
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   ├── signup/page.tsx
│   │   └── layout.tsx                  ← Minimal auth layout
│   │
│   ├── (app)/                          ← Protected routes
│   │   ├── layout.tsx                  ← AppShell (sidebar + navbar)
│   │   ├── dashboard/
│   │   │   └── page.tsx               ← Server component, fetches all data
│   │   ├── learn/
│   │   │   ├── page.tsx               ← Course overview
│   │   │   └── [moduleId]/
│   │   │       ├── page.tsx           ← Module overview
│   │   │       └── [lessonId]/
│   │   │           ├── page.tsx       ← Lesson page
│   │   │           └── quiz/
│   │   │               └── page.tsx   ← Quiz page
│   │   ├── mwalimu/
│   │   │   └── page.tsx              ← Open chat
│   │   ├── profile/
│   │   │   └── page.tsx
│   │   └── milestones/
│   │       └── page.tsx
│   │
│   ├── api/
│   │   ├── mwalimu/route.ts           ← AI endpoint (key server-only)
│   │   ├── progress/route.ts          ← Progress updates
│   │   └── events/route.ts            ← Analytics ingestion
│   │
│   ├── layout.tsx                     ← Root layout
│   └── globals.css
│
├── components/                        ← (see Section 12)
│
├── content/
│   ├── modules.ts                     ← Module metadata (static, typed)
│   └── lessons/
│       ├── what-is-nse.mdx
│       ├── cds-accounts.mdx
│       ├── reading-listings.mdx
│       ├── price-movements.mdx
│       ├── first-order.mdx
│       └── after-investing.mdx
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   └── server.ts
│   ├── ai/
│   │   ├── buildMwalimuPrompt.ts
│   │   ├── rateLimit.ts
│   │   └── trackConfusedConcept.ts
│   ├── curriculum/
│   │   ├── skillTree.ts
│   │   └── milestones.ts
│   ├── dashboard/
│   │   └── getNextAction.ts
│   ├── progress/
│   │   ├── progressionEngine.ts
│   │   ├── getSkillStatus.ts
│   │   └── markLessonComplete.ts      ← Server action
│   └── types/
│       ├── database.ts                ← Generated Supabase types
│       ├── curriculum.ts
│       ├── progress.ts
│       └── ai.ts
│
├── middleware.ts
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

# 14. API STRUCTURE

## Server Actions vs API Routes

```
USE SERVER ACTIONS FOR:
  - Marking lesson complete (form submission equivalent)
  - Updating profile (onboarding form)
  - Self-reporting milestones
  - Tracking time spent on lesson
  - Logging concept checkpoints

USE API ROUTES FOR:
  - /api/mwalimu — streaming AI responses (can't stream from server actions)
  - /api/events  — analytics ingestion (may be called from edge functions)
  - /api/progress — progress webhooks (future: if broker integrations added)
```

## Server Actions — Key Examples

```typescript
// lib/progress/markLessonComplete.ts
'use server';
import { createServerClient } from '@/lib/supabase/server';
import { processLessonCompletion } from '@/lib/progress/progressionEngine';
import { revalidatePath } from 'next/cache';

export async function markLessonComplete(lessonId: string, quizAttemptId: string) {
  const supabase = createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  const result = await processLessonCompletion(user.id, lessonId, quizAttemptId, supabase);

  revalidatePath('/dashboard');
  revalidatePath(`/learn`);
  revalidatePath(`/profile`);

  return result;
}

// lib/progress/trackTimeSpent.ts
'use server';
export async function trackTimeSpent(lessonId: string, seconds: number) {
  const supabase = createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from('user_lesson_progress')
    .upsert({
      user_id: user.id,
      lesson_id: lessonId,
      status: 'in_progress',
      started_at: new Date().toISOString(),
    }, { onConflict: 'user_id,lesson_id', ignoreDuplicates: false })
    .then(() =>
      supabase.rpc('increment_time_spent', {
        p_user_id: user.id,
        p_lesson_id: lessonId,
        p_seconds: seconds,
      })
    );
}

// lib/progress/submitSelfReportMilestone.ts
'use server';
export async function submitSelfReportMilestone(milestoneId: string) {
  const supabase = createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  await supabase.from('user_milestones').upsert({
    user_id: user.id,
    milestone_id: milestoneId,
    is_self_reported: true,
  }, { onConflict: 'user_id,milestone_id' });

  revalidatePath('/dashboard');
  revalidatePath('/milestones');
}
```

---

# 15. UX WRITING SYSTEM

## Voice & Tone Rules

```
THE VOICE: "Patient expert friend"
Not a professor. Not a bank. Not a startup.
Someone who knows Kenyan markets, wants you to understand them,
and respects your intelligence.

FOUR TONAL REGISTERS:

1. INSTRUCTIONAL (lessons, how-tos)
   Clear. Short sentences. Active voice. Present tense.
   Define every term. No assumed knowledge.
   "A CDS account is where your shares are held electronically.
    You open one through a licensed broker. It takes 3–5 days."

2. ADVISORY (Mwalimu, dashboard)
   Warm but precise. References what the user has done.
   Never generic motivation.
   "You struggled with P/E ratios in Lesson 3.
    Lesson 5 uses them again. Worth a quick review first."

3. HONEST (risk, warnings, scam context)
   Direct. No softening. No fear-mongering.
   "Yes, you can lose money investing. That's true.
    Here's what makes it manageable."

4. MILESTONE TONE (achievements)
   Understated. Matter-of-fact. Earned, not awarded.
   "CDS account opened. That's the hardest part done."
```

## Copywriting Patterns — Before/After

```
EMPTY STATES:
  ❌ "Nothing to see here yet! Start your journey! 🚀"
  ✅ "You haven't started any lessons yet.
      Lesson 1 covers what the NSE is — 15 minutes."

LESSON START:
  ❌ "Welcome to Lesson 4! Let's learn about candlesticks! 🕯️"
  ✅ "Lesson 4: Reading a stock chart
      By the end, you'll know what a stock chart actually tells you —
      and what it doesn't."

QUIZ PASS:
  ❌ "Amazing! You're a star investor! 🎉 Keep it up!"
  ✅ "Lesson complete.
      You understand what a CDS account is and how to open one.
      Next: reading a stock listing."

QUIZ FAIL:
  ❌ "So close! Don't give up! Try again soon! 💪"
  ✅ "3 out of 5. You need 4 to continue.
      Mwalimu has explanations for what you missed.
      Retake available in 10 minutes."

STREAK/ACTIVITY:
  ❌ "You're on a 0-day streak! Don't break the chain!"
  ✅ [Don't show a streak at all — it optimizes for the wrong thing]

MWALIMU WHEN CONFUSED:
  ❌ "Great question! I'd be happy to help you understand!"
  ✅ "That's a real confusion. Here's the distinction:..."

ERROR STATE (network):
  ❌ "Oops! Something went wrong 😅 Try again?"
  ✅ "Couldn't save your progress. Your answers are recorded locally.
      Reload when you have connection."

ONBOARDING WELCOME:
  ❌ "Welcome to Vuka! Your investing journey starts NOW! 🚀"
  ✅ "Welcome, [Name].
      This course covers what you need to make your first NSE investment.
      It takes most people 2–3 weeks. You go at your own pace."
```

## Error & Edge State Copy

```typescript
// lib/copy/errors.ts

export const ERROR_COPY = {
  'auth/invalid-credentials':
    'That email and password combination isn\'t recognised.',
  'auth/email-already-used':
    'An account with that email already exists. Sign in instead.',
  'network/offline':
    'No internet connection. Your work is saved — it will sync when you\'re back online.',
  'quiz/cooldown':
    'You can retake this quiz in [N] minutes. Use the time to review what you missed.',
  'mwalimu/rate-limit':
    'You\'ve reached today\'s message limit. Mwalimu is available again tomorrow.',
  'lesson/locked':
    'Complete the previous lesson first. The course builds on itself.',
  'generic':
    'Something didn\'t work. Reload the page and try again.',
};
```

---

# 16. EMOTIONAL DESIGN SYSTEM

## Design Psychology Principles — Applied

**1. Reduce intimidation before the user even reads content.**
- Max reading width: 65 characters (md:max-w-2xl — ~60 chars per line)
- Large line height in lessons: 1.9
- Generous vertical spacing between content blocks: space-8 (32px)
- The layout itself signals: "Take your time. This is for reading."

**2. Make the path feel finite.**
- Always show "6 lessons total" — never hide scope
- Progress is "2 of 6 skills" — not percentages (percentages feel abstract)
- Every locked lesson is visible — not hidden (hidden locks feel manipulative)

**3. Acknowledge difficulty without amplifying anxiety.**
- Risk warnings are stated plainly, not buried
- Wrong quiz answers receive calm explanation, not "oh no!" language
- The 10-minute cooldown after failing is framed as "time to review", not punishment

**4. Celebrate real-world actions over in-app engagement.**
- Milestone "First NSE investment made" > any app badge
- No streak counter — streaks optimize for opening the app, not learning
- No XP leaderboard — comparing to others creates anxiety, not motivation

**5. Trust through transparency.**
- Every lesson states its length upfront
- Quiz requirements stated before the quiz starts
- Mwalimu footer always says: "For investment decisions, speak to a licensed broker"

## Loading States — Design

```tsx
// All loading states use skeleton, not spinners
// Spinners create anxiety — they feel infinite
// Skeletons communicate: "there's content here, it's loading"

// Lesson skeleton:
<div className="space-y-4 animate-pulse">
  <div className="h-3 bg-[--bg-overlay] rounded w-1/4" />    {/* mono label */}
  <div className="h-8 bg-[--bg-overlay] rounded w-3/4" />    {/* title */}
  <div className="h-3 bg-[--bg-overlay] rounded w-1/3" />    {/* subtitle */}
  <div className="space-y-2 mt-8">
    {[1,2,3,4].map(i => (
      <div key={i} className="h-4 bg-[--bg-overlay] rounded" style={{ width: `${85 - i*5}%` }} />
    ))}
  </div>
</div>

// Mwalimu typing indicator:
<div className="flex gap-1.5 items-center px-4 py-3">
  {[0, 0.2, 0.4].map((delay, i) => (
    <div
      key={i}
      className="w-1.5 h-1.5 rounded-full bg-[--text-tertiary]"
      style={{ animation: `bounce 1.2s ${delay}s infinite` }}
    />
  ))}
</div>
```

---

# 17. MOBILE EXPERIENCE

## Mobile-First Principles

The primary Vuka user is on a smartphone. Probably Safaricom network. Possibly on a slower connection. Design for this, not for a MacBook Pro.

## Bottom Navigation — Mobile

```tsx
// components/layout/BottomNav.tsx
// Replaces sidebar on mobile (md:hidden on sidebar, hidden md:flex on bottom nav)

const ITEMS = [
  { href: '/dashboard', label: 'Home',    icon: HomeIcon },
  { href: '/learn',     label: 'Course',  icon: BookOpenIcon },
  { href: '/mwalimu',  label: 'Mwalimu', icon: ChatBubbleIcon },
  { href: '/profile',  label: 'Profile', icon: UserIcon },
];

// Style: fixed bottom-0, h-16, bg-[--bg-secondary]/95 backdrop-blur
// Border-top: 1px solid --border-subtle
// Icons: 22px, active: --accent-green, inactive: --text-tertiary
// Labels: 10px, hidden if icon + label too cramped (icon-only on small screens)
```

## Lesson — Mobile UX Adjustments

```
- Lesson sidebar: REMOVED on mobile → replaced by sticky lesson header
  that shows: "Lesson 3 of 6 · Reading a stock listing"
  
- Section progress: floating pill bottom-center showing current heading
  "Currently reading: 'What the price column means'"
  
- ConceptCheckpoint: full-width, larger tap targets (min 48px height)

- Mwalimu panel: full-screen on mobile (not 45vh)
  Swipe down to dismiss (Framer Motion drag gesture)

- Quiz options: full-width buttons, min 56px tap target
  One question per screen (paginated), not all at once

- Text sizes:
  Hero h1: 32px (not 52px)
  Section h2: 24px (not 36px)
  Body: 15px (same)
  Lesson content: 15px (same — don't reduce, readability matters)
```

## Performance on Mobile — Network Considerations

```
1. MDX content: pre-rendered at build time (SSG where possible)
   Lesson content doesn't change — no reason to SSR each request

2. Images: none in Phase 1 (no illustrations, no avatars)
   When added: next/image with webp, lazy load, explicit dimensions

3. Fonts: preconnect + font-display: swap
   Load Instrument Serif (headings only) + Inter (everything else)
   Don't load JetBrains Mono separately — only mono labels, use system mono fallback if slow

4. Mwalimu API: streaming response
   User sees first words appear immediately, not wait for full response

5. Quiz submission: optimistic UI
   Show results immediately, sync to server in background
   If sync fails: retry with exponential backoff, show error only if 3 retries fail
```

---

# 18. PERFORMANCE OPTIMIZATIONS

## Next.js 15 Specific

```typescript
// Lesson pages: static generation with ISR
// app/learn/[moduleId]/[lessonId]/page.tsx

export async function generateStaticParams() {
  const supabase = createServerClient();
  const { data: lessons } = await supabase
    .from('lessons')
    .select('id, module_id')
    .eq('is_published', true);

  return lessons?.map(l => ({
    moduleId: l.module_id,
    lessonId: l.id,
  })) ?? [];
}

export const revalidate = 3600; // revalidate lesson content hourly

// Dashboard: no caching — always fresh user data
export const dynamic = 'force-dynamic'; // app/(app)/dashboard/page.tsx
```

## Database Query Optimization

```typescript
// Fetch everything needed for dashboard in 2 parallel queries, not 6 sequential

const [progressData, profileData] = await Promise.all([
  supabase.from('user_lesson_progress')
    .select('lesson_id, status, completed_at, last_section')
    .eq('user_id', userId),
  supabase.from('profiles')
    .select('full_name, onboarding_done')
    .eq('id', userId)
    .single(),
]);

// Never do N+1 queries (fetching skills per lesson in a loop)
// Always: fetch all skills for user → compute status in TypeScript
```

---

# 19. MVP SCOPE — PHASE 1

## Exactly what to build. Nothing more.

```
PAGES:
  / (homepage)
  /login
  /signup
  /onboarding (3 steps)
  /dashboard
  /learn (course overview)
  /learn/nse-foundations/[lessonId]
  /learn/nse-foundations/[lessonId]/quiz
  /mwalimu (open chat — Lesson Companion mode on lesson pages)
  /profile
  /milestones

FEATURES:
  ✓ Auth (Supabase email/password)
  ✓ 6 published lessons (NSE Foundations module only)
  ✓ Inline concept checkpoints (ungraded)
  ✓ Quiz system (5 questions, 80% pass, 10min cooldown)
  ✓ Lesson progress persistence (Supabase, NOT localStorage)
  ✓ Skill tree UI (6 skills, understood/needs_review/locked)
  ✓ 5 auto-milestones + 2 self-report milestones
  ✓ Mwalimu in Lesson Companion mode
  ✓ Mwalimu in Concept Checker mode (auto on wrong quiz answer)
  ✓ Secure API route for AI (key never on client)
  ✓ Rate limiting (30 messages/day)
  ✓ Next Action Card on dashboard
  ✓ Trust-first homepage (scam inoculation section)
  ✓ Mobile-responsive with bottom nav
  ✓ Analytics events (lesson_started, lesson_completed, quiz_passed, quiz_failed)

DATABASE TABLES NEEDED:
  ✓ profiles
  ✓ modules (1 row)
  ✓ lessons (6 rows)
  ✓ quiz_questions (30 rows — 5 per lesson)
  ✓ user_lesson_progress
  ✓ user_quiz_attempts
  ✓ user_confused_concepts
  ✓ user_skills
  ✓ user_milestones
  ✓ ai_sessions
  ✓ events
```

## Realistic Timeline — Solo Developer

```
Week 1–2:   Supabase setup, auth, profiles, database schema
Week 3–4:   Homepage rebuild (design system + all sections)
Week 5–7:   Content writing — 6 deep lessons + 30 quiz questions
            (This takes longer than code. Don't underestimate it.)
Week 8–9:   Lesson page + MDX component system
Week 10:    Quiz system + progression engine
Week 11:    Mwalimu integration (both modes)
Week 12:    Dashboard + skill tree + milestones
Week 13:    Mobile polish + performance
Week 14:    Beta with 10 real users — iterate based on actual confusion
Week 15–16: Fixes + launch
```

---

# 20. PHASE 2 & 3 ROADMAP

## Phase 2 (Months 4–8)

```
CONTENT:
  → Module 2: Investor Mindset (6 lessons)
    - Risk tolerance
    - Long-term vs short-term thinking
    - Diversification fundamentals
    - Cost averaging
    - When prices fall (behavioral finance, Kenya 2008 context)
    - Recognising investment fraud (dedicated scam lesson)
  
FEATURES:
  → Mwalimu Progress Advisor mode
     Weekly dashboard advisory card, generated server-side nightly
     Based on: lesson progress, confusion flags, days since last activity
  
  → Swahili content toggle
     Not a full translation — key term definitions in Swahili
     Mwalimu responds in Kiswahili if preferred_lang = 'sw'
  
  → Lesson bookmarks + notes
     Simple text notes per lesson, stored in Supabase
     Not shared, not AI-processed — just for the user
  
  → Weekly progress email
     Plain text email: "Here's where you are. Here's what's next."
     No marketing. No urgency. Just honest status.
  
  → Analytics dashboard (for yourself, not users)
     Which lessons have highest drop-off?
     Which quiz questions have lowest pass rates?
     What concepts flag confusion most?
     This data drives content improvements.

WHAT NOT TO BUILD IN PHASE 2:
  ✗ Mobile app (optimize mobile web further instead)
  ✗ Community/forum features
  ✗ Broker integrations
  ✗ Live market data
  ✗ Portfolio tracker
```

## Phase 3 (Months 9–18)

```
CONTENT:
  → Module 3: Portfolio Craft (6 lessons)
  → Short-form "Context" posts: 2-min reads on NSE news events
    (not financial advice — contextual education: "Here's what this means")

FEATURES:
  → NSE Paper Portfolio Simulator
     Virtual KES 50,000 — real NSE prices via NSE API or scraping
     Not gamified — no leaderboard, no "wins"
     Purpose: practice reading statements, watching price movements
     with real companies the user recognises (Safaricom, Equity, EABL)
  
  → Broker Readiness Certificate
     After completing all 3 modules: a simple PDF-exportable summary
     "Wanjiku Mwangi has completed the Vuka NSE Foundations course.
      This is not a financial qualification. It is a record of learning."
     Partnered brokers recognise it as a warm lead signal.
  
  → Cohort Learning (small groups)
     8–10 users going through the curriculum in the same week
     Simple: shared dashboard, one check-in per week via Mwalimu
     No forum — just structured accountability
  
  → B2B: Corporate & SACCO version
     Financial wellness module for employers / SACCOs
     White-labeled or co-branded
     Revenue model: per-seat licensing
  
  → Mobile App (React Native)
     Only when mobile web usage patterns are fully understood
     Do not build a native app before you know what mobile users need most
```

---

# 21. EXACT FEATURES TO REMOVE

```
REMOVE NOW — no debate:

1. XP from all user-facing UI
   Keep internally for analytics. Never show to users.
   It trains wrong behavior.

2. Leaderboard
   Entirely. Permanently.
   Comparing to other investors creates anxiety and wrong incentives.
   Users should compare to themselves (previous lesson scores, skill growth).

3. Crypto & DeFi module
   Non-negotiable. Your audience associates this with scams.
   Including it undermines every trust signal you build elsewhere.

4. "12,000+ Active learners" stat (or any unverifiable social proof)
   If you have verified numbers: use them.
   If you don't: the Trust Bar section with honest statements is more powerful.

5. Activity heatmap (GitHub-style grid)
   Vanity metric. Shows "days logged in" not "understanding gained."
   Replace with skill tree progress.

6. Pulse dot animation on "Now live" badge
   Feels like a crypto presale.

7. Leaderboard on dashboard
   Actively harmful for a trust-dependent product.

8. The word "free" in CTAs as a persuasion hook
   "Start learning free →" feels like a dark pattern.
   "Begin the course" is honest and equally effective.

9. localStorage as primary persistence
   Not a feature — a bug that will kill retention.

10. AI key on client
    Not a feature — a security hole. Fix before any real users.
```

---

# 22. EXACT FEATURES TO DELAY

```
DELAY TO PHASE 2:
  - Swahili content toggle
    Write excellent English content first. Translate when you have real Swahili speakers reviewing it.
  
  - Progress Advisor (Mwalimu Mode 3)
    Needs real user data to generate useful advice. Build after 100+ users have lesson history.
  
  - Email digest
    Need content and real completion data first.
  
  - Lesson bookmarks / notes
    Nice to have — not blocking core value delivery.

DELAY TO PHASE 3:
  - NSE Paper Portfolio Simulator
    Complex to build, needs real price data, and users need to finish the course first.
  
  - Community features (forum, cohorts)
    Community requires critical mass. Build product first.
  
  - Broker integration / referrals
    Revenue model — don't introduce commission relationships until trust is established.
    A broker referral link on lesson 2 destroys credibility.
  
  - Mobile native app
    Optimize mobile web to the point that the web app feels native. Then assess.
  
  - Multi-country expansion (Uganda, Ghana, Tanzania)
    Different regulatory contexts, different brokers, different content.
    Kenya first. Complete it before expanding.
  
  - Live market data / stock screener
    Not an education feature. Wrong product phase.
```

---

# 23. EXACT FEATURES TO PRIORITIZE

```
Build in this order. Do not skip ahead.

CRITICAL PATH — must exist before launch:
  1. Supabase auth + profile + onboarding
  2. 6 deep, accurate NSE Foundation lessons (content quality is everything)
  3. Quiz system with proper fail states and cooldown
  4. Lesson progress persistence to Supabase (kill localStorage)
  5. Secure Mwalimu API route (key server-side only)
  6. Mwalimu Lesson Companion mode
  7. Mwalimu Concept Checker mode (auto-triggered on wrong quiz answer)
  8. Skill tree UI replacing XP/badges
  9. Next Action Card on dashboard
  10. Trust-first homepage with scam inoculation section

HIGH PRIORITY — launch quality:
  11. Mobile bottom nav + responsive lesson layout
  12. Inline ConceptCheckpoint components in lessons
  13. 5 auto-milestones + 2 self-report milestones
  14. Analytics event logging (your own data)
  15. Rate limiting on Mwalimu API

DIFFERENTIATION FEATURES — what makes Vuka Vuka:
  16. "What Vuka Is Not" homepage section
  17. Risk Checkpoint in onboarding (the introspective question)
  18. ⚠ "Needs Review" skill status (confused concepts tracked and surfaced)
  19. Lesson confirmation gate ("I've read this lesson" before quiz)
  20. Honest quiz fail copy + cooldown + review links
```

---

# 24. IMPLEMENTATION PLAN

## The Right Order

```
STEP 1 — STOP building features. (Day 1)
  Audit what exists. Remove XP from UI. Remove leaderboard.
  Move AI key to server. This takes one day.

STEP 2 — DESIGN SYSTEM. (Days 2–5)
  Implement new color tokens in globals.css.
  Replace current green with --accent-green (#238636).
  Update all button/card/input components.
  Test on mobile. Everything else builds on this.

STEP 3 — SUPABASE SCHEMA. (Days 6–10)
  Run the full schema SQL.
  Set up RLS policies.
  Create Supabase client/server setup.
  Write the auth middleware.
  Test: signup → profile → onboarding → dashboard (empty state).

STEP 4 — CONTENT. (Days 11–28 — this is the longest step)
  Write 6 lessons. Full depth. 600–900 words each.
  Write 5 quiz questions per lesson. Test them on a real beginner.
  Write concept checkpoint questions (2–3 per lesson).
  Write lesson summaries.
  Identify key terms for Mwalimu context injection.
  Write content_summary (500-word summaries) for each lesson.
  This step cannot be rushed. Bad content kills the product.

STEP 5 — LESSON EXPERIENCE. (Days 29–38)
  MDX component system (TermCard, WarningBlock, etc.)
  Lesson page layout (server component + client Mwalimu panel)
  Lesson progress tracking (time spent, last section)
  ConceptCheckpoint component with confused concept logging

STEP 6 — QUIZ SYSTEM. (Days 39–44)
  Quiz state machine (answering → submitted → pass/fail)
  Wrong answer logging to user_confused_concepts
  10-minute cooldown with countdown
  Progression engine (processLessonCompletion)

STEP 7 — MWALIMU. (Days 45–52)
  Secure API route with streaming
  Lesson Companion panel (slide-up with IntersectionObserver context)
  Concept Checker integration into quiz results
  buildMwalimuPrompt with full context injection

STEP 8 — DASHBOARD. (Days 53–58)
  NextActionCard with server-computed action
  SkillTree component
  MilestoneList component
  Dashboard data fetching (parallel queries)

STEP 9 — HOMEPAGE. (Days 59–64)
  Trust-first hero
  Trust bar
  Curriculum path
  "What Vuka Is Not" section
  FAQ accordion
  Mobile responsiveness

STEP 10 — BETA. (Days 65–80)
  Get 10–20 real Kenyan users (not friends who'll be nice).
  Watch them use the product (screen share, Nairobi, real network).
  Observe: where do they stop reading? which quiz questions are unfair?
            does Mwalimu's context make sense to them?
            do they trust the homepage?
  Iterate on content before marketing.

STEP 11 — LAUNCH. (Day 81+)
  Only after beta feedback is addressed.
  Don't launch to acquire users you'll immediately lose to bad content.
```

## The Honest Assessment

The gap between your current product and a trusted NSE education platform is:
- **60% content quality** — the lessons must be genuinely educational
- **25% trust signals** — homepage, honesty, no scam aesthetics
- **10% AI context** — Mwalimu being curriculum-aware, not generic
- **5% everything else** — design polish, mobile, performance

Invest your time in that order.
