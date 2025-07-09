// src/ai/flows/aptitude-profile-creation.ts
'use server';

/**
 * @fileOverview Creates an initial aptitude profile for a new user based on their assessment responses.
 *
 * - createAptitudeProfile - A function that creates the aptitude profile.
 * - CreateAptitudeProfileInput - The input type for the createAptitudeProfile function.
 * - CreateAptitudeProfileOutput - The return type for the createAptitudeProfile function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CreateAptitudeProfileInputSchema = z.object({
  assessmentResponses: z
    .string()
    .describe('The responses from the user to the gamified assessment.'),
});
export type CreateAptitudeProfileInput = z.infer<typeof CreateAptitudeProfileInputSchema>;

const CreateAptitudeProfileOutputSchema = z.object({
  aptitudeProfile: z
    .string()
    .describe('A detailed aptitude profile of the user, summarizing their strengths, weaknesses, and suitable job categories.'),
});
export type CreateAptitudeProfileOutput = z.infer<typeof CreateAptitudeProfileOutputSchema>;

export async function createAptitudeProfile(input: CreateAptitudeProfileInput): Promise<CreateAptitudeProfileOutput> {
  return createAptitudeProfileFlow(input);
}

const prompt = ai.definePrompt({
  name: 'createAptitudeProfilePrompt',
  input: {schema: CreateAptitudeProfileInputSchema},
  output: {schema: CreateAptitudeProfileOutputSchema},
  prompt: `You are an AI career coach specializing in aptitude assessments.
  Based on the user's responses to the gamified assessment, create a detailed aptitude profile.
  Summarize their strengths, weaknesses, and list suitable job categories based on the assessment results.

  Assessment Responses: {{{assessmentResponses}}}
  `,
});

const createAptitudeProfileFlow = ai.defineFlow(
  {
    name: 'createAptitudeProfileFlow',
    inputSchema: CreateAptitudeProfileInputSchema,
    outputSchema: CreateAptitudeProfileOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
