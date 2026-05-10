export interface Lesson {
  id: string;
  title: string;
  orderIndex: number;
  estimatedMins: number;
  keyTerms: string[];
  content: string;
  quiz: QuizQuestion[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: { id: string; text: string }[];
  correctId: string;
  explanation: string;
  conceptTag: string;
}

export const LESSONS: Lesson[] = [
  {
    id: "what-is-nse",
    title: "What is the NSE?",
    orderIndex: 1,
    estimatedMins: 15,
    keyTerms: ["NSE", "CMA", "listed company", "shares", "stockbroker"],
    content: `
## What the NSE actually is

The Nairobi Securities Exchange — NSE for short — is a marketplace. But instead of buying vegetables or clothes, people buy and sell small pieces of ownership in companies.

When a company wants to raise money from the public, it can "list" on the NSE. This means it offers pieces of itself — called **shares** — for anyone to buy. If you buy shares in a company, you become a part-owner of that company. A very small part, but an owner nonetheless.

<kenya>
The NSE was founded in 1954, making it one of the oldest stock exchanges in Africa. Today, about 60 companies are listed on it — including names you already know, like Safaricom, Equity Bank, and Kenya Commercial Bank.
</kenya>

## Who regulates it?

The NSE does not run itself. It is overseen by a government body called the **Capital Markets Authority (CMA)**. The CMA makes sure the NSE operates fairly and that companies listed on it follow the rules.

This is important. It means the NSE is not a WhatsApp group or an informal investment scheme. It is a regulated marketplace with legal oversight.

<tip>
The CMA's website is cma.or.ke. You can verify any licensed broker or investment firm there before giving anyone your money.
</tip>

## What gets traded?

On the NSE, the main things traded are **shares** — also called stocks or equities. When you buy a share, you are buying a small piece of a company.

If the company grows and becomes more valuable, your share becomes more valuable too. If the company does badly, your share loses value. That is the basic idea.

## Who can invest?

Any Kenyan adult can invest on the NSE. You do not need to be wealthy or have a finance background. You need:

- A national ID or passport
- A bank account
- A CDS account (we explain this in Lesson 2)
- A licensed stockbroker

That is it. The process is more straightforward than most people think. The knowledge barrier is the real barrier — which is why this course exists.

<warning>
The NSE is not a savings account. Unlike a fixed deposit or M-Shwari, the value of your investment can go down as well as up. You should only invest money you can afford to leave alone for several years.
</warning>

## Why does this matter to you?

Most Kenyans keep their savings in bank accounts or SACCOs. These are safe but they often earn less than inflation over time — meaning your money is slowly losing purchasing power.

Investing on the NSE has historically provided better returns over the long term. But it comes with risk. This course will help you understand both sides clearly.
    `,
    quiz: [
      {
        id: "q1",
        question: "Which government body regulates the NSE?",
        options: [
          { id: "a", text: "The Central Bank of Kenya" },
          { id: "b", text: "The Capital Markets Authority" },
          { id: "c", text: "The Ministry of Finance" },
          { id: "d", text: "The NSE Board of Directors" },
        ],
        correctId: "b",
        explanation: "The Capital Markets Authority (CMA) is the independent regulator established by the Capital Markets Act. The NSE operates under CMA oversight. You can verify any licensed broker at cma.or.ke.",
        conceptTag: "nse-regulation",
      },
      {
        id: "q2",
        question: "What do you become when you buy shares in a company listed on the NSE?",
        options: [
          { id: "a", text: "A creditor — the company owes you money" },
          { id: "b", text: "A part-owner of that company" },
          { id: "c", text: "A customer with special discounts" },
          { id: "d", text: "An employee of the company" },
        ],
        correctId: "b",
        explanation: "Buying shares makes you a part-owner — a shareholder. You own a small percentage of the company. If the company grows, your share value grows. If it struggles, your share value falls.",
        conceptTag: "shares-ownership",
      },
      {
        id: "q3",
        question: "Approximately how many companies are currently listed on the NSE?",
        options: [
          { id: "a", text: "About 10" },
          { id: "b", text: "About 60" },
          { id: "c", text: "About 500" },
          { id: "d", text: "About 2,000" },
        ],
        correctId: "b",
        explanation: "About 60 companies are listed on the NSE. This includes major Kenyan companies like Safaricom, Equity Bank, KCB Group, and East African Breweries.",
        conceptTag: "nse-structure",
      },
      {
        id: "q4",
        question: "Which of these is NOT something you need to start investing on the NSE?",
        options: [
          { id: "a", text: "A national ID or passport" },
          { id: "b", text: "A licensed stockbroker" },
          { id: "c", text: "A university degree in finance" },
          { id: "d", text: "A bank account" },
        ],
        correctId: "c",
        explanation: "You do not need any financial qualifications to invest on the NSE. You need a national ID, a bank account, a CDS account, and a licensed broker. Education helps — which is why you are taking this course — but it is not a legal requirement.",
        conceptTag: "investing-requirements",
      },
      {
        id: "q5",
        question: "Why is investing on the NSE different from keeping money in a savings account?",
        options: [
          { id: "a", text: "NSE investments are guaranteed to grow faster" },
          { id: "b", text: "NSE investments can go up or down in value — there is no guarantee" },
          { id: "c", text: "NSE investments are only for wealthy people" },
          { id: "d", text: "NSE investments cannot be accessed for 10 years" },
        ],
        correctId: "b",
        explanation: "Unlike a savings account or fixed deposit, the value of NSE investments is not guaranteed. Prices go up and down based on how companies perform and market conditions. This risk is why long-term thinking matters — and why this course exists.",
        conceptTag: "investment-risk",
      },
    ],
  },
  {
    id: "cds-accounts",
    title: "CDS Accounts & Licensed Brokers",
    orderIndex: 2,
    estimatedMins: 20,
    keyTerms: ["CDS account", "CDSC", "licensed broker", "KYC", "scam"],
    content: `
## What is a CDS account?

Before you can buy any shares on the NSE, you need a place to keep them. That place is called a **CDS account** — which stands for Central Depository System account.

Think of it like a bank account, but instead of holding money, it holds your shares electronically. Every share you buy gets recorded in your CDS account. Every share you sell gets removed from it.

<kenya>
The CDS in Kenya is run by the Central Depository and Settlement Corporation — known as the CDSC. Their website is cdsc.co.ke. This is the official body that manages share ownership records for all NSE investors.
</kenya>

## How do you open a CDS account?

You open a CDS account through a **licensed stockbroker**. You cannot open one directly. The broker handles the application on your behalf.

What you need:
- Your national ID or passport
- A passport photo
- Your KRA PIN certificate
- Your bank account details
- A completed account opening form (your broker provides this)

The process typically takes 3 to 5 business days. Most licensed brokers now allow you to start the process online.

## What is a licensed broker?

A stockbroker is the person or company through whom you buy and sell shares. They are like the middleman between you and the NSE.

The critical word is **licensed**. In Kenya, stockbrokers must be licensed by the CMA. An unlicensed person who offers to invest your money in shares is operating illegally.

<tip>
The full list of licensed stockbrokers in Kenya is available at: nse.co.ke/broker-list. Before working with any broker, check that their name appears on this list.
</tip>

## How to recognise an investment scam

This lesson would be incomplete without addressing scams directly. Investment fraud is common in Kenya, and it specifically targets people who are new to investing.

Here is what a scam looks like:

**WhatsApp investment groups** — Someone adds you to a group promising "daily returns" of 10–30%. This is not investing. No legitimate investment delivers guaranteed daily returns.

**Forex trading bots** — Someone sells you software that claims to automatically trade foreign currencies and make you money while you sleep. Real forex trading is extremely risky. Automated "bots" sold to beginners are almost always scams.

**Pyramid schemes** — You are asked to invest money and recruit others. Your returns come from recruiting new members, not from any real business activity. These always collapse.

**Unregistered investment managers** — Someone offers to "manage your money" or "invest on your behalf" but is not on the CMA or CDSC licensed list.

<warning>
If anyone promises you guaranteed returns on an investment, that is a red flag. All legitimate investments carry risk. Anyone who tells you otherwise is either lying or selling something dangerous. Check every broker or investment firm at cma.or.ke before giving them any money.
</warning>

## Three legitimate licensed brokers to know

These are actual licensed NSE brokers. This is not a recommendation — it is simply to show you what legitimate options look like:

- **Faida Investment Bank** — faida.co.ke
- **AIB-AXYS Africa** — aib-axys.com
- **NIC Securities** — nicsecurities.com

All three appear on the official NSE broker list. All three allow you to open a CDS account. Compare their fees before choosing one.

## What happens after you open a CDS account?

Once your CDS account is active, you can fund it (transfer money from your bank or M-Pesa) and begin placing buy orders for shares. We cover this in Lesson 5.

Opening the account is the most important practical step. Most people who intend to invest never take it.
    `,
    quiz: [
      {
        id: "q1",
        question: "What does a CDS account hold?",
        options: [
          { id: "a", text: "Your money in Kenyan shillings" },
          { id: "b", text: "Your shares, stored electronically" },
          { id: "c", text: "Your KRA tax records" },
          { id: "d", text: "Your loan history" },
        ],
        correctId: "b",
        explanation: "A CDS account holds your shares electronically — not money. Think of it as a digital record of every share you own. Money sits in your bank account; shares sit in your CDS account.",
        conceptTag: "cds-account",
      },
      {
        id: "q2",
        question: "Who manages CDS accounts in Kenya?",
        options: [
          { id: "a", text: "The Central Bank of Kenya" },
          { id: "b", text: "The Kenya Revenue Authority" },
          { id: "c", text: "The Central Depository and Settlement Corporation (CDSC)" },
          { id: "d", text: "Individual stockbrokers independently" },
        ],
        correctId: "c",
        explanation: "The CDSC (Central Depository and Settlement Corporation) manages all CDS accounts in Kenya. Their website is cdsc.co.ke. Brokers open accounts on your behalf, but the CDSC maintains the official records.",
        conceptTag: "cdsc",
      },
      {
        id: "q3",
        question: "Where can you verify that a stockbroker is officially licensed in Kenya?",
        options: [
          { id: "a", text: "On the broker's own website" },
          { id: "b", text: "On the NSE broker list at nse.co.ke" },
          { id: "c", text: "On their WhatsApp profile" },
          { id: "d", text: "By asking them directly" },
        ],
        correctId: "b",
        explanation: "The official list of licensed brokers is at nse.co.ke/broker-list. Always verify before working with any broker. A broker's own website or their word is not sufficient verification.",
        conceptTag: "licensed-broker",
      },
      {
        id: "q4",
        question: "A WhatsApp group promises you 15% returns every week on your investment. This is most likely:",
        options: [
          { id: "a", text: "A great investment opportunity you should act on quickly" },
          { id: "b", text: "A new NSE product for beginners" },
          { id: "c", text: "A scam — guaranteed weekly returns are not possible in legitimate investing" },
          { id: "d", text: "A licensed broker advertising their services" },
        ],
        correctId: "c",
        explanation: "No legitimate investment guarantees weekly returns of 15%. Annual returns of 10–15% are considered good in the stock market. Anything promising fast, guaranteed returns is almost certainly a scam. Never invest based on WhatsApp group recommendations.",
        conceptTag: "scam-recognition",
      },
      {
        id: "q5",
        question: "Which document is NOT typically required to open a CDS account?",
        options: [
          { id: "a", text: "National ID or passport" },
          { id: "b", text: "KRA PIN certificate" },
          { id: "c", text: "University degree certificate" },
          { id: "d", text: "Bank account details" },
        ],
        correctId: "c",
        explanation: "You do not need any educational qualifications to open a CDS account. You need your ID, KRA PIN, bank details, and a passport photo. Education is not a requirement — which is exactly why courses like this one exist.",
        conceptTag: "cds-requirements",
      },
    ],
  },
  {
    id: "reading-listings",
    title: "Reading a Stock Listing",
    orderIndex: 3,
    estimatedMins: 20,
    keyTerms: ["share price", "volume", "market cap", "52-week range", "P/E ratio"],
    content: `
## What is a stock listing?

When you go to the NSE website (nse.co.ke) and look up a company, you see a page of numbers. These numbers tell you everything publicly available about that company's stock. Learning to read them is one of the most practical skills you can develop as an investor.

Let us walk through each number using Safaricom as an example, since it is Kenya's most traded stock.

## The share price

The share price is the current cost of one share in that company. If Safaricom is trading at KES 30, that means one share costs KES 30 today.

This number changes throughout the trading day — every time someone buys or sells a Safaricom share, the price adjusts slightly.

<warning>
Do not make investment decisions based on whether a price seems "cheap" or "expensive." A share priced at KES 5 is not automatically a better buy than one priced at KES 300. What matters is the value of the company behind the price — not the number itself.
</warning>

## Volume

Volume tells you how many shares were traded today. If Safaricom's volume is 2,000,000, it means 2 million shares changed hands during the trading session.

High volume is generally a good sign. It means the stock is liquid — you can buy or sell without difficulty. Low volume means fewer people are trading, which can make it harder to buy or sell quickly.

## The 52-week range

This shows the lowest and highest price the share has reached over the past 12 months. For example: KES 24.00 — KES 37.50.

This gives you context for where the current price sits relative to recent history. It does not tell you what the price will do next — but it tells you where it has been.

## Market capitalisation

Market cap is the total value of all shares in a company combined. It is calculated by multiplying the share price by the total number of shares.

Market cap gives you a sense of the company's size:
- Large companies (KES 100 billion+): Safaricom, Equity Bank
- Medium companies: smaller but established businesses
- Small companies: newer or more niche listings

<kenya>
Safaricom has the largest market capitalisation on the NSE — making it the most heavily weighted company in NSE index calculations. What happens to Safaricom's price significantly affects the overall NSE index.
</kenya>

## P/E ratio — price to earnings

The P/E ratio compares the share price to how much money the company earns per share. It tells you roughly how much investors are willing to pay for each shilling of the company's profit.

A P/E of 15 means investors are paying KES 15 for every KES 1 of annual earnings.

A lower P/E can suggest a stock is undervalued. A higher P/E can suggest investors expect the company to grow. Context matters — compare the P/E to other companies in the same industry, not across different sectors.

<tip>
Do not try to memorise all these numbers on a single listing. Start by looking at three things only: the current price, the 52-week range, and the volume. Build from there as you grow more comfortable.
</tip>

## Where to find this information

Go to **nse.co.ke** → click "Market Data" → search for any listed company. All this information is public and free. You do not need to pay for it.

You can also check the daily share price tables published in the Business Daily newspaper.
    `,
    quiz: [
      {
        id: "q1",
        question: "A share is priced at KES 5. Another is priced at KES 300. Which is the better investment?",
        options: [
          { id: "a", text: "The KES 5 share — it is cheaper and has more room to grow" },
          { id: "b", text: "The KES 300 share — higher price means better quality" },
          { id: "c", text: "You cannot tell from the price alone — other factors matter more" },
          { id: "d", text: "Always buy the cheapest share available" },
        ],
        correctId: "c",
        explanation: "Share price alone tells you very little. A KES 5 share could be overpriced if the company is struggling. A KES 300 share could be cheap if the company is very profitable. You need to look at the full picture — earnings, market cap, industry context.",
        conceptTag: "share-price",
      },
      {
        id: "q2",
        question: "What does high trading volume on a stock indicate?",
        options: [
          { id: "a", text: "The company is about to go bankrupt" },
          { id: "b", text: "The stock is liquid — easy to buy and sell" },
          { id: "c", text: "The share price is guaranteed to rise" },
          { id: "d", text: "The company is paying a dividend soon" },
        ],
        correctId: "b",
        explanation: "High volume means many people are trading the stock. This is called liquidity — it means you can buy or sell shares without difficulty. Low volume stocks can be hard to exit quickly if you need to sell.",
        conceptTag: "volume",
      },
      {
        id: "q3",
        question: "The 52-week range for a stock shows KES 24 – KES 37. The current price is KES 25. What does this tell you?",
        options: [
          { id: "a", text: "The stock will definitely rise back to KES 37" },
          { id: "b", text: "The current price is near the lower end of its range over the past year" },
          { id: "c", text: "The company has been losing money" },
          { id: "d", text: "You should sell immediately" },
        ],
        correctId: "b",
        explanation: "The 52-week range tells you where the price has been over the past year. At KES 25, the stock is near its yearly low. This is context — not a signal to buy or sell. The price could continue falling, or it could recover. You need more information to decide.",
        conceptTag: "52-week-range",
      },
      {
        id: "q4",
        question: "How is market capitalisation calculated?",
        options: [
          { id: "a", text: "Annual revenue minus annual costs" },
          { id: "b", text: "Share price multiplied by total number of shares" },
          { id: "c", text: "Total company assets minus total debts" },
          { id: "d", text: "The NSE assigns it based on company age" },
        ],
        correctId: "b",
        explanation: "Market cap = share price × total shares. If Equity Bank has 3.7 billion shares and the price is KES 50, the market cap is KES 185 billion. This gives you the total value the market places on the entire company.",
        conceptTag: "market-cap",
      },
      {
        id: "q5",
        question: "Where can you find official, free stock listing information for NSE-listed companies?",
        options: [
          { id: "a", text: "Only through a paid Bloomberg subscription" },
          { id: "b", text: "On nse.co.ke under Market Data" },
          { id: "c", text: "Only through your stockbroker" },
          { id: "d", text: "On social media investment groups" },
        ],
        correctId: "b",
        explanation: "All NSE market data is publicly available for free at nse.co.ke. Click Market Data and search any listed company. You do not need to pay for this information or rely on brokers or social media for basic listing data.",
        conceptTag: "nse-data",
      },
    ],
  },
  {
    id: "price-movements",
    title: "Understanding Price Movements",
    orderIndex: 4,
    estimatedMins: 20,
    keyTerms: ["supply and demand", "long-term investing", "market volatility", "noise"],
    content: `
## Why do share prices change?

At the most basic level, share prices change because of supply and demand. When more people want to buy a share than sell it, the price goes up. When more people want to sell than buy, the price goes down.

But what drives those buying and selling decisions? Many things:

- **Company results** — if Equity Bank announces strong profits, more people want to own it, so the price rises
- **Industry news** — if a drought is forecast, agricultural company shares may fall
- **Economic conditions** — rising interest rates often cause share prices to fall broadly
- **Market sentiment** — sometimes prices move simply because investors feel fearful or optimistic

<kenya>
In 2008, the NSE dropped significantly — partly due to the global financial crisis and partly due to Kenya's post-election instability. Investors who panicked and sold at the bottom locked in their losses. Investors who held on recovered their value over the following years. This pattern has repeated throughout NSE history.
</kenya>

## The most important thing to understand about daily price movements

They are mostly noise.

If you buy shares in a good company and check the price every day, you will see it go up on some days and down on others — for no clear reason. This is normal. It does not mean you made a mistake. It does not mean you should sell.

Short-term price movements are driven by thousands of people making thousands of decisions based on different information, different timelines, and different emotional states. Most of it is not meaningful signal.

<warning>
Checking your share price every day and reacting to every movement is one of the most reliable ways to make poor investment decisions. Long-term investors who check prices quarterly or annually almost always outperform those who watch prices daily.
</warning>

## What actually matters over the long term

Over years and decades, share prices follow company performance. If a company consistently grows its profits, serves its customers well, and manages its finances responsibly — its share price will generally reflect that over time.

This is why the question "should I buy this share today?" matters less than "do I believe this company will be more valuable in 5–10 years than it is today?"

## Risk checkpoint — answer honestly

Before continuing, consider this question:

**Imagine you invest KES 50,000 in shares. Six months later, the value has dropped to KES 38,000. What would you do?**

There is no right or wrong answer here. But your honest answer reveals your actual risk tolerance — which should guide how much of your savings you ever put into shares.

If your answer is "I would panic and sell immediately" — that is important self-knowledge. It means you need to start with a very small amount that you can genuinely afford to lose without it affecting your life.

<tip>
A practical rule used by many beginner investors: never invest more than you could completely lose without it affecting your daily life or financial obligations. Start small. Learn how you actually react to losses before investing larger amounts.
</tip>

## The long-term NSE picture

Despite significant drops in 2008, 2011, 2015, and 2020 — the NSE has generated positive returns for patient, diversified investors over long periods. This does not guarantee future performance. But it provides historical context.

Patience is not a passive strategy. It is an active, deliberate choice to not react to short-term noise.
    `,
    quiz: [
      {
        id: "q1",
        question: "What is the most basic reason a share price goes up?",
        options: [
          { id: "a", text: "The NSE decides to increase it" },
          { id: "b", text: "More people want to buy it than sell it" },
          { id: "c", text: "The company pays a dividend" },
          { id: "d", text: "The government approves it" },
        ],
        correctId: "b",
        explanation: "Share prices move based on supply and demand. When buyers outnumber sellers, the price rises. When sellers outnumber buyers, the price falls. This happens continuously during trading hours as thousands of orders are placed.",
        conceptTag: "supply-demand",
      },
      {
        id: "q2",
        question: "You buy shares in a company. The next week the price drops 8% for no obvious reason. What is most likely happening?",
        options: [
          { id: "a", text: "The company is going bankrupt" },
          { id: "b", text: "You made a mistake buying it" },
          { id: "c", text: "Normal short-term market noise — it happens to all shares" },
          { id: "d", text: "A guaranteed sign you should sell immediately" },
        ],
        correctId: "c",
        explanation: "Short-term price drops of 5–10% are completely normal even for excellent companies. They often reflect broader market sentiment or individual traders taking profits — not anything specific to the company. Long-term investors expect and accept this.",
        conceptTag: "market-noise",
      },
      {
        id: "q3",
        question: "What happened to investors who sold NSE shares during the 2008 crash versus those who held on?",
        options: [
          { id: "a", text: "Those who sold protected themselves — the NSE never recovered" },
          { id: "b", text: "Both groups ended up with the same result eventually" },
          { id: "c", text: "Those who sold locked in their losses; those who held on generally recovered over time" },
          { id: "d", text: "The government compensated everyone who sold" },
        ],
        correctId: "c",
        explanation: "Investors who panicked and sold in 2008 locked in their losses permanently. Investors who held through the crisis saw their portfolios recover over the following years. This pattern — panic selling at the bottom — is the single most common investor mistake.",
        conceptTag: "long-term-investing",
      },
      {
        id: "q4",
        question: "Which approach has historically produced better investment outcomes?",
        options: [
          { id: "a", text: "Checking prices daily and reacting to each movement" },
          { id: "b", text: "Buying and selling based on WhatsApp investment tips" },
          { id: "c", text: "Holding quality investments patiently and checking prices quarterly" },
          { id: "d", text: "Selling every time the price drops more than 5%" },
        ],
        correctId: "c",
        explanation: "Research consistently shows that patient, infrequent traders outperform active traders. Every time you trade, you pay broker commissions and risk making an emotional decision. Long-term holding of quality companies reduces both costs and emotional mistakes.",
        conceptTag: "investment-patience",
      },
      {
        id: "q5",
        question: "What is the most honest question to ask yourself before investing any amount in shares?",
        options: [
          { id: "a", text: "Which share will rise the fastest?" },
          { id: "b", text: "Could I completely lose this money without it seriously affecting my life?" },
          { id: "c", text: "What is the guaranteed minimum return?" },
          { id: "d", text: "Which broker has the most followers on social media?" },
        ],
        correctId: "b",
        explanation: "Before investing any amount, honestly ask yourself if you could lose it entirely without affecting your life, relationships, or financial obligations. If the answer is no, reduce the amount until the answer is yes. This is not pessimism — it is the foundation of responsible investing.",
        conceptTag: "risk-tolerance",
      },
    ],
  },
  {
    id: "first-order",
    title: "Your First Buy Order",
    orderIndex: 5,
    estimatedMins: 25,
    keyTerms: ["buy order", "settlement", "broker commission", "T+3", "M-Pesa"],
    content: `
## You are nearly there

By this point you understand what the NSE is, how CDS accounts work, how to read a listing, and why prices move. This lesson covers the practical mechanics of actually buying shares for the first time.

## Step 1 — Open your CDS account

If you have not done this yet, this is the first real step. Go back to Lesson 2 and follow the process with a licensed broker from the official NSE list.

Once your CDS account is open and verified (3–5 business days), you are ready to fund it.

## Step 2 — Fund your account

Transfer money from your bank account or M-Pesa to your broker's account. Most licensed brokers now accept M-Pesa deposits.

Minimum amounts vary by broker. Most start from around KES 1,000 to KES 5,000. However, very small amounts are not efficient because broker fees eat into your returns. A starting amount of KES 10,000–20,000 makes more practical sense.

<tip>
Before transferring any money, confirm the exact bank account or M-Pesa details directly on your broker's official website — not from a message someone sent you. Fraud happens when people transfer money to fake accounts.
</tip>

## Step 3 — Choose what to buy

For a first investment, most experienced investors suggest starting with a large, well-known company that is easy to research. In Kenya, this often means one of:

- **Safaricom (SCOM)** — Kenya's largest company, very liquid, easy to research
- **Equity Bank (EQTY)** — one of Africa's largest banks, consistent dividend payer
- **KCB Group (KCB)** — long-established Kenyan bank

This is not a recommendation. These are examples of companies that have a long public track record you can research before deciding.

<warning>
Do not buy a share because someone in a WhatsApp group, on Twitter, or on YouTube told you it will rise. Research the company yourself using its annual report and the NSE listing data you learned in Lesson 3.
</warning>

## Step 4 — Place your order

Contact your broker (via their app, website, or phone) and place a buy order. You specify:

- **Which share** (e.g., Safaricom — ticker: SCOM)
- **How many shares** you want to buy
- **At what price** — you can place a market order (buy at current price) or a limit order (only buy if price reaches your specified level)

Your broker confirms the order and it goes to the NSE for execution.

## Step 5 — Settlement (T+3)

When your order is filled, settlement takes 3 business days — known as T+3. This means:

- Day 0: Your order is executed
- Day 3: The shares officially appear in your CDS account and the money leaves your broker account

During those 3 days, the transaction is being processed and verified by the CDSC.

## What does it cost?

Every trade has fees. Here is a typical breakdown:

<kenya>
Standard NSE transaction costs:
- Broker commission: approximately 1.8% of trade value
- CDSC fee: 0.12% of trade value
- NSE levy: 0.12% of trade value
- Capital gains tax: 0% (currently exempt on NSE shares in Kenya)

Example: buying KES 20,000 of Safaricom shares costs approximately KES 408 in fees (about 2% total). This means you need your investment to grow by at least 2% before you break even on fees.
</kenya>

This is why small investments (under KES 5,000) are often inefficient — the fees represent a large percentage of the investment.

## After your order is filled

Log into your CDS account after 3 business days and confirm the shares appear. Keep a record of:
- What you bought
- How many shares
- At what price
- On what date

This becomes your reference point for tracking your investment going forward.
    `,
    quiz: [
      {
        id: "q1",
        question: "What does T+3 mean in NSE trading?",
        options: [
          { id: "a", text: "You can only trade 3 times per month" },
          { id: "b", text: "Settlement takes 3 business days after your order is executed" },
          { id: "c", text: "You must wait 3 years before selling" },
          { id: "d", text: "The broker charges a 3% fee" },
        ],
        correctId: "b",
        explanation: "T+3 means trade date plus 3 business days. When you buy shares, they officially transfer to your CDS account 3 business days later. The money leaves your broker account at the same time. This is standard settlement practice on the NSE.",
        conceptTag: "settlement",
      },
      {
        id: "q2",
        question: "You want to buy Safaricom shares only if the price drops to KES 28. What type of order should you place?",
        options: [
          { id: "a", text: "A market order — buy at the current price immediately" },
          { id: "b", text: "A limit order — only execute if the price reaches KES 28" },
          { id: "c", text: "A stop order — sell if price drops to KES 28" },
          { id: "d", text: "A dividend order — wait for the next dividend payment" },
        ],
        correctId: "b",
        explanation: "A limit order tells your broker: only buy these shares if the price reaches my specified level. If the price never drops to KES 28, the order is not executed. This gives you price control. A market order buys at whatever the current price is.",
        conceptTag: "order-types",
      },
      {
        id: "q3",
        question: "You are investing KES 15,000 in NSE shares. Approximately how much will you pay in total transaction fees?",
        options: [
          { id: "a", text: "About KES 30 (0.2%)" },
          { id: "b", text: "About KES 300 (2%)" },
          { id: "c", text: "About KES 1,500 (10%)" },
          { id: "d", text: "Nothing — NSE trading is fee-free" },
        ],
        correctId: "b",
        explanation: "Total NSE transaction costs are approximately 2% (broker commission ~1.8% + CDSC fee 0.12% + NSE levy 0.12%). On KES 15,000, that is about KES 300. This means your investment needs to grow by at least 2% before you profit from it.",
        conceptTag: "broker-fees",
      },
      {
        id: "q4",
        question: "Before transferring money to your broker, what should you do?",
        options: [
          { id: "a", text: "Transfer quickly before the share price changes" },
          { id: "b", text: "Confirm the account details directly on the broker's official website" },
          { id: "c", text: "Ask someone in a WhatsApp investment group for the details" },
          { id: "d", text: "Send a test transfer of KES 1 million first" },
        ],
        correctId: "b",
        explanation: "Always confirm payment details directly on your broker's official website — not from messages, emails, or social media. Investment fraud often involves directing payments to fake accounts. Take 2 minutes to verify before transferring any amount.",
        conceptTag: "transfer-safety",
      },
      {
        id: "q5",
        question: "Why is investing very small amounts (under KES 3,000) often inefficient on the NSE?",
        options: [
          { id: "a", text: "The NSE does not allow small trades" },
          { id: "b", text: "Transaction fees represent a very high percentage of small investments" },
          { id: "c", text: "Brokers refuse to handle small orders" },
          { id: "d", text: "Small investments automatically expire after 30 days" },
        ],
        correctId: "b",
        explanation: "On a KES 3,000 investment, 2% in fees is KES 60. Your investment needs to grow by 2% just to break even. The smaller the investment, the larger the fees as a percentage. Starting with KES 10,000–20,000 makes the fee impact more manageable.",
        conceptTag: "investment-efficiency",
      },
    ],
  },
  {
    id: "after-investing",
    title: "After You Invest",
    orderIndex: 6,
    estimatedMins: 20,
    keyTerms: ["CDS statement", "dividend", "portfolio", "patience", "panic selling"],
    content: `
## You have made your first investment

If you have reached this lesson, you either have already made your first NSE investment or you are very close to it. Either way, this lesson covers what happens next — and what to do (and not do) in the weeks, months, and years that follow.

## Reading your CDS statement

Every quarter, the CDSC sends you a statement showing all the shares you hold. It lists:

- The company name and ticker
- How many shares you own
- The price you paid (your cost basis)
- The current market value

Your broker's app or website also shows this in real time. Get comfortable reading it. It is your official record of ownership.

## What is a dividend?

Some companies share a portion of their profits with shareholders. This payment is called a **dividend**. It is paid in cash, directly to your bank account (linked through your broker).

Not all listed companies pay dividends. Companies that do typically pay once or twice a year. In Kenya, consistent dividend payers have historically included companies like Safaricom, KCB, and Equity Bank — though this varies year to year depending on their performance.

<kenya>
Dividends on NSE shares are subject to withholding tax of 5% for Kenyan residents. This is deducted automatically before you receive the payment. You do not need to do anything — it is handled by the company paying the dividend.
</kenya>

Dividends are a way of earning income from your investment without selling your shares. Over the long term, reinvesting dividends significantly increases total investment returns.

## What to do when prices fall

This is the most important part of this entire course.

At some point after you invest, the price of your shares will fall. This is guaranteed. It happens to every investment. The question is not whether it will happen — it is how you will respond when it does.

The correct response, in most cases, is: **nothing**.

If you invested in a good company for the right reasons — because you understood its business, believed in its long-term prospects, and invested money you could afford to leave alone — then a temporary price drop does not change any of those facts.

<warning>
Panic selling is the most common and most damaging investing mistake. An investor who buys at KES 30, watches the price fall to KES 22, panics and sells — has permanently lost KES 8 per share. An investor who holds through the same drop and sees the price recover to KES 35 has gained KES 5 per share. The only difference is the response to temporary loss.
</warning>

## When selling IS the right decision

Holding through drops does not mean holding forever regardless of circumstances. There are legitimate reasons to sell:

- The company's business has fundamentally changed for the worse
- You need the money for a genuine emergency
- Better investment opportunities exist and you want to reallocate
- You have reached your investment goal

What is NOT a good reason to sell: the price went down and it feels uncomfortable.

## Building from here

One investment is a start. Over time, most investors build a portfolio — a collection of shares in different companies across different sectors. This is called diversification, and it reduces the risk that any single company's failure destroys your overall wealth.

A simple approach for a Kenyan beginner:
- 2–3 large, liquid NSE shares across different sectors
- A money market fund for the portion you might need within 1–2 years
- Gradually add to positions over time rather than investing everything at once

<tip>
The CDSC helpline is available if you ever have questions about your account: +254 20 2907000. For complaints about a broker, contact the CMA: +254 20 2264000. You have recourse — use it if something goes wrong.
</tip>

## What you have learned in this course

You started this course not knowing what the NSE was. You now know:

- What the NSE is and who regulates it
- What a CDS account is and how to open one
- How to recognise a licensed broker — and a scam
- How to read a stock listing
- Why prices move and why short-term movements mostly do not matter
- How to place a buy order and what it costs
- How to read your statement, understand dividends, and respond calmly when prices fall

That is the foundation. What you do with it is yours to decide.

The CDSC and NSE websites have everything you need to take the next step. Go at your own pace. Invest only what you can genuinely afford. And verify everything before trusting anyone with your money.
    `,
    quiz: [
      {
        id: "q1",
        question: "What is a dividend?",
        options: [
          { id: "a", text: "A fee charged by your broker each month" },
          { id: "b", text: "A share of company profits paid to shareholders in cash" },
          { id: "c", text: "A bonus share given when you open a CDS account" },
          { id: "d", text: "Interest paid by the CDSC on your account balance" },
        ],
        correctId: "b",
        explanation: "A dividend is a payment companies make to shareholders from their profits. It is paid in cash to your linked bank account. Not all companies pay dividends, and the amount varies year to year based on company performance.",
        conceptTag: "dividends",
      },
      {
        id: "q2",
        question: "You invested KES 30,000. The value drops to KES 23,000 two months later. The company's business is still healthy. What should you most likely do?",
        options: [
          { id: "a", text: "Sell immediately to stop further losses" },
          { id: "b", text: "Hold — a temporary drop in a healthy company is usually not a reason to sell" },
          { id: "c", text: "Borrow money to buy more shares quickly" },
          { id: "d", text: "Call the CMA and report the price drop" },
        ],
        correctId: "b",
        explanation: "If the company is fundamentally healthy and your investment thesis has not changed, a temporary price drop is not a reason to sell. Selling locks in the loss permanently. Holding gives the investment time to recover. This requires patience — but it is what long-term investing demands.",
        conceptTag: "panic-selling",
      },
      {
        id: "q3",
        question: "What withholding tax rate applies to dividends received by Kenyan residents from NSE companies?",
        options: [
          { id: "a", text: "0% — dividends are tax-free in Kenya" },
          { id: "b", text: "5% — deducted automatically before you receive the payment" },
          { id: "c", text: "30% — the standard income tax rate" },
          { id: "d", text: "16% — the VAT rate" },
        ],
        correctId: "b",
        explanation: "Dividends paid to Kenyan residents are subject to 5% withholding tax, deducted at source by the company before you receive the payment. You do not need to file anything separately for this — it is handled automatically.",
        conceptTag: "dividend-tax",
      },
      {
        id: "q4",
        question: "Which of these is a legitimate reason to sell your shares?",
        options: [
          { id: "a", text: "The price dropped 10% and it feels uncomfortable" },
          { id: "b", text: "A WhatsApp group is saying the stock will fall further" },
          { id: "c", text: "You have a genuine financial emergency and need the funds" },
          { id: "d", text: "Your friend told you to sell" },
        ],
        correctId: "c",
        explanation: "Legitimate reasons to sell include: genuine financial emergencies, fundamental changes in the company's business, or reallocation to better opportunities. Discomfort with a temporary price drop, social media rumours, or friend advice are not legitimate reasons.",
        conceptTag: "selling-decisions",
      },
      {
        id: "q5",
        question: "What is the CDSC helpline number for account queries?",
        options: [
          { id: "a", text: "+254 20 2907000" },
          { id: "b", text: "+254 722 000000" },
          { id: "c", text: "+254 20 3318000" },
          { id: "d", text: "+254 800 723000" },
        ],
        correctId: "a",
        explanation: "The CDSC helpline is +254 20 2907000. For CMA complaints about a broker: +254 20 2264000. Know these numbers. If something goes wrong with your account or broker, these are the official channels to contact.",
        conceptTag: "investor-support",
      },
    ],
  },
];

export function getLessonById(id: string): Lesson | undefined {
  return LESSONS.find((l) => l.id === id);
}

export function getNextLesson(currentId: string): Lesson | undefined {
  const current = LESSONS.find((l) => l.id === currentId);
  if (!current) return undefined;
  return LESSONS.find((l) => l.orderIndex === current.orderIndex + 1);
}

export const LESSON_COMPLETE_MESSAGES: Record<string, string> = {
  "what-is-nse":
    "You now understand what the NSE is and who regulates it. Most adults in Kenya don't. You do.",
  "cds-accounts":
    "You can now identify a licensed broker and recognise a scam. That puts you ahead of most people who think about investing but never start.",
  "reading-listings":
    "You can read a stock listing. Most investors skip this step and invest blind. You won't.",
  "price-movements":
    "You understand why prices move and why short-term movements usually don't matter. That knowledge will protect you.",
  "first-order":
    "You know exactly how to place your first buy order. One lesson left.",
  "after-investing":
    "You have completed the NSE Foundations course. You are prepared to make an informed first investment.",
};
