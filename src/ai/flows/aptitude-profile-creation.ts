// src/ai/flows/aptitude-profile-creation.ts
'use server';

/**
 * @fileOverview Creates a comprehensive, personalized aptitude profile for a new user based on their multi-round assessment responses.
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
    .describe('A detailed JSON string of the user\'s responses to the multi-round gamified assessment.'),
  language: z.string().describe("The preferred language for the output (e.g., 'en', 'hi', 'kn')."),
});
export type CreateAptitudeProfileInput = z.infer<typeof CreateAptitudeProfileInputSchema>;

const CreateAptitudeProfileOutputSchema = z.object({
  aptitudeProfile: z
    .string()
    .describe('A detailed aptitude profile summary of the user in the specified language. It should start with a skill level classification (Beginner, Explorer, or Ready) followed by a summary of their strengths, weaknesses, and a recommended career track based on the assessment.'),
});
export type CreateAptitudeProfileOutput = z.infer<typeof CreateAptitudeProfileOutputSchema>;

export async function createAptitudeProfile(input: CreateAptitudeProfileInput): Promise<CreateAptitudeProfileOutput> {
  return createAptitudeProfileFlow(input);
}

const prompt = ai.definePrompt({
  name: 'createAptitudeProfilePrompt',
  input: {schema: CreateAptitudeProfileInputSchema},
  output: {schema: CreateAptitudeProfileOutputSchema},
  prompt: `You are an AI career coach specializing in creating empowering and encouraging aptitude profiles for rural youth and women in India.
  Based on the user's responses from the 5-round assessment, create a detailed aptitude profile.

  Your analysis MUST be in this language: {{{language}}}.

  The user's assessment data is provided here as a JSON string:
  "{{{assessmentResponses}}}"

  Here is a guide to interpreting the data:
  - Round 1 (Aptitude): Basic cognitive and logical skills.
  - Round 2 (Digital Literacy): Familiarity with digital tools.
  - Round 3 (Communication): Basic typing and self-expression.
  - Round 4 (Personality): Work style and career preferences.
  - Round 5 (Skill Challenge): Practical application of a preferred skill.

  Your generated profile should have two parts:
  1.  **Skill Level**: Start the entire profile with one of these three classifications, followed by a newline: "Skill Level: Beginner", "Skill Level: Explorer", or "Skill Level: Ready".
      - "Beginner": The user is new to many concepts and needs foundational skills.
      - "Explorer": The user has some basic skills and is ready to explore specific paths.
      - "Ready": The user has good foundational skills and is ready for job-specific training.
  2.  **Profile Summary**: After the skill level, write a positive and encouraging summary.
      - Highlight their strengths discovered from the personality and skill challenge rounds.
      - Gently mention areas for growth based on aptitude and digital literacy scores.
      - Recommend a primary career track (e.g., Digital Marketing, Online Selling, Data Entry, Graphic Design) based on their personality and skills.
      - Keep the language simple, positive, and motivational.
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
    if (!output) {
      throw new Error('AI failed to generate an aptitude profile.');
    }
    return output;
  }
);
