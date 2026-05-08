import { createContext, useContext, useState, ReactNode } from 'react';

export interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  suggestions?: string[];
  actions?: Array<{
    label: string;
    onClick: () => void;
  }>;
}

interface ChatContextType {
  messages: ChatMessage[];
  addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  replaceMessage: (id: string, message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  clearMessages: () => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  context: string;
  setContext: (context: string) => void;
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'ai',
      content: 'Hi Kevin! 👋 I\'m OpenShift LightSpeed, your AI assistant for cluster and operator management!\n\nI can help you with:\n\n• **Cluster updates** 🔄 Operator lifecycle management\n• **General cluster information and health** 💚\n• **Troubleshooting and diagnostics** 🔍\n\nWhat would you like to know?',
      timestamp: new Date(),
      suggestions: [
        'Assess readiness',
        'Show cluster health status',
        'Check operator compatibility',
        'What\'s new in OpenShift 4.22.0?'
      ]
    },
  ]);
  const [isOpen, setIsOpen] = useState(false);
  const [context, setContext] = useState('');
  const [messageCounter, setMessageCounter] = useState(2);
  const [currentPage, setCurrentPage] = useState('/');

  const addMessage = (message: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    const newMessage: ChatMessage = {
      ...message,
      id: `msg-${messageCounter}-${Date.now()}`,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);
    setMessageCounter((prev) => prev + 1);
  };

  const replaceMessage = (id: string, message: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    const newMessage: ChatMessage = {
      ...message,
      id: id,
      timestamp: new Date(),
    };
    setMessages((prev) => prev.map(msg => msg.id === id ? newMessage : msg));
  };

  const clearMessages = () => {
    setMessages([
      {
        id: '1',
        type: 'ai',
        content: 'Hi Kevin! 👋 I\'m OpenShift LightSpeed, your AI assistant for cluster and operator management!\n\nI can help you with:\n\n• **Cluster updates** 🔄 Operator lifecycle management\n• **General cluster information and health** 💚\n• **Troubleshooting and diagnostics** 🔍\n\nWhat would you like to know?',
        timestamp: new Date(),
        suggestions: [
          'Assess readiness',
          'Show cluster health status',
          'Check operator compatibility',
          'What\'s new in OpenShift 4.22.0?'
        ]
      },
    ]);
    setMessageCounter(2); // Reset counter
  };

  return (
    <ChatContext.Provider
      value={{
        messages,
        addMessage,
        replaceMessage,
        clearMessages,
        isOpen,
        setIsOpen,
        context,
        setContext,
        currentPage,
        setCurrentPage,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    // During hot module reload in development, return a safe fallback
    if (import.meta.env.DEV) {
      console.warn('useChat called outside ChatProvider - using fallback context');
      // Return a safe fallback that won't break the app
      return {
        messages: [],
        addMessage: () => {},
        replaceMessage: () => {},
        clearMessages: () => {},
        isOpen: false,
        setIsOpen: () => {},
        context: '',
        setContext: () => {},
        currentPage: '/',
        setCurrentPage: () => {},
      } as ChatContextType;
    }
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}