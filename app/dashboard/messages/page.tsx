"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Send,
  Building,
  PlusCircle,
  ChevronRight,
  Paperclip,
  Smile,
  MoreHorizontal,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import PageWrapper from "@/components/custom/page-wrapper";
import { Title } from "@/components/custom/title";

type Contact = {
  id: string;
  name: string;
  role: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: boolean;
  isOnline: boolean;
};

type Message = {
  id: string;
  text: string;
  time: string;
  sender: "me" | "other";
  read: boolean;
};

const contacts: Contact[] = [
  {
    id: "1",
    name: "Property Manager",
    role: "Tech Tower",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage:
      "Sure, I can schedule a meeting with you to discuss the renovation plans for your office.",
    time: "10:23 AM",
    unread: true,
    isOnline: true,
  },
  // {
  //   id: "2",
  //   name: "Maintenance Team",
  //   role: "Building Services",
  //   avatar: "/placeholder.svg?height=40&width=40",
  //   lastMessage:
  //     "We've completed the repair of your AC unit. Please let us know if you're facing any issues.",
  //   time: "Yesterday",
  //   unread: false,
  //   isOnline: true,
  // },
  // {
  //   id: "3",
  //   name: "John Smith",
  //   role: "Tenant (Eastside Plaza)",
  //   avatar: "/placeholder.svg?height=40&width=40",
  //   lastMessage:
  //     "Hi, wanted to invite you to our company's open house event next Friday.",
  //   time: "Yesterday",
  //   unread: true,
  //   isOnline: false,
  // },
  // {
  //   id: "4",
  //   name: "Billing Department",
  //   role: "Administration",
  //   avatar: "/placeholder.svg?height=40&width=40",
  //   lastMessage:
  //     "Your latest invoice is now available. The due date is May 15th.",
  //   time: "2 days ago",
  //   unread: false,
  //   isOnline: false,
  // },
  // {
  //   id: "5",
  //   name: "Sarah Johnson",
  //   role: "Tenant (Tech Tower)",
  //   avatar: "/placeholder.svg?height=40&width=40",
  //   lastMessage: "Do you know if there's a courier service in the building?",
  //   time: "3 days ago",
  //   unread: false,
  //   isOnline: true,
  // },
];

const messages: Record<string, Message[]> = {
  "1": [
    {
      id: "m1",
      text: "Hello, I need to discuss some renovation plans for our office space. When would you be available?",
      time: "9:45 AM",
      sender: "me",
      read: true,
    },
    {
      id: "m2",
      text: "Hi there! I'd be happy to discuss your renovation plans. I'm available tomorrow between 10 AM and 2 PM. Would any time in that range work for you?",
      time: "10:02 AM",
      sender: "other",
      read: true,
    },
    {
      id: "m3",
      text: "11 AM tomorrow would be perfect. Should we meet at your office or ours?",
      time: "10:10 AM",
      sender: "me",
      read: true,
    },
    {
      id: "m4",
      text: "Sure, I can schedule a meeting with you to discuss the renovation plans for your office. Let's meet at your office so I can see the space. I'll bring our architect as well if that's okay with you.",
      time: "10:23 AM",
      sender: "other",
      read: false,
    },
  ],
  "2": [
    {
      id: "m1",
      text: "Our AC unit in the main office area isn't working properly. It's not cooling effectively.",
      time: "Yesterday, 2:30 PM",
      sender: "me",
      read: true,
    },
    {
      id: "m2",
      text: "Thank you for reporting this issue. We'll send a technician to check it today between 3-4 PM. Will someone be available to provide access?",
      time: "Yesterday, 2:45 PM",
      sender: "other",
      read: true,
    },
    {
      id: "m3",
      text: "Yes, I'll be in the office until 6 PM today.",
      time: "Yesterday, 2:50 PM",
      sender: "me",
      read: true,
    },
    {
      id: "m4",
      text: "We've completed the repair of your AC unit. Please let us know if you're facing any issues.",
      time: "Yesterday, 5:15 PM",
      sender: "other",
      read: true,
    },
  ],
};

