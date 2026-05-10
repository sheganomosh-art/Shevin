# Vuka — Ruthless Simplification & MVP Execution Plan
## The document that kills every good idea that isn't the right idea yet.

---

# 1. WHAT IS CURRENTLY OVERENGINEERED

Verdict on every system built so far:

## Mwalimu — 4 modes → OVERENGINEERED
**Current:** Lesson Companion, Concept Checker, Progress Advisor, Open Chat — each with separate UI, separate context injection, separate database patterns, separate trigger logic.
**Reality:** You haven't shipped a single real lesson yet. You're building a 4-mode AI system for content that doesn't exist.
**Verdict:** Ship 1 mode. The other 3 are Phase 2 hypotheses.

## Progression Engine — OVERENGINEERED
**Current:** `processLessonCompletion()` checks skill status, confusion flags, milestone conditions, `needs_review` states, parallel database queries, event logging, cache revalidation.
**Reality:** You have 0 users. This complexity serves nobody.
**Verdict:** Mark lesson complete. Unlock next lesson. That's it.

## Skill Tree with "⚠ Needs Review" State — SMART-SOUNDING, LOW PAYOFF
**Current:** A skill can be `locked | in_progress | understood | needs_review` — the last state triggered by cross-referencing quiz pass rate against confusion flag count per lesson.
**Reality:** Users won't understand this distinction. They'll see a yellow icon and not know what it means.
**Verdict:** Two states only: `locked` and `done`. Add `needs_review` in Phase 2 when you have data proving users respond to it.

## Analytics Infrastructure — TOO EARLY
**Current:** `events` table with 12+ event types, indexes on 3 columns, server-side ingestion route, session tracking.
**Reality:** With < 100 users, you don't need an analytics pipeline. You need to talk to users directly.
**Verdict:** Log 3 events only: `lesson_completed`, `quiz_failed`, `signup_completed`. Everything else is noise until you have scale.

## ai_explanations Cache Table — PREMATURE OPTIMIZATION
**Current:** Pre-generates and caches AI explanations for wrong quiz answers to avoid re-generating them.
**Reality:** With < 1000 users, the cost of re-generation is negligible. The complexity of managing this cache is not.
**Verdict:** Remove. Call the API directly. Cache when you have evidence it's needed.

## `content_summary` Column on Lessons — INDIRECT COMPLEXITY
**Current:** A 500-word AI-readable summary of each lesson stored separately for Mwalimu context injection.
**Reality:** You haven't written the lesson content yet. You're building infrastructure to summarize content that doesn't exist.
**Verdict:** Inject the first 1500 characters of lesson content directly. Write the summary field when you have all 6 lessons complete.

## `section_headings` Array + IntersectionObserver Context — OVERENGINEERED
**Current:** Tracks which H2/H3 the user is currently reading via IntersectionObserver, injects that into Mwalimu's context.
**Reality:** Sophisticated. Fragile. Low user-visible payoff. Hard to debug.
**Verdict:** Delay. Mwalimu knows which lesson the user is in. That's enough for Phase 1.

## Risk Checkpoint as Onboarding Step — DELAYS TIME-TO-VALUE
**Current:** An introspective question ("What happens if the price drops 50%?") in onboarding before the user has read anything.
**Reality:** The user hasn't learned anything yet. The checkpoint is asking them to introspect on knowledge they don't have. It will confuse beginners and feel like a test before they're ready.
**Verdict:** Move this into Lesson 4 (price movements), where it belongs contextually.

## Reflection Prompt After Quiz — LOW USAGE GUARANTEE
**Current:** After passing a quiz, user gets a text box: "In your own words, tell a friend what a CDS account is."
**Reality:** 95% of users will skip this. The 5% who don't will write one sentence. You'll never read the responses at Phase 1 scale.
**Verdict:** Remove from MVP. Add in Phase 2 if you have evidence users engage with it.

