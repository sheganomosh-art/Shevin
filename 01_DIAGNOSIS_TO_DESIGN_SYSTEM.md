# Vuka V2 — Full Product Rebuild
## Sections 1–4: Diagnosis · Repositioning · Homepage · Design System

---

# 1. PRODUCT DIAGNOSIS

## What's actually broken, in order of severity

### Severity 1 — Architectural (will kill the product)

**The AI key is exposed on the client.**
`app/ai-tutor/page.tsx` calls `https://api.anthropic.com/v1/messages` directly from the browser. Anyone opening DevTools can extract your API key, spend your credits, and you'd never know. This is not a "fix later" issue. Fix it before any real users arrive.

**State lives only in localStorage.**
Zustand with `persist` to localStorage means: clear cache = lose all progress. For an educational product where users take weeks to complete a curriculum, this is a trust-destroying bug. A user who loses 4 lessons of progress never comes back.

**There is no real backend.**
"Supabase backend" in the current code means auth, and nothing else. No lesson progress persistence. No quiz attempt records. No AI conversation history server-side. No analytics. The app is a frontend with a login screen bolted on.

### Severity 2 — Product (will limit growth)

**The content is 6 shallow lessons.**
Lesson 4 ("How to Read a Stock Chart") is 6 paragraphs and 4 quiz questions. A beginner who reads this does not know how to read a stock chart. They've been introduced to some terms. Introduction ≠ education. The content is the product. Shallow content = shallow product.

**The AI tutor has no context.**
The AI receives a generic system prompt and no information about what the user has or hasn't learned. It can't reference the user's quiz failures, confused concepts, or current lesson. It's indistinguishable from going to claude.ai and typing the same question.

**The progression system optimizes for the wrong thing.**
XP rewards time spent, not understanding. A user who clicks through all lessons without reading earns the same XP as one who studied carefully. This is Duolingo's known failure mode — high streaks, low retention, users who "finished" but learned nothing.

### Severity 3 — Trust (will prevent conversion)

**The homepage reads like a startup, not an educator.**
"Invest smarter, starting today" is the same headline as 400 fintech startups. "12,000+ Active learners" is unverifiable social proof. The "Now live across East Africa" badge feels like launch hype. A skeptical Kenyan who's been burned by investment schemes or seen friends lose money to forex scammers will close this tab in under 8 seconds.

**The color palette sends the wrong signal.**
`#00C896` (neon green) as a dominant accent reads as: crypto exchange, trading app, get-rich product. The pulse dot animation on "Now live across East Africa" reinforces this. Green is fine — but this specific green, this dominantly, signals the wrong category to your most important audience.

**The gamification undermines credibility.**
"Quiz master 🧠 at 200 XP" and "Vuka legend 👑 at 1000 XP" are childish achievement labels for a product asking adults to trust it with their financial education. It tells the user: this app treats investing like a game.

### Severity 4 — Scope (will dilute execution)

**Crypto & DeFi module.**
Your target user is a Kenyan beginner who fears scams. Including a crypto module says either "we think crypto is legitimate for you" or "we'll teach anything for engagement." Both destroy the focused trust you need to build.

**6 African markets, 47 lessons planned.**
You can't execute this well as a solo developer or small team. Broader scope = thinner content = less trustworthy product.

---

# 2. PRODUCT REPOSITIONING

## The only positioning that creates a defensible product

### From
"An investing education platform built for Africa"

### To
"The clearest path from knowing nothing to making your first NSE investment"

### Target user — be precise, not aspirational
**Primary:** 24–33 year old Nairobi professional. Employed formal sector (tech, finance, NGO, government). KES 50k–150k/month. Active M-Pesa user. Has a savings habit (M-Shwari, SACCO, fixed deposit). Has thought about investing for 6–18 months. Has not acted because: doesn't know where to start, distrusts brokers, has seen people lose money.

**Not:** University student (no income), crypto trader (wrong product), experienced investor (wrong level), diaspora (different market context).

### The one job to be done
> "Help a skeptical, intelligent Kenyan adult understand the NSE well enough to make their first investment with confidence, without being manipulated or overwhelmed."

