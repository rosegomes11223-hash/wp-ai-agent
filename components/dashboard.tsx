'use client';

import { useState } from 'react';

type AgentAction =
  | 'generate'
  | 'analyze-seo'
  | 'translate'
  | 'publish'
  | 'test-connection';

export default function Dashboard() {
  const [action, setAction] = useState<AgentAction>('generate');
  const [topic, setTopic] = useState('');
  const [content, setContent] = useState('');
  const [keyword, setKeyword] = useState('');
  const [targetLanguage, setTargetLanguage] = useState('');
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>('');
  const [error, setError] = useState<string>('');

  async function handleSubmit() {
    setLoading(true);
    setError('');
    setResult('');

    try {
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

      const res = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.error || 'Something went wrong');
      } else {
        setResult(
          typeof data.data === 'string'
            ? data.data
            : JSON.stringify(data.data, null, 2)
        );
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        maxWidth: '900px',
        margin: '0 auto',
        padding: '2rem 1rem',
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>
          WP AI Agent Dashboard
        </h1>
        <p style={{ color: '#6b7280' }}>
          Generate, optimize, translate, and publish WordPress content with AI
        </p>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <select
          value={action}
          onChange={(e) => setAction(e.target.value as AgentAction)}
          style={{ padding: '0.6rem', borderRadius: '6px' }}
        >
          <option value="generate">Generate Content</option>
          <option value="analyze-seo">Analyze SEO</option>
          <option value="translate">Translate</option>
          <option value="publish">Publish</option>
          <option value="test-connection">Test Connection</option>
        </select>

        {(action === 'generate' || action === 'analyze-seo') && (
          <input
            placeholder="Keyword"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            style={{ padding: '0.6rem', borderRadius: '6px' }}
          />
        )}

        {action === 'generate' && (
          <input
            placeholder="Topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            style={{ padding: '0.6rem', borderRadius: '6px' }}
          />
        )}

        {(action === 'analyze-seo' ||
          action === 'translate' ||
          action === 'publish') && (
          <textarea
            placeholder="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={5}
            style={{ padding: '0.6rem', borderRadius: '6px' }}
          />
        )}

        {action === 'translate' && (
          <input
            placeholder="Target Language"
            value={targetLanguage}
            onChange={(e) => setTargetLanguage(e.target.value)}
            style={{ padding: '0.6rem', borderRadius: '6px' }}
          />
        )}

        {action === 'publish' && (
          <input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ padding: '0.6rem', borderRadius: '6px' }}
          />
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            padding: '0.8rem',
            borderRadius: '6px',
            background: '#111827',
            color: '#fff',
            fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'Processing...' : 'Run Agent'}
        </button>

        {/* Error */}
        {error && (
          <div style={{ color: 'red', fontSize: '0.9rem' }}>{error}</div>
        )}

        {/* Result */}
        {result && (
          <pre
            style={{
              background: '#f3f4f6',
              padding: '1rem',
              borderRadius: '6px',
              overflowX: 'auto',
            }}
          >
            {result}
          </pre>
        )}
      </div>
    </div>
  );
}
