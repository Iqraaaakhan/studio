'use server';

/**
 * @fileOverview Generates a personalized learning path based on a user's aptitude profile.
 *
 * - generateLearningPath - A function that generates a list of recommended learning modules.
 * - LearningPathInput - The input type for the generateLearningPath function.
 * - LearningPathOutput - The return type for the generateLearningPath function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const LearningPathInputSchema = z.object({
  aptitudeProfile: z.string().describe("The user's AI-generated aptitude profile."),
  availableModules: z.array(z.string()).describe('A list of available learning module titles.'),
});
export type LearningPathInput = z.infer<typeof LearningPathInputSchema>;

export const LearningPathOutputSchema = z.object({
  recommendedModules: z
    .array(
      z.object({
        title: z.string().describe('The title of the recommended module.'),
        reason: z.string().describe('A brief reason why this module is recommended for the user.'),
      })
    )
    .describe('A list of personalized learning module recommendations.'),
});
export type LearningPathOutput = z.infer<typeof LearningPathOutputSchema>;

export async function generateLearningPath(input: LearningPathInput): Promise<LearningPathOutput> {
  return generateLearningPathFlow(input);
}

const prompt = ai.definePrompt({
  name: 'learningPathPrompt',
  input: {schema: LearningPathInputSchema},
  output: {schema: LearningPathOutputSchema},
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
    inputSchema: LearningPathInputSchema,
    outputSchema: LearningPathOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