### Competitive moat — what you can own that no one else does
1. **Scam inoculation as a feature.** Explicitly teaching users what to avoid, who to distrust, what legitimate brokers look like. No competitor does this. It directly addresses the #1 barrier to entry.
2. **NSE-specific depth.** Not "global investing education." Specifically: CDS accounts, CDSC, licensed Kenyan brokers, NSE listings, KES-denominated thinking, M-Pesa funding flows.
3. **Curriculum-aware AI.** An AI tutor that actually knows what you've learned and haven't. Not a chatbot.
4. **No financial product sold.** No affiliate broker links, no commission, no "open an account here." This is the most powerful trust signal in the Kenyan market.

### Positioning statement
> "Vuka is a free NSE investing course for Kenyan beginners. No products sold. No commissions. Just clear education."

---

# 3. HOMEPAGE REBUILD

## Design philosophy
The homepage has one job: convert a skeptical Kenyan adult who has seen too many investment scams into someone willing to give Vuka 20 minutes of their time. It does this through honesty, not persuasion.

## Navigation

```
[NAVBAR — max-w-5xl, mx-auto, px-6, h-14]

Left:  "Vuka" wordmark — Instrument Serif, 20px, color: --text-primary
       No dot, no icon, no animation. Just the name.

Right: "Sign in" — text link, --text-secondary, 14px
       That's it. No "Get started" button in the nav.
       The hero has one CTA. Don't compete with it.

Border-bottom: 1px solid --border-subtle
Backdrop: bg-primary/90 blur-sm (sticky)
```

Why no CTA in nav? The user hasn't decided to trust you yet. A nav CTA implies you expect them to sign up before reading. They won't.

## Section 1 — Trust-First Hero

```
[HERO — full width, py-24 md:py-32, max-w-4xl mx-auto, px-6]

[Layout: single column, centered, max-w-2xl]

EYEBROW (above h1):
  Text: "NSE Investing Education · Nairobi, Kenya"
  Style: 11px, font-mono, letter-spacing: 0.12em, --text-tertiary, uppercase
  No badge. No dot. No animation.

H1:
  Text: "Learn to invest on the
         Nairobi Stock Exchange."
  Style: Instrument Serif, 52px (mobile: 36px), line-height: 1.1
         --text-primary, font-weight: 400 (not bold — serifs earn weight through form)
  No gradient. No highlight. No accent color on any word.
  The headline is not a slogan. It's a clear statement of what this is.

SUBHEADING (mt-6):
  Text: "A free, structured course for Kenyan beginners.
         Six lessons. No jargon. No broker commissions.
         No financial products sold."
  Style: Inter, 18px (mobile: 16px), line-height: 1.75, --text-secondary, font-weight: 400
  This subhead does four things in three lines:
    1. "free" — removes financial barrier objection
    2. "six lessons" — sets expectation, reduces overwhelm
    3. "no jargon" — addresses intimidation
    4. "no broker commissions / no financial products sold" — addresses scam fear

CTA (mt-10):
  Button: "Begin the course"
  Style: bg-[--accent-green] text-white px-8 py-3.5 rounded-lg text-[15px] font-medium
         No arrow. No emoji. No exclamation mark.
         hover: bg-[--accent-green-dark] transition-colors duration-200
  
  Below button (mt-3):
  Text: "Free to start. No credit card. No broker account needed."
  Style: 13px, --text-tertiary, font-weight: 400

[NO HERO ILLUSTRATION]
Illustrations signal "startup." Editorial whitespace and clear typography
signal "authority." A screenshot of the actual lesson UI works better —
but only if the lesson UI is excellent. Otherwise: nothing.
```

## Section 2 — Trust Anchors (not social proof)

```
[TRUST BAR — border-y border-[--border-subtle], py-8, mt-16]
[Grid: 2x2 on mobile, 4-col on desktop]

Each item:
  Small icon (16px, --text-tertiary): shield, book, link-off, eye-off
  Text: 13px, --text-secondary, font-weight: 500

Items:
  🛡 "No financial products sold"
  📖 "Content reviewed by NSE-licensed professionals"
  ✂ "No affiliate broker links or commissions"
  👁 "Risks of investing explained clearly in every lesson"

Why this instead of "12,000 users" and "4.9 stars":
These four statements address the four actual fears of your user.
Unverified user counts create distrust when users sense exaggeration.
These four statements can be verified by reading the product.
```

