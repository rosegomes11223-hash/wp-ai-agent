'use client';

import { useState } from 'react';

type AgentAction =
  | 'generate'
  | 'analyze-seo'
  | 'translate'
  | 'publish'
  | 'test-connection';

export default function Home() {
  const [action, setAction] = useState<AgentAction>('generate');

  const [topic, setTopic] = useState('');
  const [keyword, setKeyword] = useState('');
  const [content, setContent] = useState('');
  const [targetLanguage, setTargetLanguage] = useState('');
  const [title, setTitle] = useState('');

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit() {
    setLoading(true);
    setError('');
    setResult('');

    try {
      if (action === 'publish' && !title.trim()) {
        setError('Title is required for publishing');
        setLoading(false);
        return;
      }

      if ((action === 'analyze-seo' || action === 'translate') && !content.trim()) {
        setError('Content is required');
        setLoading(false);
        return;
      }

      const body: Record<string, unknown> = { action };

      if (action === 'generate') {
        body.topic = topic;
        body.keywords = keyword ? [keyword] : [];
      }

      if (action === 'analyze-seo') {
        body.content = content;
        body.keywords = keyword ? [keyword] : [];
      }

      if (action === 'translate') {
        body.content = content;
        body.targetLanguage = targetLanguage;
      }

      if (action === 'publish') {
        body.title = title;
        body.content = content;
        body.status = 'draft';
      }

      const response = await fetch('/api/agent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.error || 'Something went wrong');
        return;
      }

      const formatted =
        typeof data.data === 'string'
          ? data.data
          : JSON.stringify(data.data, null, 2);

      setResult(formatted);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>WP AI Agent</h1>
        <p style={styles.subtitle}>
          Generate, analyze, translate and publish WordPress content using AI.
        </p>
      </header>

      <section style={styles.card}>
        <label style={styles.label}>
          <span>Action</span>
          <select
            value={action}
            onChange={(e) => setAction(e.target.value as AgentAction)}
            style={styles.input}
          >
            <option value="generate">Generate content</option>
            <option value="analyze-seo">Analyze SEO</option>
            <option value="translate">Translate</option>
            <option value="publish">Publish</option>
            <option value="test-connection">Test connection</option>
          </select>
        </label>

        {action === 'generate' && (
          <label style={styles.label}>
            <span>Topic</span>
            <input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              style={styles.input}
            />
          </label>
        )}

        {(action === 'generate' || action === 'analyze-seo') && (
          <label style={styles.label}>
            <span>Keyword</span>
            <input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              style={styles.input}
            />
          </label>
        )}

        {(action === 'analyze-seo' ||
          action === 'translate' ||
          action === 'publish') && (
          <label style={styles.label}>
            <span>Content</span>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
              style={styles.textarea}
            />
          </label>
        )}

        {action === 'translate' && (
          <label style={styles.label}>
            <span>Target Language</span>
            <input
              value={targetLanguage}
              onChange={(e) => setTargetLanguage(e.target.value)}
              style={styles.input}
            />
          </label>
        )}

        {action === 'publish' && (
          <label style={styles.label}>
            <span>Title</span>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={styles.input}
            />
          </label>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            padding: '0.75rem',
            borderRadius: '6px',
            border: 'none',
            background: '#111',
            color: '#fff',
            fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? 'Working...' : 'Run'}
        </button>

        {error && (
          <div style={styles.error}>
            {error}
          </div>
        )}

        {result && (
          <pre style={styles.result}>
            {result}
          </pre>
        )}
      </section>
    </main>
  );
}

/* ---------------- STYLES ---------------- */

const styles: Record<string, React.CSSProperties> = {
  container: {
    maxWidth: '720px',
    margin: '0 auto',
    padding: '2rem 1rem',
    fontFamily: 'system-ui, sans-serif',
  },
  header: {
    marginBottom: '2rem',
  },
  title: {
    fontSize: '1.8rem',
    fontWeight: 700,
  },
  subtitle: {
    color: '#666',
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  label: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.3rem',
  },
  input: {
    padding: '0.6rem',
    borderRadius: '6px',
    border: '1px solid #ccc', // ✅ FIXED
  },
  textarea: {
    padding: '0.6rem',
    borderRadius: '6px',
    border: '1px solid #ccc',
  },
  error: {
    padding: '1rem',
    background: '#ffe5e5',
    color: '#900',
    borderRadius: '6px',
  },
  result: {
    padding: '1rem',
    background: '#f4f4f4',
    borderRadius: '6px',
    overflowX: 'auto',
    whiteSpace: 'pre-wrap',
  },
};
