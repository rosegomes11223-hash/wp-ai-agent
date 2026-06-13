import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'WP AI Agent',
    template: '%s | WP AI Agent',
  },
  description:
    'AI-powered WordPress automation platform for content generation, SEO optimization, translation, and publishing.',
  keywords: [
    'WordPress AI',
    'AI content generator',
    'SEO optimization',
    'multilingual blog',
    'content automation',
  ],
  authors: [{ name: 'WP AI Agent' }],
  creator: 'WP AI Agent',
  openGraph: {
    title: 'WP AI Agent',
    description:
      'Generate, optimize, translate, and publish WordPress content using AI.',
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
      <body
        style={{
          margin: 0,
          padding: 0,
          fontFamily:
            'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial',
          backgroundColor: '#f9fafb',
          color: '#111827',
        }}
      >
        <main>{children}</main>
      </body>
    </html>
  );
}