## Section 3 — The Curriculum Path

```
[SECTION — py-20, max-w-3xl mx-auto, px-6]

LABEL: "The course" — 11px, mono, uppercase, tracked, --text-tertiary
H2: "Six lessons. One clear path." — Instrument Serif, 36px (mobile: 28px)
BODY (mt-4): "Each lesson builds directly on the last.
              You go at your own pace. Most learners finish in 2–3 weeks."
Style: 16px Inter, --text-secondary, max-w-lg

[TIMELINE — mt-12, vertical on mobile / visual path on desktop]

Each lesson item:
  Number: "01" — mono, 12px, --text-tertiary
  Title: 16px Inter medium, --text-primary
  Description: 13px Inter, --text-secondary, line-height: 1.6
  Time: "~20 min" — 12px mono, --text-tertiary
  Status indicator: filled circle (completed) / ring (current) / dot (upcoming)

Lessons:
  01  What is the NSE?
      What the Nairobi Securities Exchange is, who regulates it,
      and why it exists. No jargon.
      ~15 min

  02  Who can invest — and how
      CDS accounts, licensed brokers, what the CDSC is,
      and what a legitimate broker actually looks like.
      ~20 min
      [Note: "This lesson directly addresses investment scams."]

  03  Reading a stock listing
      How to read the information published for any NSE-listed company.
      What matters. What doesn't.
      ~25 min

  04  Understanding price movements
      Why prices move, what charts actually show,
      and why short-term movements are mostly noise.
      ~20 min

  05  Your first buy order
      The exact process of placing an order through a licensed broker.
      What to expect. What it costs.
      ~25 min

  06  After you invest
      Reading your account statement. What to do when prices fall.
      The discipline that separates successful investors.
      ~20 min

[Below timeline:]
  Text: "After completing these six lessons, you'll understand the NSE
         well enough to make an informed first investment.
         Not a guaranteed one. An informed one."
  Style: 15px Inter, --text-secondary, italic, max-w-md
  
This last line is important. It's honest. Honesty is the differentiator.
```

## Section 4 — "What Vuka Is Not" (Scam Inoculation)

```
[SECTION — bg-[--bg-secondary], py-20, full-bleed]
[Inner: max-w-3xl mx-auto px-6]

LABEL: "Important" — 11px mono uppercase tracked --text-tertiary
H2: "What this is not" — Instrument Serif, 36px

BODY: "Investment scams are common in Kenya. We think you should know
       exactly what Vuka is and isn't, before you spend any time here."
Style: 16px Inter, --text-secondary

[CARDS — grid gap-4, mt-10]
[3 cards, each: bg-[--bg-primary], border border-[--border-default], rounded-xl, p-6]

Card 1:
  Icon: ✗ (16px, --error, not animated)
  Title: "Not a broker" — 15px, font-medium, --text-primary
  Body: "Vuka doesn't sell shares, earn commission, or have a financial interest
         in what you invest in. We make nothing if you invest or don't."
  13px, --text-secondary, line-height: 1.6

Card 2:
  Icon: ✗
  Title: "Not a signal service or tips group"
  Body: "We will never tell you what to buy. Anyone who tells you which specific
         stock to buy — and claims it will definitely go up — is not educating you."

Card 3:
  Icon: ✗
  Title: "Not a get-rich-quick scheme"
  Body: "Investing takes time. Years. We'll show you exactly what realistic
         long-term NSE returns have looked like historically — not the best year.
         The average year."

[Below cards — full width, border-t border-[--border-subtle], pt-8, mt-8]
  Text: "If you've seen WhatsApp groups promising 30% monthly returns,
         forex trading 'bots', or crypto investment packages from a friend —
         this course explains why those are dangerous and what real
         investing actually looks like."
  Style: 14px, --text-secondary, max-w-2xl, line-height: 1.7
  This paragraph is the most important on the page for your audience.
```

