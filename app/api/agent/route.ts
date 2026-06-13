import { NextRequest, NextResponse } from 'next/server';

import { writeContent } from '../../../tools/content-writer';
import { analyzeSEO } from '../../../tools/seo-analyzer';
import { translateContent } from '../../../tools/translator';

import {
  createPost,
  testConnection,
} from '../../../api/wordpress-client';

type AgentAction =
  | 'generate'
  | 'analyze-seo'
  | 'translate'
  | 'publish'
  | 'test-connection';

export interface AgentRequestBody {
  action: AgentAction;
  topic?: string;
  content?: string;
  keywords?: string[];
  targetLanguage?: string;
  sourceLanguage?: string;
  title?: string;
  status?: 'publish' | 'draft' | 'pending' | 'private';
}

function success(data: unknown) {
  return NextResponse.json({ success: true, data });
}

function error(message: string, status = 400) {
  return NextResponse.json(
    { success: false, error: message },
    { status }
  );
}

export async function POST(request: NextRequest) {
  try {
    const body: AgentRequestBody = await request.json();

    if (!body.action) return error('Action is required');

    switch (body.action) {
      case 'generate': {
        if (!body.topic?.trim()) return error('Topic is required');

        const result = await writeContent({
          topic: body.topic,
          keywords: body.keywords ?? [],
        });

        return success(result);
      }

      case 'analyze-seo': {
        if (!body.content?.trim()) return error('Content is required');

        const keyword = body.keywords?.[0];
        if (!keyword) return error('Keyword is required');

        const result = await analyzeSEO({
          content: body.content,
          targetKeyword: keyword,
        });

        return success(result);
      }

      case 'translate': {
        if (!body.content?.trim()) return error('Content is required');
        if (!body.targetLanguage?.trim())
          return error('Target language is required');

        const result = await translateContent({
          content: body.content,
          targetLanguage: body.targetLanguage,
          sourceLanguage: body.sourceLanguage ?? 'English',
        });

        return success(result);
      }

      case 'publish': {
        if (!body.title?.trim() || !body.content?.trim()) {
          return error('Title and content are required');
        }

        const result = await createPost({
          title: body.title,
          content: body.content,
          status: body.status ?? 'draft',
        });

        return success(result);
      }

      case 'test-connection': {
        const connected = await testConnection();
        return success({ connected });
      }

      default:
        return error(`Unknown action: ${body.action}`);
    }
  } catch (err) {
    console.error('[WP_AGENT_ERROR]', err);

    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message: err instanceof Error ? err.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    service: 'WP AI Agent',
    status: 'active',
    version: '1.0.0',
    actions: [
      'generate',
      'analyze-seo',
      'translate',
      'publish',
      'test-connection',
    ],
  });
}
