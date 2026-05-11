export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  createdAt: string;
}

export interface Conversation {
  id: string;
  title?: string;
  messages: Message[];
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChatState {
  isOpen: boolean;
  isMinimized: boolean;
  messages: Message[];
  isStreaming: boolean;
  conversationId: string | null;
}

export interface AIRecommendation {
  productId: string;
  productName: string;
  reason: string;
  image: string;
  price: number;
}

export interface SearchSuggestion {
  text: string;
  type: 'product' | 'category' | 'trending';
}