## Section 5 — One Real Testimonial

```
[SECTION — py-20, max-w-2xl mx-auto px-6, text-left]

[QUOTE — no carousel, no grid of avatars]

Opening mark: large " — Instrument Serif, 80px, --border-default, line-height: 0
Quote text: "I'd been meaning to invest for three years.
             I didn't understand what a CDS account was,
             I didn't know which broker to trust,
             and I'd seen too many people lose money to take the risk.
             Vuka was the first thing that made me feel like I
             actually understood what I was doing."
Style: Instrument Serif, 22px (mobile: 18px), --text-primary, line-height: 1.6, font-weight: 400

Attribution (mt-6):
  Name: "Wanjiku M." — 14px Inter medium, --text-primary
  Role: "Software developer, Nairobi" — 13px Inter, --text-secondary
  Fact: "Completed course: March 2025 · First NSE purchase: April 2025"
  Style: 12px mono, --text-tertiary

Note: If you don't have a real testimonial, remove this section entirely.
A fabricated testimonial is worse than none.
```

## Section 6 — FAQ as Trust Signal

```
[SECTION — py-20, max-w-2xl mx-auto px-6]

H2: "Questions we get asked" — Instrument Serif, 32px

[ACCORDION — each item: border-b border-[--border-subtle], py-5]
[Framer Motion: AnimatePresence for expand/collapse, 200ms ease]

Q: "Do I need a lot of money to start investing on the NSE?"
A: "No. You can buy shares through most licensed brokers with as little as
    KES 1,000–2,000. However, broker fees mean very small amounts
    aren't efficient. We explain the math clearly in Lesson 5."

Q: "Is investing on the NSE safe? What about what happened in 2008?"
A: "The NSE dropped significantly in 2008, and some investors lost money.
    We cover this directly — because understanding how markets fall is
    as important as understanding how they rise. The NSE is a regulated
    exchange. It's not 'safe' in the sense that prices are guaranteed.
    It's legitimate in the sense that it's regulated and transparent."

Q: "Can I lose all my money?"
A: "Yes — if you invest in a single company that fails. That's why
    diversification matters. We cover this in Lesson 6. The short answer:
    invest only what you can afford to leave alone for years."

Q: "What's the difference between this and forex trading?"
A: "Forex trading involves speculating on currency exchange rates,
    often with borrowed money (leverage). It's high-risk and most retail
    forex traders lose money. This course is about buying shares in
    real Kenyan companies on a regulated exchange. Very different."

Q: "Is Vuka connected to any broker or investment company?"
A: "No. We have no financial relationship with any broker.
    We'll show you what licensed NSE brokers look like,
    but the choice of which one to use is entirely yours."
```

## Section 7 — Final CTA

```
[SECTION — py-24, max-w-xl mx-auto px-6, text-center]

H2: "The course takes about three weeks." — Instrument Serif, 32px
BODY: "20–30 minutes per lesson, one lesson when you're ready.
       No deadline. No streak pressure. Just the information you need."
Style: 16px Inter, --text-secondary, mt-4

CTA: "Begin the course" — same button as hero
Below: "Free. No credit card. Cancel anytime (though there's nothing to cancel)."
13px, --text-tertiary
```

---

# 4. DESIGN SYSTEM

## Color Tokens

