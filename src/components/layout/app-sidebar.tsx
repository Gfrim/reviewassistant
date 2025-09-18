'use client';
import { SidebarHeader, SidebarContent, SidebarFooter } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlusCircle, Search } from 'lucide-react';
import { Logo } from '@/components/general/logo';
import UserNav from './user-nav';
import ChatList from '../chat/chat-list';
import type { User, Chat } from '@/lib/types';
import { useState } from 'react';

type AppSidebarProps = {
  user: User;
  chats: Chat[];
  selectedChatId?: string;
  onSelectChat: (chat: Chat) => void;
  onNewChat: () => void;
  onDeleteChat: (chatId: string, e: React.MouseEvent) => void;
};

export default function AppSidebar({ user, chats, selectedChatId, onSelectChat, onNewChat, onDeleteChat }: AppSidebarProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredChats = chats.filter(chat =>
    chat.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className='flex flex-col h-full'>
      <SidebarHeader className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <Logo />
        </div>
        <Button variant="default" className="w-full" onClick={onNewChat}>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Review
        </Button>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search chats..." 
            className="pl-9" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <ChatList 
          chats={filteredChats} 
          selectedChatId={selectedChatId} 
          onSelectChat={onSelectChat}
          onDeleteChat={onDeleteChat}
        />
      </SidebarContent>
      <SidebarFooter className="p-2">
        <UserNav user={user} />
      </SidebarFooter>
    </div>
  );
}
