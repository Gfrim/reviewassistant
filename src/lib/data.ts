import type { User, Chat } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const userAvatar = PlaceHolderImages.find(img => img.id === 'user-avatar-1')?.imageUrl || 'https://picsum.photos/seed/user1/200/200';

export const mockUser: User = {
  id: '1',
  name: 'Alex Doe',
  email: 'alex.doe@example.com',
  avatarUrl: userAvatar,
};

export const mockChats: Chat[] = [
  {
    id: 'chat-1',
    title: 'Quantum Computing Proposal',
    userId: '1',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    messages: [
      {
        id: 'msg-1',
        role: 'user',
        content: 'Here is my proposal for a quantum computing project aiming to build a 12-qubit processor. The team is composed of PhDs from leading universities and we require a budget of $5M for equipment and salaries over 3 years. We believe this aligns with your goal of funding high-risk, high-reward research.',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'msg-2',
        role: 'assistant',
        content: {
          projectSummary: 'The project aims to build a 12-qubit quantum processor with a team of PhDs, seeking $5M over 3 years for high-risk, high-reward research.',
          alignmentWithGoals: 'The proposal aligns well with our goals in advancing fundamental research. The high-risk, high-reward nature of quantum computing is exactly what we look for.',
          teamExperience: 'The team consists of renowned experts in quantum physics, which is a strong plus. Their publication history demonstrates significant contributions to the field.',
          milestoneFeasibility: 'The milestones seem ambitious but achievable given the team\'s expertise. A more detailed GANTT chart would be beneficial.',
          originalityOfIdea: 'While quantum computing is not a new field, the proposal to build a 12-qubit processor with a novel architecture is highly innovative.',
          budgetJustification: 'The budget is well-detailed but lacks specific vendor quotes for the high-cost equipment. More justification is needed for the requested $5M.',
          ethicalConsiderations: 'Ethical considerations are briefly mentioned but need a more in-depth section regarding data security and potential misuse of the technology.',
          thingsToClarify: '1. Can you provide specific vendor quotes for the major equipment purchases?\\n2. Could you elaborate on the GANTT chart for the first year?\\n3. What are the specific roles of each team member?',
          finalReviewComment: 'A promising proposal that needs some refinement in the budget justification and ethical considerations sections. The team\'s strength is a major asset.',
          overallScore: 72,
          verdict: 'Accepted, Interview Recommended',
        },
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 5 * 60 * 1000).toISOString(),
      },
    ],
  },
  {
    id: 'chat-2',
    title: 'AI in Healthcare Initiative',
    userId: '1',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    messages: [
       {
        id: 'msg-3',
        role: 'user',
        content: 'This proposal outlines a plan to use AI for diagnostic imaging in rural healthcare settings. Our team includes radiologists and AI experts. The budget is primarily for data acquisition and model training infrastructure.',
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      },
       {
        id: 'msg-4',
        role: 'assistant',
        content: {
          projectSummary: 'The proposal plans to use AI for diagnostic imaging in rural areas, with a budget focused on data and infrastructure, and a team of radiologists and AI specialists.',
          alignmentWithGoals: 'Excellent alignment with our goal of societal impact through technology. Improving healthcare access is a key priority for our fund.',
          teamExperience: 'The team has a good mix of medical and AI professionals. The inclusion of practicing radiologists is a significant strength.',
          milestoneFeasibility: 'Milestones are realistic and well-defined, with clear KPIs for each phase of the project.',
          originalityOfIdea: 'The application of AI in diagnostic imaging is well-established, but the focus on rural healthcare settings presents a unique and impactful angle.',
          budgetJustification: 'The budget is reasonable and the breakdown for data and infrastructure costs is well justified.',
          ethicalConsiderations: 'A very strong section on patient data privacy, consent, and mitigating algorithmic bias. This shows a deep understanding of the challenges.',
          thingsToClarify: '1. Ensure that the data anonymization process is audited by a third party.\\n2. Monitor the model for any signs of performance drift over time.',
          finalReviewComment: 'A very strong and well-thought-out proposal. It addresses a critical need with a solid plan and expert team. Highly recommended for funding.',
          overallScore: 92,
          verdict: 'Accepted',
        },
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 5 * 60 * 1000).toISOString(),
      },
    ],
  },
];
