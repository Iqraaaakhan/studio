"use server";

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const prompt = ai.definePrompt({
  name: 'learningPathPrompt',
  input: { schema: z.object({
    aptitudeProfile: z.string(),
    availableModules: z.array(z.string()),
  })},
  output: { schema: z.object({
    recommendedModules: z.array(
      z.object({
        title: z.string(),
        reason: z.string(),
      })
    ),
  })},
  prompt: `You are an AI career coach. Your task is to recommend a personalized learning path for a user based on their aptitude profile and the available learning modules.
  Select up to 4 of the most relevant modules from the available list and provide a short, encouraging reason for each recommendation.

  User's Aptitude Profile:
  "{{{aptitudeProfile}}}"

  Available Learning Modules:
  {{#each availableModules}}
  - {{{this}}}
  {{/each}}

  Your recommendations should help the user build on their strengths and address any areas for development identified in their profile.
  `,
});

const generateLearningPathFlow = ai.defineFlow(
  {
    name: 'generateLearningPathFlow',
    inputSchema: z.object({
      aptitudeProfile: z.string(),
      availableModules: z.array(z.string()),
    }),
    outputSchema: z.object({
      recommendedModules: z.array(
        z.object({
          title: z.string(),
          reason: z.string(),
        })
      ),
    }),
  },
  async input => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error('AI failed to generate a learning path.');
    }
    return output;
  }
);

// Only export this async function!
export default async function generateLearningPath(input: {
  aptitudeProfile: string;
  availableModules: string[];
}) {
  return generateLearningPathFlow(input);
}
