import type { GenerateReviewOutput as GenkitGenerateReviewOutput } from '@/ai/flows/generate-review';

export type User = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
};

// We create a new type to ensure the verdict is one of the allowed values.
export type GenerateReviewOutput = Omit<GenkitGenerateReviewOutput, 'verdict'> & {
    verdict: 'Accepted' | 'Rejected' | 'Interview Required' | 'Accepted, Interview Recommended' | 'Rejected, Interview Recommended';
    originalityOfIdea: string;
};

export type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string | GenerateReviewOutput;
  timestamp: string;
};

export type Chat = {
  id: string;
  title: string;
  messages: Message[];
  createdAt: string;
  userId: string;
};