```css
:root {
  /* ── Backgrounds ── */
  --bg-primary:     #0D1117;  /* Page background */
  --bg-secondary:   #161B22;  /* Section backgrounds, cards */
  --bg-tertiary:    #1C2128;  /* Nested cards, inputs */
  --bg-overlay:     #21262D;  /* Hover states, tooltips */

  /* ── Text ── */
  --text-primary:   #E6EDF3;  /* Main readable text */
  --text-secondary: #8B949E;  /* Supporting text, descriptions */
  --text-tertiary:  #484F58;  /* Labels, placeholders, hints */
  --text-inverse:   #0D1117;  /* Text on colored backgrounds */

  /* ── Borders ── */
  --border-subtle:   rgba(240,246,252,0.07);  /* Very light dividers */
  --border-default:  rgba(240,246,252,0.12);  /* Card borders */
  --border-emphasis: rgba(240,246,252,0.22);  /* Active states */
  --border-focus:    rgba(56,139,253,0.5);    /* Input focus rings */

  /* ── Accent — use sparingly ── */
  --accent-green:      #238636;  /* Primary CTA, success states */
  --accent-green-dark: #1a6128;  /* CTA hover */
  --accent-green-muted:#1f6335;  /* Soft success backgrounds */
  --accent-green-dim:  rgba(35,134,54,0.15); /* Very subtle tint */

  --accent-amber:      #9e6a03;  /* Warnings, milestones */
  --accent-amber-dim:  rgba(158,106,3,0.15);

  --accent-blue:       #388bfd;  /* Links, info states */
  --accent-blue-dim:   rgba(56,139,253,0.15);

  /* ── Semantic ── */
  --success:     #3fb950;
  --warning:     #d29922;
  --error:       #f85149;
  --info:        #388bfd;

  /* ── Shadows ── */
  --shadow-sm:  0 1px 2px rgba(0,0,0,0.4);
  --shadow-md:  0 4px 12px rgba(0,0,0,0.35);
  --shadow-lg:  0 8px 32px rgba(0,0,0,0.4);
}
```

**Why this palette, not the current one:**
- `#238636` is GitHub's green — muted, trustworthy, associated with open-source (not crypto)
- Dark navy-charcoal base reads as "professional software" not "trading platform"
- No neon. No gradients as backgrounds. Color used only for meaning, not decoration.

## Typography System

```css
/* Font imports */
@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

:root {
  /* ── Families ── */
  --font-serif: 'Instrument Serif', Georgia, serif;    /* Editorial headings */
  --font-sans:  'Inter', system-ui, sans-serif;         /* UI, body, labels */
  --font-mono:  'JetBrains Mono', 'Courier New', mono; /* Numbers, data, labels */

  /* ── Scale ── */
  --text-xs:   0.6875rem; /* 11px — mono labels only */
  --text-sm:   0.8125rem; /* 13px — supporting text */
  --text-base: 0.9375rem; /* 15px — body text */
  --text-md:   1rem;      /* 16px — body emphasis */
  --text-lg:   1.125rem;  /* 18px — lead text */
  --text-xl:   1.25rem;   /* 20px — card titles */
  --text-2xl:  1.5rem;    /* 24px — section headers */
  --text-3xl:  2rem;      /* 32px — page titles */
  --text-4xl:  2.75rem;   /* 44px — hero on mobile */
  --text-5xl:  3.25rem;   /* 52px — hero on desktop */

  /* ── Line heights ── */
  --leading-tight:  1.1;   /* Large headings */
  --leading-snug:   1.3;   /* Medium headings */
  --leading-normal: 1.6;   /* UI text */
  --leading-relaxed:1.75;  /* Body text */
  --leading-loose:  1.9;   /* Long-form lesson content */

  /* ── Letter spacing ── */
  --tracking-tight:  -0.025em; /* Large serif headings */
  --tracking-normal:  0;
  --tracking-wide:    0.05em;
  --tracking-widest:  0.12em;  /* Mono labels */
}
```

## Spacing Scale

```css
/* Base: 4px grid */
--space-1:  0.25rem;   /* 4px */
--space-2:  0.5rem;    /* 8px */
--space-3:  0.75rem;   /* 12px */
--space-4:  1rem;      /* 16px */
--space-5:  1.25rem;   /* 20px */
--space-6:  1.5rem;    /* 24px */
--space-8:  2rem;      /* 32px */
--space-10: 2.5rem;    /* 40px */
--space-12: 3rem;      /* 48px */
--space-16: 4rem;      /* 64px */
--space-20: 5rem;      /* 80px */
--space-24: 6rem;      /* 96px */
--space-32: 8rem;      /* 128px */

/* Section vertical padding: py-20 (80px) desktop / py-14 (56px) mobile */
/* Card internal padding: p-6 (24px) */
/* Narrow content max-width: max-w-2xl (672px) */
/* Standard content max-width: max-w-3xl (768px) */  
/* Wide content max-width: max-w-5xl (1024px) */
```