export default function MessagesPage() {
  const [activeContact, setActiveContact] = useState<Contact | null>(null);
  const [message, setMessage] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileChat, setShowMobileChat] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 850);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  const handleSendMessage = () => {
    if (message.trim() && activeContact) {
      console.log(`Sending message to ${activeContact.name}: ${message}`);
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleContactSelect = (contact: Contact) => {
    setActiveContact(contact);
    if (isMobile) {
      setShowMobileChat(true);
    }
  };

  const handleBackToList = () => {
    setShowMobileChat(false);
  };

  return (
    <PageWrapper className="flex h-[calc(100vh)] flex-col space-y-8">
      <Header />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative flex flex-1 overflow-hidden rounded-sm bg-background/70 backdrop-blur-lg"
      >
        {(!isMobile || !showMobileChat) && (
          <ContactList
            contacts={contacts}
            activeContact={activeContact}
            setActiveContact={handleContactSelect}
          />
        )}

        <AnimatePresence mode="wait">
          {(!isMobile || showMobileChat) && (
            <motion.div
              key="chat-area"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="flex-1"
            >
              <ChatArea
                contact={activeContact}
                messages={messages[activeContact?.id || ""] || []}
                message={message}
                onMessageChange={setMessage}
                onKeyDown={handleKeyDown}
                onSend={handleSendMessage}
                onBack={isMobile ? handleBackToList : undefined}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </PageWrapper>
  );
}

function Header() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col"
    >
      <Title size={"h2"}>Messages</Title>
      <p className="text-muted-foreground">
        Communicate with building management and other tenants
      </p>
    </motion.header>
  );
}

function ContactList({
  contacts,
  activeContact,
  setActiveContact,
}: {
  contacts: Contact[];
  activeContact: Contact | null;
  setActiveContact: (c: Contact) => void;
}) {
  return (
    <div className="w-full border-r bg-background/40 backdrop-blur-md md:w-1/3">
      <div className="p-4">
        <div className="mb-4 flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search messages..."
              className="border-neutral-200/50 bg-background/60 pl-8 backdrop-blur-sm transition-all focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            title="New message"
            className="border-neutral-200/50 bg-background/60 backdrop-blur-sm transition-all hover:bg-primary/10"
          >
            <PlusCircle className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Conversations</h3>
          <Badge
            className="ml-2 rounded-full bg-primary/20 text-primary"
            variant="outline"
          >
            {contacts.filter((c) => c.unread).length} unread
          </Badge>
        </div>
      </div>
      <ScrollArea className="h-[calc(100vh-20rem)]">
        {contacts.map((contact, index) => (
          <motion.section
            key={contact.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <button
              className={`w-full p-3 text-left transition-all hover:bg-muted/50 ${
                activeContact?.id === contact.id ? "bg-primary/10" : ""
              }`}
              onClick={() => setActiveContact(contact)}
            >
              <div className="flex gap-3">
                <div className="relative">
                  <Avatar className="border-2 border-background shadow-sm">
                    <AvatarImage src={contact.avatar} />
                    <AvatarFallback className="bg-primary/20 text-primary">
                      {contact.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  {contact.isOnline && (
                    <span className="absolute bottom-0 right-0 h-3 w-3 animate-pulse rounded-full bg-green-500 ring-2 ring-background" />
                  )}
                </div>
                <div className="flex-1 overflow-hidden">
                  <div className="flex items-center justify-between">
                    <p className="truncate font-medium">{contact.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {contact.time}
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {contact.role}
                  </p>
                  <p className="line-clamp-1 truncate text-sm text-muted-foreground">
                    {contact.lastMessage}
                  </p>
                </div>
                {contact.unread && (
                  <div className="flex h-2 w-2 items-center justify-center">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                  </div>
                )}
              </div>
            </button>
            <Separator className="opacity-30" />
          </motion.section>
        ))}
      </ScrollArea>
    </div>
  );
}

function ChatArea({
  contact,
  messages,
  message,
  onMessageChange,
  onKeyDown,
  onSend,
  onBack,
}: {
  contact: Contact | null;
  messages: Message[];
  message: string;
  onMessageChange: (v: string) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  onSend: () => void;
  onBack?: () => void;
}) {
  if (!contact) {
    return (
      <div className="flex h-full flex-1 flex-col items-center justify-center bg-gradient-to-br from-background to-muted/20 p-8 text-muted-foreground backdrop-blur-lg">
        <div className="mb-4 rounded-full bg-primary/10 p-4">
          <Send className="h-8 w-8 text-primary/60" />
        </div>
        <h3 className="mb-2 text-xl font-medium text-foreground">
          Your Messages
        </h3>
        <p className="max-w-xs text-center">
          Select a contact to start messaging or create a new conversation
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-1 flex-col bg-background/60">
      <div className="z-10 flex items-center justify-between border-b bg-background/80 p-4 backdrop-blur-sm">
        {onBack && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="mr-2 md:hidden"
          >
            <ChevronRight className="h-5 w-5 rotate-180" />
          </Button>
        )}
        <div className="flex items-center">
          <Avatar className="h-10 w-10 border-2 border-background shadow-md">
            <AvatarImage src={contact.avatar} />
            <AvatarFallback className="bg-primary/20 text-primary">
              {contact.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="ml-4">
            <p className="font-medium">{contact.name}</p>
            <div className="flex items-center">
              <p className="text-sm text-muted-foreground">{contact.role}</p>
              {contact.isOnline && (
                <Badge
                  className="ml-2 bg-green-500/20 text-green-700 hover:bg-green-500/30"
                  variant="outline"
                >
                  Online
                </Badge>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {(contact.role.includes("Tower") ||
            contact.role.includes("Plaza")) && (
            <Button
              variant="outline"
              size="sm"
              className="border-neutral-200/50 bg-background/60 backdrop-blur-sm transition-all hover:bg-primary/10"
            >
              <Building className="mr-2 h-4 w-4" />
              View Property
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground"
          >
            <MoreHorizontal className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1 bg-gradient-to-br from-background/40 to-background/20 p-4">
        <div className="space-y-4 p-2">
          {messages.map((msg, index) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.3,
                delay: index * 0.1,
                type: "spring",
                stiffness: 120,
              }}
              className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}
            >
              {msg.sender === "other" && (
                <Avatar className="mr-2 h-8 w-8 border-2 border-background">
                  <AvatarImage src={contact.avatar} />
                  <AvatarFallback className="bg-primary/20 text-primary">
                    {contact.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
              )}
              <div
                className={`max-w-md rounded-2xl px-4 py-3 text-sm shadow-sm backdrop-blur-sm ${
                  msg.sender === "me"
                    ? "bg-primary text-primary-foreground"
                    : "border border-neutral-200/30 bg-background/90"
                }`}
              >
                {msg.text}
                <div
                  className={`mt-1 text-right text-xs ${
                    msg.sender === "me"
                      ? "text-primary-foreground/70"
                      : "text-muted-foreground"
                  }`}
                >
                  {msg.time}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </ScrollArea>

      <div className="border-t bg-background/80 p-4 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-foreground"
            >
              <Paperclip className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-foreground"
            >
              <Smile className="h-5 w-5" />
            </Button>
          </div>
          <Input
            placeholder="Type your message..."
            value={message}
            onChange={(e) => onMessageChange(e.target.value)}
            onKeyDown={onKeyDown}
            className="border-neutral-200/50 bg-background/60 backdrop-blur-sm transition-all focus:ring-2 focus:ring-primary/20"
          />
          <Button
            type="submit"
            onClick={onSend}
            className="bg-primary shadow-md transition-all hover:bg-primary/90"
          >
            <Send className="mr-2 h-4 w-4" />
            Send
          </Button>
        </div>
      </div>
    </div>
  );
}
