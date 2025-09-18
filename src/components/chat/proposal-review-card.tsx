import type { GenerateReviewOutput } from '@/ai/flows/generate-review';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { ProgressCircle } from '@/components/ui/progress-circle';
import { Link } from 'lucide-react';

type ProposalReviewCardProps = {
  review: GenerateReviewOutput;
};

const criteriaLabels: Record<keyof Omit<GenerateReviewOutput, 'finalReviewComment' | 'projectSummary' | 'overallScore' | 'verdict' | 'thingsToClarify'>, string> = {
    alignmentWithGoals: 'Alignment with Deep Funding Goals',
    teamExperience: "Team's Experience",
    milestoneFeasibility: 'Milestone Feasibility',
    originalityOfIdea: 'Originality of Idea',
    budgetJustification: 'Budget Justification',
    ethicalConsiderations: 'Ethical Considerations',
};

const verdictVariant: Record<GenerateReviewOutput['verdict'], 'default' | 'destructive' | 'secondary'> = {
    'Accepted': 'default',
    'Rejected': 'destructive',
    'Interview Required': 'secondary',
    'Accepted, Interview Recommended': 'default',
    'Rejected, Interview Recommended': 'destructive',
};

export default function ProposalReviewCard({ review }: ProposalReviewCardProps) {
  const accordionItems = [
    ...Object.entries(criteriaLabels).map(([key, label]) => ({
      value: key,
      label: label,
      content: review[key as keyof typeof criteriaLabels],
    })),
    {
      value: 'thingsToClarify',
      label: review.verdict === 'Accepted' ? 'Things to look out for when reviewing' : 'Things to Clarify for Interview',
      content: review.thingsToClarify,
    },
  ];


  return (
    <div className="w-full">
        <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-4">
                <div>
                    <h3 className="font-semibold text-lg">Project Summary</h3>
                    <p className="text-muted-foreground text-sm">{review.projectSummary}</p>
                </div>
                <div>
                    <h3 className="font-semibold text-lg">Overall Feedback</h3>
                    <p className="text-muted-foreground text-sm">{review.finalReviewComment}</p>
                </div>
            </div>
            <div className="flex flex-col items-center justify-center gap-4 bg-muted/50 p-4 rounded-lg">
                <h3 className="font-semibold text-lg">Verdict</h3>
                <ProgressCircle value={review.overallScore} />
                <Badge variant={verdictVariant[review.verdict]} className="text-sm px-3 py-1 text-center">{review.verdict}</Badge>
            </div>
        </div>
        <Accordion type="multiple" className="w-full">
            {accordionItems.map((item) => (
              item.content && (
                <AccordionItem value={item.value} key={item.value}>
                    <AccordionTrigger>{item.label}</AccordionTrigger>
                    <AccordionContent className="whitespace-pre-wrap">
                       {item.content}
                    </AccordionContent>
                </AccordionItem>
              )
            ))}
        </Accordion>
    </div>
  );
}
