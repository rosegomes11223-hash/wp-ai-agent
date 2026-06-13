// SEO Analyzer Tool
// Enterprise-grade SEO analysis for multilingual WordPress content

import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export interface SEORequest {
  content: string;
  targetKeyword: string;
  language?: string;
}

export interface SEOResult {
  score: number;
  suggestions: string[];
  improvedTitle: string;
  metaDescription: string;
  focusKeywords: string[];
}

function validateSEOResult(data: unknown): SEOResult {
  const result = data as SEOResult;

  if (
    typeof result.score !== 'number' ||
    !Array.isArray(result.suggestions) ||
    typeof result.improvedTitle !== 'string' ||
    typeof result.metaDescription !== 'string' ||
    !Array.isArray(result.focusKeywords)
  ) {
    throw new Error('Invalid SEO response structure');
  }

  return result;
}

export async function analyzeSEO({
  content,
  targetKeyword,
  language = 'English',
}: SEORequest): Promise<SEOResult> {
  if (!content.trim()) {
    throw new Error('Content cannot be empty');
  }

  if (!targetKeyword.trim()) {
    throw new Error('Target keyword cannot be empty');
  }

  try {
    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 2000,
      system: `
You are a senior SEO strategist.

Rules:
- Respond with valid JSON only
- No markdown
- No explanations outside JSON
- Score content from 0-100
- Provide actionable SEO improvements
- Generate SEO-friendly title and meta description
      `,
      messages: [
        {
          role: 'user',
          content: `
Analyze the following content.

Content:
${content}

Target Keyword:
${targetKeyword}

Language:
${language}

Return:
{
  "score": number,
  "suggestions": string[],
  "improvedTitle": string,
  "metaDescription": string,
  "focusKeywords": string[]
}
          `,
        },
      ],
    });

    const response = message.content[0];

    if (response.type !== 'text') {
      throw new Error('Unexpected response format');
    }

    const parsed = JSON.parse(response.text);

    return validateSEOResult(parsed);
  } catch (error) {
    console.error('SEO analysis failed:', error);
    throw new Error('Failed to analyze SEO');
  }
}
