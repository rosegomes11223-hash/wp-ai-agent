// WordPress AI Agent
// Orchestrates AI content generation for WordPress publishing workflows

import Anthropic from '@anthropic-ai/sdk';
import { WordPressClient } from '../api/wordpress-client';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const wp = new WordPressClient();

export async function runAgent(
  userRequest: string
): Promise<string> {
  if (!userRequest.trim()) {
    throw new Error('User request cannot be empty');
  }

  try {
    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      system: `
You are an expert WordPress content assistant.

Responsibilities:
- Generate high-quality blog content
- Support multilingual publishing
- Write SEO-friendly articles
- Create engaging headlines and summaries
- Maintain factual accuracy and readability
- Format content for WordPress publishing

Supported languages include Bengali, English, Arabic, Spanish, French, and others.
      `,
      messages: [
        {
          role: 'user',
          content: userRequest,
        },
      ],
    });

    const content = message.content[0];

    if (content.type === 'text') {
      return content.text;
    }

    throw new Error('Unexpected response format');
  } catch (error) {
    console.error('Agent execution failed:', error);
    throw new Error('Content generation failed');
  }
}

export { wp };
