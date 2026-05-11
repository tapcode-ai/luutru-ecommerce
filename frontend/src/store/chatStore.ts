import { create } from 'zustand';
import { Message } from '@/types/chat';

interface ChatStore {
  isOpen: boolean;
  isMinimized: boolean;
  messages: Message[];
  isStreaming: boolean;
  conversationId: string | null;
  unreadCount: number;
  toggleOpen: () => void;
  setOpen: (open: boolean) => void;
  toggleMinimized: () => void;
  addMessage: (message: Message) => void;
  setStreaming: (streaming: boolean) => void;
  setConversationId: (id: string | null) => void;
  clearMessages: () => void;
  incrementUnread: () => void;
  resetUnread: () => void;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  isOpen: false,
  isMinimized: false,
  messages: [],
  isStreaming: false,
  conversationId: null,
  unreadCount: 0,

  toggleOpen: () => {
    const { isOpen } = get();
    set({ isOpen: !isOpen, isMinimized: false });
    if (!isOpen) {
      set({ unreadCount: 0 });
    }
  },

  setOpen: (open: boolean) => {
    set({ isOpen: open, isMinimized: false });
    if (open) {
      set({ unreadCount: 0 });
    }
  },

  toggleMinimized: () => {
    set((state) => ({ isMinimized: !state.isMinimized }));
  },

  addMessage: (message: Message) => {
    set((state) => ({
      messages: [...state.messages, message],
    }));
  },

  setStreaming: (streaming: boolean) => {
    set({ isStreaming: streaming });
  },

  setConversationId: (id: string | null) => {
    set({ conversationId: id });
  },

  clearMessages: () => {
    set({ messages: [], conversationId: null });
  },

  incrementUnread: () => {
    set((state) => ({ unreadCount: state.unreadCount + 1 }));
  },

  resetUnread: () => {
    set({ unreadCount: 0 });
  },
}));