## Lesson Confirmation Gate ("I've read this lesson") — FRICTION WITHOUT REWARD
**Current:** User must click "I've read this lesson" before the quiz unlocks.
**Reality:** Adds a click. Doesn't increase comprehension. Users will click it immediately after the lesson loads.
**Verdict:** Remove. Gate on scroll depth instead (80% scroll = quiz unlocked). One line of JavaScript, zero user friction.

## Multiple Card Variants — UI COMPLEXITY
**Current:** `base | interactive | elevated | warning` card variants in component system.
**Reality:** You need 2: a standard card and an interactive card. The rest are premature.
**Verdict:** Build 2 card variants. Add others when you have a specific use case that demands them.

## 30-Question Quiz Bank (5 per lesson × 6 lessons) — NOT YET CONTENT
**Current:** Planned in schema.
**Reality:** Writing 30 good quiz questions for content that doesn't exist yet is backwards. The questions emerge from the content.
**Verdict:** Write lesson first. Quiz questions second. Always.

---

# 2. WHAT TO REMOVE IMMEDIATELY

These are not "delay" items. Delete them.

```
REMOVE FROM CODEBASE NOW:

1. XP number from ALL user-facing UI
   Keep the column if you want it for internal analytics.
   Never show it to users. Not in small text. Not anywhere.

2. Leaderboard component + table
   Gone. Not delayed. Removed.

3. ai_explanations cache table
   Premature optimization. Delete from schema.

4. section_headings column + IntersectionObserver tracking logic
   Delete from schema. Delete from lesson progress tracking.

5. Reflection prompt component
   Delete from quiz results flow.

6. "I've read this lesson" confirmation button
   Replace with scroll-depth check (one line, no UI element).

7. Crypto & DeFi module metadata
   Not a delay. Remove from modules.ts entirely.
   If it's in the database, delete the row.

8. user_confused_concepts.resolved_at column
   One more column maintaining state that will never be queried in Phase 1.
   Keep the table. Remove resolved_at. Keep occurrences and resolved boolean.

9. Skill status 'needs_review'
   Remove from TypeScript types and DB check constraint.
   Two states: 'locked' and 'understood'. That's it.

10. Progress Advisor mode from Mwalimu
    Not built yet — don't build it. It requires historical data you don't have.

11. generateAdvisorMessage.ts
    If this file exists or is planned, delete it.

12. "Now live across East Africa" pulse-dot badge
    Delete from homepage hero. Replace with the eyebrow text described in Section 3.

13. All three fake testimonial avatars
    Delete from homepage. Replace with one real quote or nothing at all.

14. Activity heatmap (28-day grid)
    Remove from profile page. Not educational. Not actionable.
```

---

# 3. WHAT TO DELAY UNTIL PHASE 2

These are real features. They're just wrong for right now.

```
DELAY — build after 100 real users have completed at least 2 lessons:

1. Mwalimu Progress Advisor mode
   Requires: historical lesson data, confusion patterns, usage trends.
   You don't have any of that yet.

2. Swahili content toggle
   Requires: a fluent Swahili speaker reviewing every translation.
   Ship excellent English first. Don't ship mediocre Swahili.

3. Lesson bookmarks + notes
   Nice feature. Not blocking core value. Build when users ask for it.

4. Weekly progress email
   Requires: user data worth emailing about.
   Phase 2, after users have real lesson history.

5. Self-report milestone: "Broker shortlisted"
   Complex milestone UI, self-report flow, helper text.
   Just link to nse.co.ke/brokers in lesson 2. Same outcome, zero code.

6. "Needs Review" skill state
   Two-state skill tree ships now. Three-state when you have evidence users understand it.

7. Pre-generated Mwalimu concept explanations (ai_explanations table)
   API calls on demand. Cache when you have > 500 daily active users.

8. Open Chat mode (/mwalimu page)
   Lesson Companion mode ships first. Open Chat is Phase 2.
   Reason: Open Chat is unlimited scope. Lesson Companion is bounded.
   Bounded is cheaper, more focused, and easier to evaluate.

9. Module 2 (Investor Mindset)
   Finish Module 1 content completely before planning Module 2.

10. Quiz question randomization
    Ship questions in fixed order. Randomize when you have evidence of cheating.

11. Corporate / SACCO version
    Phase 3. Don't think about it now.

12. NSE Paper Portfolio Simulator
    Phase 3. Requires real price data API, significant complexity.

13. Broker Readiness Certificate
    Phase 3. Requires broker relationships you don't have yet.
```

