'use server';

/**
 * @fileOverview Generates a clever, short, and meaningful title from a project proposal.
 *
 * - generateTitle - A function that generates a title for the proposal.
 * - GenerateTitleInput - The input type for the generateTitle function.
 * - GenerateTitleOutput - The return type for the generateTitle function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateTitleInputSchema = z.object({
  proposalText: z.string().describe('The text of the project proposal.'),
  verdict: z.string().describe('The final verdict for the proposal (e.g., "Accepted", "Rejected").').optional(),
});
export type GenerateTitleInput = z.infer<typeof GenerateTitleInputSchema>;

const GenerateTitleOutputSchema = z.object({
  title: z.string().describe('A clever, short, and meaningful title for the project proposal.'),
});
export type GenerateTitleOutput = z.infer<typeof GenerateTitleOutputSchema>;

export async function generateTitle(input: GenerateTitleInput): Promise<GenerateTitleOutput> {
  return generateTitleFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateTitlePrompt',
  input: {schema: GenerateTitleInputSchema},
  output: {schema: GenerateTitleOutputSchema},
  model: 'googleai/gemini-1.5-flash',
  config: {
    temperature: 0.3,
  },
  prompt: `Generate a clever, short, and meaningful title for the following project proposal.

Follow these rules:
- The title should be under 6 words.
- If the proposal has a clear title, use or adapt it.
- Otherwise, extract a key phrase, project name, use case, or theme.
- The title should feel smart and memorable (e.g., "Memory-Augmented Machines," not "Proposal Review").
{{#if verdict}}
- The verdict is '{{verdict}}'. If the verdict is 'Rejected', you can optionally make the title a bit cheeky (e.g., "Nope for Now: PrivacyBot").
{{/if}}

Proposal:
{{{proposalText}}}`, 
});

const generateTitleFlow = ai.defineFlow(
  {
    name: 'generateTitleFlow',
    inputSchema: GenerateTitleInputSchema,
    outputSchema: GenerateTitleOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
