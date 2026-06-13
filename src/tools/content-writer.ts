// Content Writer Tool
// AI-powered multilingual content generation for WordPress publishing

import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export interface ContentRequest {
  topic: string;
  language?: string;
  targetAudience?: string;
  tone?: string;
}

export async function writeContent({
  topic,
  language = 'English',
  targetAudience = 'General Readers',
  tone = 'Professional',
}: ContentRequest): Promise<string> {
  if (!topic.trim()) {
    throw new Error('Topic cannot be empty');
  }

  try {
    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 2500,
      system: `
You are an expert content strategist and SEO writer.

Requirements:
- Produce original, high-quality content
- Optimize for SEO best practices
- Use clear structure and headings
- Write for the specified audience
- Maintain the requested tone
- Ensure readability and engagement
- Avoid keyword stuffing
- Return publication-ready content
      `,
      messages: [
        {
          role: 'user',
          content: `
Topic: ${topic}
Language: ${language}
Target Audience: ${targetAudience}
Tone: ${tone}

Create:
1. SEO Title
2. Meta Description
3. Introduction
4. Main Content Sections
5. Key Takeaways
6. Conclusion
7. Suggested Tags
          `,
        },
      ],
    });

    const content = message.content[0];

    if (content.type === 'text') {
      return content.text.trim();
    }

    throw new Error('Unexpected response format');
  } catch (error) {
    console.error('Content generation failed:', error);
    throw new Error('Failed to generate content');
  }
}