---

# 4. WHAT THE TRUE MVP LOOKS LIKE

## One sentence
A website where a Kenyan beginner can read 6 lessons about the NSE, answer quiz questions to confirm they understood each one, and ask an AI tutor questions if they're confused — with their progress saved so they can pick up where they left off.

## Exact pages (9 total — not more)

```
/                   Homepage
/signup             Signup (email + name + country)
/login              Login
/onboarding         2 steps: goal + experience
/dashboard          One screen — next lesson + progress list
/learn/[lessonId]   Lesson content + quiz (same page, two states)
/profile            Completion status + milestones (read-only)
/mwalimu            NOT in MVP — lesson companion only, panel on lesson page
```

That's 7 routes. Not 15. Not 25.

## Exact database tables (7 total)

```sql
profiles              -- who the user is
lessons               -- the 6 lesson records (content as MDX in files, not DB)
user_lesson_progress  -- started/completed per lesson
user_quiz_attempts    -- score, pass/fail, timestamp
user_confused_concepts -- concept tags from wrong answers (feeds Mwalimu only)
ai_sessions           -- conversation history for Mwalimu
events                -- 3 event types only
```

That's 7 tables. The `modules` table is unnecessary at 1 module — hardcode it.
The `quiz_questions` table is unnecessary — store questions in TypeScript constants per lesson.
The `user_skills` table is unnecessary — compute skill status from `user_lesson_progress` at query time.
The `user_milestones` table can wait — compute milestone status from lesson progress.

## Exact flows

```
SIGNUP FLOW:
  /signup → /onboarding → /dashboard
  2 form steps. Create profile. Done.

ONBOARDING:
  Step 1: "What's your main goal?" (4 radio options)
  Step 2: "How much do you know?" (3 radio options)
  No risk checkpoint. No third step.
  Redirect to /dashboard.

LESSON FLOW:
  /dashboard → click "Start Lesson" → /learn/[lessonId]
  
  On lesson page:
    State 1: READING — lesson content, Mwalimu button
    State 2: QUIZ — appears after 80% scroll, or "I'm ready" button
    State 3: RESULT — pass → next lesson link / fail → review note + retry timer
  
  One URL. Three visual states. No route changes mid-lesson.
  Reason: no loading between content and quiz. Feels seamless.

MWALIMU FLOW (on lesson page):
  Click "Ask Mwalimu" → slide-up panel
  Ask question → get answer
  Close panel → continue lesson
  No memory beyond current session (Phase 1)
  No context beyond: lesson title + key terms + user's lesson count
```

## Exact Mwalimu behavior in MVP

```
Opens with: "You're studying [lesson title]. What would you like me to explain?"
Knows: lesson title, lesson key terms, user name, lessons completed
Doesn't know: quiz results, confused concepts, previous conversations
Responds in: under 150 words
Daily limit: 20 messages (hard cap — returns friendly message after)
Session: cleared when panel closes (no DB write in MVP)
```

This is the smallest Mwalimu that still feels useful and personal. Build this first.

## What the dashboard looks like in MVP

```
[DASHBOARD — one column, max-w-2xl, centered]

"Good morning, [Name]."
[small text: "NSE Foundations course"]

[NEXT ACTION CARD — full width]
  Big, clear, single action.
  "Start Lesson 1: What is the NSE?" [button]
  — or —
  "Continue Lesson 3: Reading a stock listing" [button]
  — or —
  "All 6 lessons complete." [with milestones summary]

[LESSON LIST — simple, clean]
  1. What is the NSE?           ✓ Complete
  2. CDS accounts & brokers     → In progress
  3. Reading a stock listing    · Not started
  4. Understanding price moves  · Not started
  5. Your first buy order       · Not started
  6. After you invest           · Not started

That's it. No skill tree. No XP. No Mwalimu advisory.
Those are Phase 2 additions.
```

