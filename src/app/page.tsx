'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { SidebarProvider, Sidebar, SidebarInset } from '@/components/ui/sidebar';
import AppSidebar from '@/components/layout/app-sidebar';
import ChatView from '@/components/chat/chat-view';
import { mockChats, mockUser } from '@/lib/data';
import type { Chat } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { generateTitle } from '@/ai/flows/generate-title';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

// Mock authentication check
const useAuth = () => {
  const [isAuth, setIsAuth] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // This check will only run on the client side
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (!loggedIn) {
      router.push('/login');
    } else {
      setIsAuth(true);
    }
  }, [router]);

  return isAuth;
};

const CHATS_STORAGE_KEY = 'ai-review-assistant-chats';

export default function Home() {
  const isAuth = useAuth();
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [deleteChatId, setDeleteChatId] = useState<string | null>(null);

  // Load chats from localStorage on initial render
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedChats = localStorage.getItem(CHATS_STORAGE_KEY);
      if (savedChats) {
        setChats(JSON.parse(savedChats));
      } else {
        setChats(mockChats);
      }
    }
  }, []);

  // Save chats to localStorage whenever they change
  useEffect(() => {
    if (chats.length > 0) {
      localStorage.setItem(CHATS_STORAGE_KEY, JSON.stringify(chats));
    } else if (typeof window !== 'undefined') {
      // Clear storage if all chats are deleted
      localStorage.removeItem(CHATS_STORAGE_KEY);
    }
  }, [chats]);
  
  // Select a chat
  useEffect(() => {
    if (chats.length > 0 && !selectedChat) {
      setSelectedChat(chats[0]);
    }
    if (chats.length === 0) {
      setSelectedChat(null);
    }
  }, [chats, selectedChat]);

  const handleNewChat = () => {
    const newChat: Chat = {
      id: `chat-${Date.now()}`,
      title: 'New Proposal Review',
      userId: mockUser.id,
      createdAt: new Date().toISOString(),
      messages: [],
    };
    setChats(prev => [newChat, ...prev]);
    setSelectedChat(newChat);
  };

  const handleDeleteChat = (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent chat selection
    setDeleteChatId(chatId);
  };
  
  const confirmDelete = () => {
    if (!deleteChatId) return;

    setChats(prev => {
      const newChats = prev.filter(c => c.id !== deleteChatId);
      if (selectedChat?.id === deleteChatId) {
        setSelectedChat(newChats.length > 0 ? newChats[0] : null);
      }
      return newChats;
    });

    setDeleteChatId(null);
  };


  const updateChatTitle = async (chatId: string, proposalText: string, verdict?: string) => {
    try {
      const { title } = await generateTitle({ proposalText, verdict });
      setChats(prev =>
        prev.map(c => (c.id === chatId ? { ...c, title } : c))
      );
    } catch (error) {
      console.error('Error generating title:', error);
      // Fallback title
      setChats(prev =>
        prev.map(c => (c.id === chatId ? { ...c, title: 'Proposal Review' } : c))
      );
    }
  };

  const handleChatUpdate = (updatedChat: Chat) => {
    setChats(prev =>
      prev.map(c => (c.id === updatedChat.id ? updatedChat : c))
    );
    setSelectedChat(updatedChat);
  };


  if (!isAuth) {
    return (
       <div className="flex h-screen w-full items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <Sidebar variant="sidebar" collapsible="icon">
        <AppSidebar
          user={mockUser}
          chats={chats}
          selectedChatId={selectedChat?.id}
          onSelectChat={(chat) => setSelectedChat(chat)}
          onNewChat={handleNewChat}
          onDeleteChat={handleDeleteChat}
        />
      </Sidebar>
      <SidebarInset>
        <ChatView 
          key={selectedChat?.id}
          chat={selectedChat} 
          onChatUpdate={handleChatUpdate}
          onNewMessage={updateChatTitle}
        />
      </SidebarInset>
      <AlertDialog open={!!deleteChatId} onOpenChange={(open) => !open && setDeleteChatId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this chat.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteChatId(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SidebarProvider>
  );
}
