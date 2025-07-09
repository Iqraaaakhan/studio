// src/ai/flows/job-mapping.ts
'use server';
/**
 * @fileOverview A job mapping AI agent. It takes an aptitude profile and returns relevant job opportunities.
 *
 * - jobMapping - A function that handles the job mapping process.
 * - JobMappingInput - The input type for the jobMapping function.
 * - JobMappingOutput - The return type for the jobMapping function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const JobMappingInputSchema = z.object({
  aptitudeProfile: z.string().describe('A detailed description of the user aptitude profile, including skills, experience, and preferences.'),
});
export type JobMappingInput = z.infer<typeof JobMappingInputSchema>;

const JobMappingOutputSchema = z.object({
  localOpportunities: z.array(
    z.object({
      title: z.string().describe('The job title.'),
      company: z.string().describe('The company name.'),
      location: z.string().describe('The city and state of the job.'),
      description: z.string().describe('A brief description of the job responsibilities.'),
    })
  ).describe('A list of relevant local job opportunities.'),
  remoteOpportunities: z.array(
    z.object({
      title: z.string().describe('The job title.'),
      company: z.string().describe('The company name.'),
      description: z.string().describe('A brief description of the job responsibilities.'),
    })
  ).describe('A list of relevant remote job opportunities.'),
});
export type JobMappingOutput = z.infer<typeof JobMappingOutputSchema>;

export async function jobMapping(input: JobMappingInput): Promise<JobMappingOutput> {
  return jobMappingFlow(input);
}

const prompt = ai.definePrompt({
  name: 'jobMappingPrompt',
  input: {schema: JobMappingInputSchema},
  output: {schema: JobMappingOutputSchema},
  prompt: `You are an AI job matching expert. Given the following aptitude profile, identify relevant job opportunities, both local and remote.

Aptitude Profile: {{{aptitudeProfile}}}

Format your response as a JSON object with two keys: localOpportunities and remoteOpportunities. Each key should be an array of job objects. Each job object should include the job title, company, location (if local), and a brief description.
`,
});

const jobMappingFlow = ai.defineFlow(
  {
    name: 'jobMappingFlow',
    inputSchema: JobMappingInputSchema,
    outputSchema: JobMappingOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