---

# 5. SIMPLIFIED MWALIMU ARCHITECTURE

## The minimum that still feels like a product

### Single mode: Lesson-aware chat

```typescript
// lib/ai/mwalimuSimple.ts
// ONE function. No modes. No complex context injection.

interface SimpleMwalimuContext {
  userName: string;
  lessonsCompleted: number;
  currentLesson: {
    title: string;
    keyTerms: string[];
    // First 1200 chars of lesson content — NOT a summary, just the raw text
    contentExcerpt: string;
  };
  messages: { role: 'user' | 'assistant'; content: string }[];
}

export function buildSimplePrompt(ctx: SimpleMwalimuContext): string {
  return `You are Mwalimu, a patient NSE investing tutor for Kenyan beginners.

The user is studying: "${ctx.currentLesson.title}"
Key concepts in this lesson: ${ctx.currentLesson.keyTerms.join(', ')}
Lessons completed so far: ${ctx.lessonsCompleted} of 6
User's name: ${ctx.userName}

Lesson excerpt (for context):
${ctx.currentLesson.contentExcerpt}

Rules:
- Answer only questions about investing and the NSE
- Keep responses under 150 words
- Use KES, not USD
- Reference Kenyan context (NSE, M-Pesa, CDS accounts, local brokers)
- Never recommend specific stocks or act as a financial advisor
- Never start with "Great question!"
- If asked about forex/crypto/get-rich schemes: acknowledge and redirect
- For investment decisions: "Speak to a licensed NSE broker (cdsc.co.ke)"`;
}
```

### What you save by removing complexity

```
REMOVED:                          SAVES:
4 Mwalimu modes                   → 3 mode detection logic trees
IntersectionObserver context      → 40 lines of JS + fragile state
Confused concept injection        → 1 DB query per message
Quiz result injection             → 1 DB query per message  
ai_sessions DB persistence        → 1 DB write per message (Phase 1)
ai_explanations cache             → Entire table + cache invalidation logic
Rate limit Redis setup            → Use simple Supabase count query
content_summary column            → Writing 6 summaries before content exists

Total: ~200 lines of code + 2 DB tables + 4 API queries per message
```

### Token budget — Phase 1

```
System prompt:          ~250 tokens  (simplified prompt above)
Lesson excerpt:         ~300 tokens  (first 1200 chars ≈ 300 tokens)
Conversation history:   ~200 tokens  (last 4 messages × 50 tokens avg)
User message:           ~30 tokens
────────────────────────────────
Input total:            ~780 tokens
Output (max):           ~150 tokens  (150 word limit)
────────────────────────────────
Cost per message (Sonnet 4): ~$0.004
At 20 messages/day/user:     ~$0.08/user/day
At 100 DAU:                  ~$8/day → ~$240/month

This is affordable. Phase 2 adds context intelligently when you're paying this.
```

### Rate limiting — simplest possible

```typescript
// No Redis. No complex window tracking.
// Just count today's sessions from Supabase.

async function checkRateLimit(userId: string, supabase: SupabaseClient): Promise<boolean> {
  const today = new Date().toISOString().split('T')[0]; // '2025-05-09'
  const { count } = await supabase
    .from('ai_sessions')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .gte('created_at', `${today}T00:00:00`);
  return (count ?? 0) < 20;
}
```

### API route — simplified