## Border Radius System

```css
--radius-sm:  6px;   /* Inline elements, chips */
--radius-md:  10px;  /* Cards, inputs */
--radius-lg:  16px;  /* Modals, panels */
--radius-xl:  24px;  /* Hero cards */
--radius-full: 9999px; /* Avatars, pills */
```

## Component Patterns

### Buttons

```tsx
// Primary — only one per page section
<button className="
  bg-[--accent-green] text-white
  px-6 py-3 rounded-[--radius-md]
  text-[15px] font-medium font-sans
  hover:bg-[--accent-green-dark]
  transition-colors duration-150
  focus:outline-none focus:ring-2 focus:ring-[--border-focus]
  disabled:opacity-40 disabled:cursor-not-allowed
">
  Begin the course
</button>

// Secondary — supporting action
<button className="
  bg-transparent text-[--text-primary]
  border border-[--border-default]
  px-6 py-3 rounded-[--radius-md]
  text-[15px] font-medium
  hover:bg-[--bg-secondary] hover:border-[--border-emphasis]
  transition-all duration-150
">
  Sign in
</button>

// Ghost — tertiary, text-like
<button className="
  text-[--text-secondary] text-[14px] font-medium
  hover:text-[--text-primary]
  transition-colors duration-150
  underline-offset-4 hover:underline
">
  Learn more
</button>
```

### Cards

```tsx
// Standard card
<div className="
  bg-[--bg-secondary]
  border border-[--border-default]
  rounded-[--radius-md]
  p-6
">

// Interactive card (lesson, course)
<div className="
  bg-[--bg-secondary]
  border border-[--border-default]
  rounded-[--radius-md]
  p-6
  cursor-pointer
  transition-all duration-200
  hover:border-[--border-emphasis]
  hover:bg-[--bg-overlay]
">

// Elevated card (callouts, checkpoints)
<div className="
  bg-[--bg-secondary]
  border border-[--border-default]
  rounded-[--radius-md]
  p-6
  shadow-[--shadow-md]
">

// Danger/warning card
<div className="
  bg-[--accent-amber-dim]
  border border-[--accent-amber]/30
  rounded-[--radius-md]
  p-5
">
```

### Input Fields

```tsx
<div className="flex flex-col gap-1.5">
  <label className="text-[11px] font-mono uppercase tracking-[--tracking-widest] text-[--text-tertiary]">
    Email address
  </label>
  <input className="
    w-full
    bg-[--bg-tertiary]
    border border-[--border-default]
    rounded-[--radius-md]
    px-4 py-2.5
    text-[15px] text-[--text-primary]
    placeholder:text-[--text-tertiary]
    focus:outline-none
    focus:border-[--border-focus]
    focus:ring-1 focus:ring-[--border-focus]
    transition-colors duration-150
  " />
</div>
```

### Mono Labels (used everywhere for metadata)

```tsx
// Use for: lesson numbers, time estimates, status, dates
<span className="text-[11px] font-mono uppercase tracking-[0.12em] text-[--text-tertiary]">
  Lesson 01 · ~20 min
</span>
```

## Animation System

**Rule: Motion should communicate state change, not create delight.**
Every animation must answer: "What information does this motion convey?"

```ts
// Framer Motion variants — use these, don't invent new ones

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } }
};

export const fadeUp = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } }
};

export const stagger = {
  visible: { transition: { staggerChildren: 0.06 } }
};

export const slideUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } }
};

// For panels (Mwalimu)
export const slideFromBottom = {
  hidden: { opacity: 0, y: '100%' },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } },
  exit: { opacity: 0, y: '100%', transition: { duration: 0.2 } }
};

// For modals
export const scaleIn = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.2, ease: 'easeOut' } },
  exit: { opacity: 0, scale: 0.96, transition: { duration: 0.15 } }
};
```

**What NOT to animate:**
- Page backgrounds
- Navigation items (on hover)
- Text color transitions (use 150ms CSS transition, not Framer)
- Loading spinners that aren't progress indicators
- Entry animations for every single element on every page
