'use client';
import type { Chat, Message, GenerateReviewOutput } from '@/lib/types';
import { generateReview } from '@/ai/flows/generate-review';
import React, { useState, useRef, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, Send } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import ProposalReviewCard from './proposal-review-card';
import { useToast } from '@/hooks/use-toast';
import { mockUser } from '@/lib/data';
import ChatExport from './chat-export';
import { Logo } from '../general/logo';
import { Skeleton } from '../ui/skeleton';

type ChatViewProps = {
  chat: Chat | null;
  onChatUpdate: (chat: Chat) => void;
  onNewMessage: (chatId: string, proposalText: string, verdict?: string) => void;
};

// A temp type to help with the ref
type ScrollAreaRefType = HTMLDivElement & {
  querySelector(selector: 'div[data-radix-scroll-area-viewport]'): HTMLDivElement | null;
};

export default function ChatView({ chat, onChatUpdate, onNewMessage }: ChatViewProps) {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const scrollAreaRef = useRef<ScrollAreaRefType>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
        if (viewport) {
            viewport.scrollTop = viewport.scrollHeight;
        }
    }
  }, [chat?.messages, isLoading]);

  const updateMessages = (messages: Message[], updatedChat?: Chat) => {
    const chatToUpdate = updatedChat || chat;
    if (chatToUpdate) {
      const newChatState = { ...chatToUpdate, messages };
      onChatUpdate(newChatState);
    }
  };

  const handleSendMessage = async (e?: React.FormEvent<HTMLFormElement>) => {
    if (e) e.preventDefault();
    if (!input.trim() || !chat) return;

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      role: 'user' as const,
      content: input,
      timestamp: new Date().toISOString(),
    };

    const isNewChat = chat.messages.length === 0;
    const currentChat = { ...chat, messages: [...chat.messages, userMessage] };
    onChatUpdate(currentChat);

    const proposalText = input;
    setInput('');
    setIsLoading(true);

    try {
      const review = await generateReview({ proposal: proposalText });
      
      if (isNewChat) {
        onNewMessage(chat.id, proposalText, review.verdict);
      }

      const reviewMessage: Message = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: review,
        timestamp: new Date().toISOString(),
      };

      updateMessages([...currentChat.messages, reviewMessage], currentChat);
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Error processing proposal',
        description: 'Something went wrong. Please try again.',
      });
      // Remove user message on error to allow retry
      updateMessages(currentChat.messages.slice(0, currentChat.messages.length - 1), currentChat);
    } finally {
      setIsLoading(false);
    }
  };

  if (!chat) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
        <Logo size="lg" />
        <h2 className="text-2xl font-semibold">Welcome to AI Review Assistant</h2>
        <p className="text-muted-foreground">Select a chat or start a new review to begin.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      <header className="flex items-center justify-between border-b p-4 shrink-0">
        <h2 className="text-xl font-semibold truncate">{chat.title}</h2>
        <ChatExport chat={chat} user={mockUser} />
      </header>
      <ScrollArea className="flex-1" ref={scrollAreaRef}>
        <div className="space-y-8 p-4 md:p-6">
          {chat.messages.map(message => (
            <div key={message.id} className={`flex gap-4`}>
              {message.role === 'assistant' ? (
                <Avatar className="h-8 w-8">
                  <AvatarFallback><Bot className="h-5 w-5"/></AvatarFallback>
                </Avatar>
              ) : (
                 <Avatar className="h-8 w-8">
                  <AvatarImage src={mockUser.avatarUrl} />
                  <AvatarFallback>{mockUser.name.charAt(0)}</AvatarFallback>
                </Avatar>
              )}
              <div className="flex-1">
                <p className="font-semibold mb-2">{message.role === 'assistant' ? 'AI Review Assistant' : 'You'}</p>
                <div className={`max-w-4xl rounded-lg p-4 ${message.role === 'user' ? 'bg-primary/10' : 'bg-card'}`}>
                    {typeof message.content === 'string' ? (
                    <p className="whitespace-pre-wrap">{message.content}</p>
                    ) : (
                    <ProposalReviewCard review={message.content as GenerateReviewOutput} />
                    )}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
             <div className="flex gap-4">
               <Avatar className="h-8 w-8"><AvatarFallback><Bot className="h-5 w-5" /></AvatarFallback></Avatar>
               <div className="flex-1">
                <p className="font-semibold mb-2">AI Review Assistant</p>
                <div className="max-w-4xl rounded-lg p-4 bg-card space-y-4">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                  <Skeleton className="h-4 w-[220px]" />
                </div>
               </div>
             </div>
          )}
        </div>
      </ScrollArea>
      <div className="border-t bg-background p-4 shrink-0">
        <form onSubmit={handleSendMessage}>
          <div className="relative">
            <Textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Paste your project proposal here..."
              className="min-h-[120px] pr-14 resize-none"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              disabled={isLoading}
            />
            <Button type="submit" size="icon" className="absolute bottom-3 right-3" disabled={isLoading || !input.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