```typescript
// app/api/mwalimu/route.ts — Phase 1 version (~60 lines total)

export async function POST(req: NextRequest) {
  const supabase = createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const withinLimit = await checkRateLimit(user.id, supabase);
  if (!withinLimit) {
    return NextResponse.json(
      { error: "You've reached today's limit. Mwalimu is back tomorrow." },
      { status: 429 }
    );
  }

  const { messages, lessonId } = await req.json();

  // Fetch only what we need — 2 queries
  const [{ data: profile }, { data: lesson }] = await Promise.all([
    supabase.from('profiles').select('full_name').eq('id', user.id).single(),
    supabase.from('lessons').select('title, key_terms, content_excerpt').eq('id', lessonId).single(),
  ]);

  const { data: progressCount } = await supabase
    .from('user_lesson_progress')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('status', 'completed');

  const systemPrompt = buildSimplePrompt({
    userName: profile?.full_name ?? 'there',
    lessonsCompleted: progressCount ?? 0,
    currentLesson: {
      title: lesson?.title ?? '',
      keyTerms: lesson?.key_terms ?? [],
      contentExcerpt: lesson?.content_excerpt ?? '',
    },
    messages,
  });

  const response = await anthropic.messages.create({
    model: 'claude-haiku-4-5-20251001', // Haiku for Phase 1 — 5x cheaper than Sonnet
    max_tokens: 300,
    system: systemPrompt,
    messages: messages.slice(-6), // Last 3 exchanges only
  });

  const reply = response.content[0].type === 'text' ? response.content[0].text : '';

  // Log session async — don't await
  supabase.from('ai_sessions').insert({
    user_id: user.id,
    lesson_id: lessonId,
    mode: 'lesson_companion',
    messages: [...messages, { role: 'assistant', content: reply }],
  }).then(() => {}).catch(() => {});

  return NextResponse.json({ reply });
}
```

**Use Haiku for Phase 1.** It's 5× cheaper than Sonnet. For explaining NSE concepts to beginners, it's entirely adequate. Upgrade to Sonnet when you have evidence Haiku's responses are insufficient.

---

# 6. SIMPLIFIED BACKEND ARCHITECTURE

## The rule: no server infrastructure before you need it

```
PHASE 1 BACKEND STACK:
  Supabase (auth + database + storage)
  Next.js server actions (for form submissions)
  Next.js API route (for Mwalimu only — needs streaming)
  Anthropic API (Haiku model)
  Vercel (hosting)

That's it. No Redis. No queues. No edge functions.
No separate analytics service. No cron jobs.
No webhook handlers. No worker processes.
```

## Server action vs API route decision — simplified

```
SERVER ACTIONS (form-equivalent, no streaming):
  - completeLesson(lessonId, quizResults)
  - updateProfile(data)
  - reportMilestone(milestoneId)
  - startLesson(lessonId)

API ROUTES (streaming or external calls):
  - POST /api/mwalimu  (only one — AI needs streaming)

That's 4 server actions and 1 API route.
Not 10 API routes. Not a REST API. Not GraphQL.
```

## Data flow — simplified

```
User action → Server Action → Supabase → revalidatePath → UI updates

No Zustand in Phase 1 for server state.
Next.js server components fetch fresh data on each navigation.
Client state: only UI state (panel open/closed, current question index).
Zustand: remove it. useState for UI state. Server components for data.
```

---

# 7. SIMPLIFIED DATABASE SCHEMA

7 tables. Every column earns its place.

