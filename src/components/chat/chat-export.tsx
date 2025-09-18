'use client';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FileDown, Mail, Share2 } from 'lucide-react';
import type { Chat, User, Message } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';

type ChatExportProps = {
  chat: Chat;
  user: User;
};

const formatForCSV = (chat: Chat) => {
  const header = 'Message ID,Timestamp,Role,Content\n';
  const rows = chat.messages.map(message => {
    const role = message.role;
    let content;
    if (typeof message.content === 'string') {
      content = `"${message.content.replace(/"/g, '""')}"`;
    } else {
      // Stringify the JSON object for the review
      content = `"${JSON.stringify(message.content).replace(/"/g, '""')}"`;
    }
    return [message.id, message.timestamp, role, content].join(',');
  }).join('\n');
  return header + rows;
}

export default function ChatExport({ chat, user }: ChatExportProps) {
  const { toast } = useToast();
  const [additionalEmails, setAdditionalEmails] = useState('');
  const [sendToSelf, setSendToSelf] = useState(true);
  const [sendToOthers, setSendToOthers] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleExport = (format: 'CSV' | 'PDF') => {
    if (format === 'CSV') {
        const csvData = formatForCSV(chat);
        const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', `${chat.title.replace(/ /g, '_')}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
        toast({
            title: 'Export Successful',
            description: `Your chat has been exported as a CSV file.`,
        });
    } else {
        // Mock PDF export functionality
        toast({
            title: 'Exporting Chat',
            description: `Your chat "${chat.title}" is being exported as a ${format} file.`,
        });
        console.log(`Exporting chat ${chat.id} as ${format}`);
    }
  };

  const handleShare = () => {
    const emails: string[] = [];
    if (sendToSelf) {
      emails.push(user.email);
    }
    if (sendToOthers) {
      const otherEmails = additionalEmails.split(',').map(e => e.trim()).filter(Boolean);
      emails.push(...otherEmails);
    }
    
    if (emails.length === 0) {
      toast({
        variant: 'destructive',
        title: 'No recipients selected',
        description: 'Please select at least one recipient.',
      });
      return;
    }

    toast({
      title: 'Sharing Chat',
      description: `An email with the chat "${chat.title}" has been sent to: ${emails.join(', ')}.`,
    });
    console.log(`Sharing chat ${chat.id} with ${emails.join(', ')}`);
    
    // Reset state and close dialog
    setAdditionalEmails('');
    setSendToOthers(false);
    setSendToSelf(true);
    setIsDialogOpen(false);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            <Share2 className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Share / Export</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => handleExport('CSV')}>
            <FileDown className="mr-2 h-4 w-4" />
            <span>Export as CSV</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleExport('PDF')}>
            <FileDown className="mr-2 h-4 w-4" />
            <span>Export as PDF</span>
          </DropdownMenuItem>
          <DialogTrigger asChild>
            <DropdownMenuItem onSelect={(e) => { e.preventDefault(); setIsDialogOpen(true); }}>
              <Mail className="mr-2 h-4 w-4" />
              <span>Share via Email</span>
            </DropdownMenuItem>
          </DialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Share Chat via Email</DialogTitle>
          <DialogDescription>
            Select who should receive the email with the chat content.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center space-x-2">
            <Checkbox id="send-self" checked={sendToSelf} onCheckedChange={(checked) => setSendToSelf(!!checked)} />
            <Label htmlFor="send-self" className="flex-grow">Send to myself ({user.email})</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="send-others" checked={sendToOthers} onCheckedChange={(checked) => setSendToOthers(!!checked)} />
            <Label htmlFor="send-others">Send to others</Label>
          </div>
          {sendToOthers && (
            <div className="grid grid-cols-4 items-center gap-4 pl-6">
                <Label htmlFor="additional-emails" className="text-right col-span-1">
                    Emails
                </Label>
                <Input
                    id="additional-emails"
                    value={additionalEmails}
                    onChange={(e) => setAdditionalEmails(e.target.value)}
                    placeholder="comma, separated"
                    className="col-span-3"
                />
            </div>
          )}
        </div>
        <DialogFooter>
            <Button type="button" onClick={handleShare}>Send</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
