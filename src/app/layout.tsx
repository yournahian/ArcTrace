import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ArcTrace | Proof of Work & Engagement Engine for Arc Network',
  description:
    'Track, verify, and showcase your Proof-of-Work contributions to Arc Network (Circle Layer-1 blockchain with USDC gas).',
  keywords: ['ArcTrace', 'Arc Network', 'Circle', 'USDC', 'Proof of Work', 'Engagement Checker', 'Web3', 'Blockchain'],
  openGraph: {
    title: 'ArcTrace | Measure Your Impact on Arc Network',
    description: 'Proof-of-work engagement engine for Arc Network contributors.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' rx='8' fill='%232563EB'/><path d='M16 6L7 12.5L16 19L25 12.5L16 6Z' fill='white'/><path d='M7 16L16 22.5L25 16' stroke='white' stroke-width='2.2'/><path d='M7 19.5L16 26L25 19.5' stroke='%2300E5FF' stroke-width='2.2'/></svg>" />
      </head>
      <body>{children}</body>
    </html>
  );
}