```sql
-- ══════════════════════════════════════
-- TABLE 1: profiles
-- ══════════════════════════════════════
CREATE TABLE profiles (
  id             UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  full_name      TEXT NOT NULL,
  country_code   TEXT NOT NULL DEFAULT 'KE',
  preferred_lang TEXT NOT NULL DEFAULT 'en' CHECK (preferred_lang IN ('en','sw')),
  investing_goal TEXT,         -- 'save' | 'grow' | 'income' | 'learn'
  experience     TEXT,         -- 'none' | 'some' | 'experienced'
  onboarding_done BOOLEAN NOT NULL DEFAULT FALSE,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own" ON profiles FOR ALL USING (auth.uid() = id);

-- Auto-create on signup
CREATE OR REPLACE FUNCTION handle_new_user() RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO profiles (id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', 'Learner'));
  RETURN NEW;
END;
$$;
CREATE TRIGGER on_signup AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();


-- ══════════════════════════════════════
-- TABLE 2: lessons (metadata only — content lives in MDX files)
-- ══════════════════════════════════════
CREATE TABLE lessons (
  id              TEXT PRIMARY KEY,        -- 'what-is-nse'
  title           TEXT NOT NULL,
  order_index     INT NOT NULL,
  estimated_mins  INT NOT NULL DEFAULT 20,
  key_terms       TEXT[] NOT NULL DEFAULT '{}',
  content_excerpt TEXT,                    -- First ~1200 chars for Mwalimu
  is_published    BOOLEAN NOT NULL DEFAULT FALSE
);

-- No RLS — read-only for all authenticated users
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "read_published" ON lessons FOR SELECT USING (is_published);


-- ══════════════════════════════════════
-- TABLE 3: user_lesson_progress
-- ══════════════════════════════════════
CREATE TABLE user_lesson_progress (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  lesson_id     TEXT NOT NULL REFERENCES lessons(id),
  status        TEXT NOT NULL DEFAULT 'in_progress'
                CHECK (status IN ('in_progress', 'completed')),
  started_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at  TIMESTAMPTZ,
  UNIQUE(user_id, lesson_id)
);

ALTER TABLE user_lesson_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own" ON user_lesson_progress FOR ALL USING (auth.uid() = user_id);


-- ══════════════════════════════════════
-- TABLE 4: user_quiz_attempts
-- ══════════════════════════════════════
CREATE TABLE user_quiz_attempts (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  lesson_id      TEXT NOT NULL REFERENCES lessons(id),
  score          INT NOT NULL,
  total          INT NOT NULL,
  passed         BOOLEAN NOT NULL,
  wrong_concepts TEXT[] NOT NULL DEFAULT '{}',  -- concept tags of wrong answers
  attempted_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE user_quiz_attempts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own" ON user_quiz_attempts FOR ALL USING (auth.uid() = user_id);


-- ══════════════════════════════════════
-- TABLE 5: user_confused_concepts
-- Simple — just track what concepts a user got wrong
-- ══════════════════════════════════════
CREATE TABLE user_confused_concepts (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  concept_tag  TEXT NOT NULL,
  lesson_id    TEXT NOT NULL,
  occurrences  INT NOT NULL DEFAULT 1,
  resolved     BOOLEAN NOT NULL DEFAULT FALSE,
  last_seen    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, concept_tag)
);

ALTER TABLE user_confused_concepts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own" ON user_confused_concepts FOR ALL USING (auth.uid() = user_id);


-- ══════════════════════════════════════
-- TABLE 6: ai_sessions
-- ══════════════════════════════════════
CREATE TABLE ai_sessions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  lesson_id   TEXT REFERENCES lessons(id),
  messages    JSONB NOT NULL DEFAULT '[]',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE ai_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own" ON ai_sessions FOR ALL USING (auth.uid() = user_id);


-- ══════════════════════════════════════
-- TABLE 7: events (3 event types only in Phase 1)
-- Written server-side with service role key
-- ══════════════════════════════════════
CREATE TABLE events (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID,
  event_type  TEXT NOT NULL,  -- 'signup_completed' | 'lesson_completed' | 'quiz_failed'
  properties  JSONB,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
-- No RLS — service role only writes this
CREATE INDEX events_type_created ON events (event_type, created_at DESC);
```

**Removed from previous schema:**
- `modules` table (1 module, hardcode it)
- `quiz_questions` table (store in TypeScript constants)
- `user_skills` table (compute from lesson progress)
- `user_milestones` table (compute from lesson progress + self-report in local state)
- `ai_explanations` table (call API directly)
- All `resolved_at`, `section_headings`, `content_summary`, `session_id` columns

