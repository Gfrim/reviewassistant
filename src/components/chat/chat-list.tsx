import { SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarMenuAction } from '@/components/ui/sidebar';
import type { Chat } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';
import { Trash2 } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

type ChatListProps = {
  chats: Chat[];
  selectedChatId?: string;
  onSelectChat: (chat: Chat) => void;
  onDeleteChat: (chatId: string, e: React.MouseEvent) => void;
};

export default function ChatList({ chats, selectedChatId, onSelectChat, onDeleteChat }: ChatListProps) {
  if (!chats.length) {
    return (
      <div className="p-4 text-center text-sm text-muted-foreground">
        No chats yet.
      </div>
    );
  }

  return (
    <SidebarMenu>
      <TooltipProvider>
        {chats.map(chat => (
          <SidebarMenuItem key={chat.id}>
            <Tooltip>
              <TooltipTrigger asChild>
                <SidebarMenuButton
                  onClick={() => onSelectChat(chat)}
                  isActive={selectedChatId === chat.id}
                  className="h-auto"
                >
                  <div className="flex w-full flex-col items-start gap-1 text-left">
                      <span className="font-medium truncate max-w-full">{chat.title}</span>
                      <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(chat.createdAt), { addSuffix: true })}
                      </span>
                  </div>
                </SidebarMenuButton>
              </TooltipTrigger>
              <TooltipContent>{chat.title}</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <SidebarMenuAction 
                  showOnHover 
                  onClick={(e) => onDeleteChat(chat.id, e)}
                  aria-label="Delete chat"
                >
                  <Trash2 />
                </SidebarMenuAction>
              </TooltipTrigger>
              <TooltipContent>Delete chat</TooltipContent>
            </Tooltip>
          </SidebarMenuItem>
        ))}
      </TooltipProvider>
    </SidebarMenu>
  );
}