// Translator Tool
// Enterprise-grade multilingual translation service

import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export interface TranslationRequest {
  content: string;
  targetLanguage: string;
  sourceLanguage?: string;
}

export interface TranslationResult {
  translatedContent: string;
  sourceLanguage: string;
  targetLanguage: string;
  wordCount: number;
}

function countWords(text: string): number {
  return text
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

export async function translateContent({
  content,
  targetLanguage,
  sourceLanguage = 'English',
}: TranslationRequest): Promise<TranslationResult> {
  if (!content.trim()) {
    throw new Error('Content cannot be empty');
  }

  if (!targetLanguage.trim()) {
    throw new Error('Target language cannot be empty');
  }

  try {
    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 3000,
      system: `
You are a professional multilingual translator.

Requirements:
- Preserve meaning, tone, and intent
- Preserve headings and formatting
- Preserve lists, markdown, and HTML structure
- Use natural native-level language
- Do not summarize
- Do not add commentary
- Return only translated content
      `,
      messages: [
        {
          role: 'user',
          content: `
Source Language: ${sourceLanguage}
Target Language: ${targetLanguage}

Translate the following content exactly while preserving formatting:

${content}
          `,
        },
      ],
    });

    const response = message.content[0];

    if (response.type !== 'text') {
      throw new Error('Unexpected response format');
    }

    const translatedContent = response.text.trim();

    return {
      translatedContent,
      sourceLanguage,
      targetLanguage,
      wordCount: countWords(translatedContent),
    };
  } catch (error) {
    console.error('Translation failed:', error);
    throw new Error('Failed to translate content');
  }
}
