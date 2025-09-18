'use server';

/**
 * @fileOverview This file contains the Genkit flow for analyzing project proposals and providing feedback based on predefined criteria.
 *
 * - generateReview - A function that accepts a project proposal and returns an analysis based on several criteria.
 * - GenerateReviewInput - The input type for the generateReview function.
 * - GenerateReviewOutput - The return type for the generateReview function.
 */

import {ai} from '@/ai/genkit';
import {searchGoogleScholar} from '@/ai/tools/google-scholar-search';
import {z} from 'genkit';

const GenerateReviewInputSchema = z.object({
  proposal: z.string().describe('The project proposal text to be analyzed.'),
});
export type GenerateReviewInput = z.infer<typeof GenerateReviewInputSchema>;

const GenerateReviewOutputSchema = z.object({
  projectSummary: z.string().describe("A concise summary of what the proposers are trying to do."),
  alignmentWithGoals: z.string().describe("Analysis of the proposal's alignment with Deep Funding's goals."),
  teamExperience: z.string().describe("Assessment of the team's experience and expertise."),
  milestoneFeasibility: z.string().describe('Evaluation of the feasibility of the proposed milestones.'),
  originalityOfIdea: z.string().describe('Assessment of the originality and innovation of the proposal, including a numeric score from 0-10.'),
  budgetJustification: z.string().describe('Review of the budget justification and allocation.'),
  ethicalConsiderations: z.string().describe('Assessment of the ethical considerations addressed in the proposal. Be lenient in this assessment.'),
  thingsToClarify: z.string().describe('A numbered list of specific questions that should be asked during an interview to get more clarity on the proposal. If the verdict is "Accepted", this should contain a list of "Things to look out for when reviewing".'),
  finalReviewComment: z.string().describe('Overall feedback and recommendations for the proposal.'),
  overallScore: z.number().min(0).max(100).describe('An overall score for the proposal, from 0 to 100.'),
  verdict: z.enum(['Accepted', 'Rejected', 'Interview Required', 'Accepted, Interview Recommended', 'Rejected, Interview Recommended']).describe('The final verdict for the proposal.'),
});
export type GenerateReviewOutput = z.infer<typeof GenerateReviewOutputSchema>;

export async function generateReview(
  input: GenerateReviewInput
): Promise<GenerateReviewOutput> {
  return generateReviewFlow(input);
}

const proposalReviewPrompt = ai.definePrompt({
  name: 'proposalReviewPrompt',
  input: {schema: GenerateReviewInputSchema},
  output: {schema: GenerateReviewOutputSchema},
  model: 'googleai/gemini-1.5-flash',
  tools: [searchGoogleScholar],
  config: {
    temperature: 0,
  },
  prompt: `Analyze the following project proposal based on the criteria below.

**About Deep Funding:**
Deep Funding is a decentralized grants program within the SingularityNET ecosystem, aimed at accelerating the development of beneficial Artificial General Intelligence (AGI) through community-driven innovation. It empowers individuals and teams across the globe to propose, review, and vote on AI and blockchain projects that align with the values and goals of SingularityNET. Proposals are funded in AGIX tokens, and voting weight is determined by a combination of token holdings and engagement in the community. Deep Funding uses mechanisms like quadratic voting and Community Engagement Scores (CES) to ensure fairness and prevent dominance by large stakeholders, encouraging participation from genuinely active contributors.

Beyond just funding, Deep Funding fosters a vibrant ecosystem of builders, reviewers, educators, and coordinators who collaboratively manage each funding round through structured processes. Proposal evaluation, milestone auditing, and governance experiments are handled by community-led circles, such as the Review Circle and Operations Circle. The program continues to evolve with improvements in tools (like AI-assisted review systems), governance (like pairwise and multi-criteria voting experiments), and education (via Deep Academy). Its overarching mission is to decentralize decision-making and build the foundation for AGI through open, inclusive, and merit-based participation.

Review the following project proposal based on these criteria:

- **Project Summary**: Create a concise summary of what the proposers are trying to do.
- **Alignment with Deep Funding goals**: Does the project contribute to the SingularityNET ecosystem and the development of beneficial AGI? Does it align with the decentralized, community-driven values of Deep Funding?
- **Team experience**: Does the team have the necessary skills and experience in AI, blockchain, or their proposed domain?
- **Milestone feasibility**: Are the proposed milestones realistic and well-defined?
- **Originality of Idea**: Assess the "Originality of the Proposal" by determining whether the core idea is novel or widely published. Use the \`searchGoogleScholar\` tool with key concepts from the proposal to find similar research. Based on the findings, provide a numeric score from 0-10, its interpretation, and a brief justification. The output for this section MUST be a single string.
    - **Formatting Requirement:** Start with the score, followed by the interpretation from the Scoring Guide, and then the justification. Example: "8/10 (Fairly Original) - The proposal presents a new approach with little prior documentation found in the search."
    - **Scoring Guide:**
        - **0–2 (Not Original):** Clear duplication or slight modification of existing, well-known work.
        - **3–5 (Somewhat Original):** Similar ideas exist, but this proposal shows minor innovation or new context.
        - **6–8 (Fairly Original):** The proposal presents a new approach or application with little prior documentation.
        - **9–10 (Highly Original):** No significant prior art found; concept appears to be novel and innovative.
- **Budget justification**: Is the budget (requested in AGIX) reasonable and well-justified for the work proposed?
- **Ethical considerations**: Does the proposal address potential ethical implications of the project? Be lenient and constructive in this area.
- **Things to Clarify / Things to look out for**: Based on your analysis, what specific questions should be asked during an interview to get more clarity? If the final verdict is 'Accepted', this field MUST be a list of "Things to look out for when reviewing". **This entire section must be a single string formatted as a numbered list (e.g., "1. First question\\n2. Second question"). Do NOT output a JSON array.**

Analyze the following proposal and provide a detailed, constructive analysis for each criterion. 
Also, provide an overall final review comment, an overall score from 0-100, and a final verdict.

**Verdict and Scoring Guidelines:**
Your verdict MUST be determined by the overallScore, following these strict rules:
- **Rejected**: Score must be less than 50.
- **Interview Required**: Score must be between 50 and 59 (inclusive).
- **Accepted, Interview Recommended**: Score must be between 60 and 75 (inclusive).
- **Accepted**: Score must be 76 or greater.

Proposal: {{{proposal}}}

The analysis should be detailed and constructive.
`,
});

const generateReviewFlow = ai.defineFlow(
  {
    name: 'generateReviewFlow',
    inputSchema: GenerateReviewInputSchema,
    outputSchema: GenerateReviewOutputSchema,
  },
  async input => {
    const {output} = await proposalReviewPrompt(input);
    return output!;
  }
);