**That's 10 fewer tables and ~25 fewer columns to maintain.**

---

# 8. MINIMAL NECESSARY ANALYTICS

## The only 3 events you need to understand your product in Phase 1

```typescript
// lib/analytics/track.ts
// Server-side only. Called from server actions.

type EventType = 
  | 'signup_completed'
  | 'lesson_completed'
  | 'quiz_failed';

export async function track(
  eventType: EventType,
  userId: string,
  properties: Record<string, unknown> = {}
) {
  const supabase = createServiceClient(); // service role key
  await supabase.from('events').insert({
    user_id: userId,
    event_type: eventType,
    properties,
  });
}

// Usage:
// signup_completed: { country_code, experience, investing_goal }
// lesson_completed: { lesson_id, lesson_title, attempt_number, score }
// quiz_failed:      { lesson_id, score, total, wrong_concepts }
```

## The 4 questions these 3 events answer

```
1. Are people signing up?          → COUNT signup_completed per day
2. Are they finishing lessons?     → COUNT lesson_completed / signup_completed
3. Where are they dropping off?    → MAX lesson_id per user where no lesson_completed after
4. Which lessons are hardest?      → quiz_failed grouped by lesson_id, avg score
```

That's all the analytics you need to improve the product in Phase 1.

Everything else — session duration, scroll depth, click heatmaps, funnel analysis — is noise until you have 500+ users and specific hypotheses to test.

---

# 9. CONTENT-FIRST WORKFLOW

## The right order: content before code

```
WRONG ORDER (what most builders do):
  1. Build all the components
  2. Build the database
  3. Build the AI system
  4. Write placeholder content
  5. Replace placeholder with real content
  6. Discover the real content breaks the components
  7. Rebuild components
  8. Ship 6 months later

RIGHT ORDER:
  1. Write lesson 1 in a Google Doc
  2. Get one Kenyan beginner to read it and tell you what's confusing
  3. Revise
  4. Write the quiz questions for lesson 1
  5. Build ONLY the components lesson 1 needs
  6. Ship lesson 1
  7. Write lesson 2
  8. Repeat
```

## Lesson authoring workflow

```
TOOL: Write in Notion or Google Docs first — not in MDX files.
WHY: Easier to share with a reviewer. Easier to edit. Easier to spot structure problems.

WHEN DRAFT IS DONE:
  → Get one real review from a Kenyan who's not a developer
  → Fix based on feedback
  → Convert to MDX manually
  → Add MDX components (TermCard, WarningBlock, etc.) where content calls for them
  → Test in browser on a real Android device
  → Publish (set is_published = true)

REVIEW CHECKLIST:
  □ Every term defined the first time it appears
  □ No sentence longer than 22 words
  □ Each paragraph: max 3 sentences
  □ KES used, not USD (unless explaining conversion)
  □ At least one Kenya-specific real example
  □ At least one WarningBlock (honest about risk)
  □ 5 quiz questions test understanding, not memory
  □ Concept checkpoints placed after the hardest section
  □ Lesson summary covers the 3 most important points
```

## MDX file structure — minimal

```
content/lessons/
  what-is-nse.mdx
  cds-accounts.mdx
  reading-listings.mdx
  price-movements.mdx
  first-order.mdx
  after-investing.mdx
```

No subdirectories. No module folders. 6 files. That's the entire curriculum.

## Quiz questions — stored in TypeScript, not database

```typescript
// content/quizzes/what-is-nse.ts

export const WHAT_IS_NSE_QUIZ = [
  {
    id: 'q1',
    question: 'Which government body regulates the NSE?',
    options: [
      { id: 'a', text: 'The Central Bank of Kenya' },
      { id: 'b', text: 'The Capital Markets Authority' },
      { id: 'c', text: 'The Ministry of Finance' },
      { id: 'd', text: 'The NSE Board of Directors' },
    ],
    correctId: 'b',
    explanation: 'The Capital Markets Authority (CMA) is the independent regulator established by the Capital Markets Act. The NSE operates under CMA oversight.',
    conceptTag: 'nse-regulation',
  },
  // ... 4 more
] as const;
```

