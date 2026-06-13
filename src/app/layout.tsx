import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'WP AI Agent',
    template: '%s | WP AI Agent',
  },
  description:
    'AI-powered WordPress automation system for content generation, SEO optimization, translation, and publishing.',
  keywords: [
    'WordPress AI',
    'AI content generator',
    'SEO optimizer',
    'blog automation',
    'multilingual content',
  ],
  authors: [{ name: 'WP AI Agent' }],
  creator: 'WP AI Agent',
  metadataBase: new URL('https://localhost:3000'),
  openGraph: {
    title: 'WP AI Agent',
    description:
      'Generate, optimize, translate, and publish WordPress content using AI.',
    type: 'website',
    url: 'https://localhost:3000',
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
          backgroundColor: '#f5f7fb',
          color: '#111827',
          lineHeight: 1.6,
        }}
      >
        {/* App Container */}
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Main App Content */}
          <main style={{ flex: 1 }}>{children}</main>

          {/* Footer */}
          <footer
            style={{
              padding: '1rem',
              textAlign: 'center',
              fontSize: '0.85rem',
              color: '#6b7280',
              borderTop: '1px solid #e5e7eb',
              backgroundColor: '#ffffff',
            }}
          >
            © {new Date().getFullYear()} WP AI Agent · Built with Next.js & AI
          </footer>
        </div>
      </body>
    </html>
  );
}
