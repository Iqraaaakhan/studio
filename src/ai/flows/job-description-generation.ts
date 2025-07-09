'use server';

/**
 * @fileOverview Generates job descriptions based on industry trends and required skills.
 *
 * - generateJobDescription - A function that generates a job description.
 * - JobDescriptionInput - The input type for the generateJobDescription function.
 * - JobDescriptionOutput - The return type for the generateJobDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const JobDescriptionInputSchema = z.object({
  jobTitle: z.string().describe('The title of the job.'),
  industryTrends: z.string().describe('Current industry trends relevant to the job.'),
  requiredSkills: z.string().describe('A comma-separated list of required skills for the job.'),
});
export type JobDescriptionInput = z.infer<typeof JobDescriptionInputSchema>;

const JobDescriptionOutputSchema = z.object({
  jobDescription: z.string().describe('A detailed job description.'),
});
export type JobDescriptionOutput = z.infer<typeof JobDescriptionOutputSchema>;

export async function generateJobDescription(input: JobDescriptionInput): Promise<JobDescriptionOutput> {
  return generateJobDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'jobDescriptionPrompt',
  input: {schema: JobDescriptionInputSchema},
  output: {schema: JobDescriptionOutputSchema},
  prompt: `You are an expert HR specialist. Generate a job description based on the following information:

Job Title: {{{jobTitle}}}
Industry Trends: {{{industryTrends}}}
Required Skills: {{{requiredSkills}}}

Write a detailed and engaging job description that attracts qualified candidates.`,
});

const generateJobDescriptionFlow = ai.defineFlow(
  {
    name: 'generateJobDescriptionFlow',
    inputSchema: JobDescriptionInputSchema,
    outputSchema: JobDescriptionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
