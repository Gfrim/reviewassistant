import { BotMessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Logo({ size = 'md', className }: { size?: 'md' | 'lg', className?: string }) {
  const sizes = {
    md: { icon: 'h-6 w-6', text: 'text-xl' },
    lg: { icon: 'h-8 w-8', text: 'text-2xl' },
  }
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <BotMessageSquare className={`${sizes[size].icon} text-primary`} />
      <h1 className={`font-bold ${sizes[size].text} group-data-[collapsible=icon]:hidden`}>AI Review Assistant</h1>
    </div>
  );
}