Storing quiz questions in TypeScript means: no CMS admin panel needed, no Supabase query for questions, typed at compile time, version-controlled, fast to iterate on.

**Move to database when:** You have non-developer content writers who need to edit questions. That's a Phase 3 problem.

---

# 10. RECOMMENDED LESSON PIPELINE

## The 6 lessons — content priority and dependencies

```
LESSON 1: What is the NSE?
  Core question: "What is this thing I'm about to learn to invest in?"
  Must cover: NSE structure, CMA regulation, what listed companies are, who can invest
  Must NOT cover: how to invest yet — this lesson is orientation only
  Key terms: NSE, CMA, listed company, shares, stockbroker
  Real example: Safaricom — Kenya's most recognisable listed company
  WarningBlock: "The NSE is not a savings account. Values go up and down."
  KenyaContext: "The NSE was founded in 1954. It's one of Africa's oldest exchanges."
  Quiz focus: regulation, basic structure
  Estimated read time: 15 min
  Write first. It's the foundation.

LESSON 2: CDS accounts & licensed brokers
  Core question: "How do I actually own shares? Who do I buy them through?"
  Must cover: CDS accounts, CDSC, licensed brokers, what a legitimate broker looks like
  MUST INCLUDE: scam inoculation — WhatsApp groups, forex "bots", unlicensed operators
  Key terms: CDS account, CDSC, broker, KYC, transfer
  Real example: List of 3 actual licensed NSE brokers (Faida, AIB-AXYS, NIC Securities)
  WarningBlock: "If someone is offering to invest your money for you without being on the CDSC list, do not give them money."
  Quiz focus: what a CDS account does, how to verify a licensed broker
  Estimated read time: 20 min
  Write second. This is the most trust-critical lesson.

LESSON 3: Reading a stock listing
  Core question: "When I look at a stock on NSE.co.ke, what am I actually looking at?"
  Must cover: price, volume, 52-week high/low, market cap, P/E ratio basics
  Real example: Walk through Safaricom's actual listing page
  Do NOT explain charts yet — this lesson is about the listing, not the chart
  Key terms: market price, volume, 52-week range, market cap
  Estimated read time: 20 min

LESSON 4: Understanding price movements
  Core question: "Why does the price change? Should I care about daily movements?"
  Must cover: supply/demand basics, what causes price moves, long-term vs short-term
  MUST INCLUDE: Risk Checkpoint question (moved here from onboarding)
  WarningBlock: "Day-to-day price movements are mostly noise for a long-term investor."
  KenyaContext: Reference 2008 NSE crash — honest, educational, not fear-mongering
  Estimated read time: 20 min

LESSON 5: Your first buy order
  Core question: "What do I actually do to buy a share?"
  Must cover: opening a CDS account step-by-step, placing an order, settlement (T+3)
  Must cover: costs (broker commission, CDSC fee, exchange levy)
  Real example: "If you buy 100 Safaricom shares at KES 30, here's what you pay."
  Estimated read time: 25 min

LESSON 6: After you invest
  Core question: "I own shares now. What do I actually do?"
  Must cover: reading your CDS statement, what dividends are, what to do when prices fall
  MUST INCLUDE: "The right thing to do when prices fall is usually nothing."
  WarningBlock: "Panic-selling is the most common investing mistake in Kenya and globally."
  Close the loop: what they've now learned, what the CDSC helpline is
  Estimated read time: 20 min
```

## Content writing time estimate — honest

```
Each lesson: 3–5 hours of writing + 1–2 hours of revision after feedback
Quiz questions: 1 hour per lesson (5 questions, tested on a real beginner)
Total content: ~30–40 hours of focused writing

This is the most important 30–40 hours you will spend on this product.
Not the 30–40 hours building the AI system.
Not the 30–40 hours designing components.
The writing.
```
