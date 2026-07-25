import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vuka — NSE Investing Education",
  description: "A free, structured course for Kenyan beginners learning to invest on the Nairobi Securities Exchange. Six lessons, no jargon, no broker commissions.",
  openGraph: {
    title: "Vuka — NSE Investing Education",
    description: "Learn to invest on the Nairobi Stock Exchange. Free course for Kenyan beginners.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Inter:wght@400;500&display=swap"
          rel="stylesheet"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#0F0A06" />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
