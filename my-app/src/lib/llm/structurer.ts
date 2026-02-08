import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { z } from 'zod';
import { SlideBlueprint, SlideType } from '@/types/slide';
import { STRUCTURER_SYSTEM_PROMPT, FEW_SHOT_EXAMPLES } from './prompts';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '');

const ContentBlockSchema = z.object({
  type: z.enum(['text', 'metric', 'list', 'chart_data', 'comparison_item']),
  label: z.string().optional(),
  value: z.union([z.string(), z.number()]),
  subtext: z.string().optional(),
  emphasis: z.enum(['high', 'medium', 'low']).optional(),
  items: z.array(z.string()).optional(),
});

const SlideBlueprintSchema = z.object({
  slideTitle: z.string(),
  keyMessage: z.string(),
  contentBlocks: z.array(ContentBlockSchema),
  suggestedLayout: z.enum([
    'auto', 'executive_summary', 'horizontal_flow', 'two_by_two_matrix',
    'comparison_table', 'data_chart', 'multi_metric', 'issue_tree',
    'timeline', 'graph_chart'
  ]),
  footnote: z.string().optional(),
  source: z.string().optional(),
});

export async function structureContent(
  text: string,
  message: string,
  data?: string,
  preferredModel: 'openai' | 'gemini' = 'openai'
): Promise<{ blueprint: SlideBlueprint; modelUsed: string }> {
  const userPrompt = buildUserPrompt(text, message, data);
  
  try {
    if (preferredModel === 'openai') {
      return await structureWithOpenAI(userPrompt);
    } else {
      return await structureWithGemini(userPrompt);
    }
  } catch (error) {
    // Fallback to Gemini if OpenAI fails
    if (preferredModel === 'openai') {
      console.log('OpenAI failed, falling back to Gemini');
      return await structureWithGemini(userPrompt);
    }
    throw error;
  }
}

function buildUserPrompt(text: string, message: string, data?: string): string {
  let prompt = `Context/Background:\n${text}\n\nKey Message/Takeaway:\n${message}`;
  
  if (data) {
    prompt += `\n\nData/Metrics:\n${data}`;
  }
  
  prompt += `\n\nConvert this into a structured SlideBlueprint JSON object.`;
  
  return prompt;
}

async function structureWithOpenAI(userPrompt: string): Promise<{ blueprint: SlideBlueprint; modelUsed: string }> {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: STRUCTURER_SYSTEM_PROMPT },
      { role: 'user', content: JSON.stringify(FEW_SHOT_EXAMPLES[0].input) },
      { role: 'assistant', content: JSON.stringify(FEW_SHOT_EXAMPLES[0].output) },
      { role: 'user', content: userPrompt },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.3,
    max_tokens: 2000,
  });
  
  const content = response.choices[0].message.content;
  if (!content) {
    throw new Error('OpenAI returned empty response');
  }
  
  const parsed = JSON.parse(content);
  const validated = SlideBlueprintSchema.parse(parsed);
  
  return {
    blueprint: validated as SlideBlueprint,
    modelUsed: 'gpt-4o',
  };
}

async function structureWithGemini(userPrompt: string): Promise<{ blueprint: SlideBlueprint; modelUsed: string }> {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
  
  const fullPrompt = `${STRUCTURER_SYSTEM_PROMPT}\n\nExample:\nInput: ${JSON.stringify(FEW_SHOT_EXAMPLES[0].input)}\nOutput: ${JSON.stringify(FEW_SHOT_EXAMPLES[0].output)}\n\nNow process this input:\n${userPrompt}`;
  
  const result = await model.generateContent({
    contents: [{ role: 'user', parts: [{ text: fullPrompt }] }],
    generationConfig: {
      temperature: 0.3,
      maxOutputTokens: 2000,
    },
  });
  
  const content = result.response.text();
  
  // Extract JSON from the response (Gemini might wrap it in markdown)
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('Gemini returned invalid JSON');
  }
  
  const parsed = JSON.parse(jsonMatch[0]);
  const validated = SlideBlueprintSchema.parse(parsed);
  
  return {
    blueprint: validated as SlideBlueprint,
    modelUsed: 'gemini-2.0-flash-exp',
  };
}
