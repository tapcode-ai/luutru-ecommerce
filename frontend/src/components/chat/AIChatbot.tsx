"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle,
  X,
  Send,
  Minimize2,
  Maximize2,
  Bot,
  User,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useChatStore } from "@/store/chatStore";
import { Message } from "@/types/chat";
import { cn } from "@/lib/utils";

const suggestedQuestions = [
  "Gợi ý sản phẩm cho tôi",
  "Sản phẩm nào đang giảm giá?",
  "Tìm áo sơ mi nam",
  "Sản phẩm bán chạy nhất",
];

export default function AIChatbot() {
  const {
    isOpen,
    isMinimized,
    messages,
    isStreaming,
    toggleOpen,
    toggleMinimized,
    addMessage,
    setStreaming,
    unreadCount,
    incrementUnread,
    resetUnread,
  } = useChatStore();

  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!isOpen && unreadCount === 0 && messages.length > 0) {
      incrementUnread();
    }
  }, [messages.length, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isStreaming) return;

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      content: input,
      role: "user",
      createdAt: new Date().toISOString(),
    };

    addMessage(userMessage);
    setInput("");
    setStreaming(true);

    // Simulate AI response
    setTimeout(() => {
      const responses: Record<string, string> = {
        "gợi ý sản phẩm cho tôi":
          "Dựa trên xu hướng hiện tại, tôi gợi ý bạn một số sản phẩm hot:\n\n1. **Áo Sơ Mi Nam Oxford** - Giảm 50% ⭐\n2. **Tai Nghe Sony WH-1000XM5** - Chống ồn tốt nhất\n3. **Đồng Hồ Apple Watch Ultra 2** - Phiên bản mới nhất\n\nBạn muốn xem chi tiết sản phẩm nào không? 😊",
        "sản phẩm nào đang giảm giá?":
          "Các sản phẩm đang giảm giá hot nhất hiện nay:\n\n🔥 **Flash Sale:**\n- Áo Sơ Mi Nam - Giảm 50%\n- Đầm Dạ Hội - Giảm 53%\n- Giày Nike Air Max - Giảm 28%\n\n👉 Nhấn 'Xem tất cả Flash Sale' để khám phá thêm!",
        "tìm áo sơ mi nam":
          "Tôi tìm thấy sản phẩm phù hợp:\n\n👔 **Áo Sơ Mi Nam Cao Cấp Oxford**\n- Giá: 299.000₫ (Giảm 50%)\n- Đã bán: 15.234\n- Đánh giá: ⭐ 4.5/5\n\nBạn có muốn thêm vào giỏ hàng không?",
        "sản phẩm bán chạy nhất":
          "Top sản phẩm bán chạy nhất:\n\n🥇 Sách 'Nhà Giả Kim' - 45.678 đã bán\n🥈 Giày Nike Air Max - 23.456 đã bán\n🥉 Balo Laptop - 19.876 đã bán\n\nBạn muốn mua sản phẩm nào? 🛒",
      };

      const lowerInput = input.toLowerCase();
      let response = responses[lowerInput];

      if (!response) {
        response = `Cảm ơn bạn đã quan tâm! Tôi có thể giúp bạn:\n\n🛍️ **Gợi ý sản phẩm**\n💰 **Kiểm tra giá**\n📦 **Thông tin đơn hàng**\n🔍 **Tìm kiếm sản phẩm**\n\nBạn cần tôi hỗ trợ gì thêm không? 😊`;
      }

      const aiMessage: Message = {
        id: `msg-${Date.now()}`,
        content: response,
        role: "assistant",
        createdAt: new Date().toISOString(),
      };

      addMessage(aiMessage);
      setStreaming(false);
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => {
              toggleOpen();
              resetUnread();
            }}
            className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-2xl bg-gradient-to-br from-red-600 to-red-800 text-white shadow-xl shadow-red-500/30 hover:shadow-red-500/50 hover:scale-105 transition-all duration-200 flex items-center justify-center"
          >
            <MessageCircle className="w-6 h-6" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-white text-red-600 text-xs font-bold flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              height: isMinimized ? "auto" : "600px",
            }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className={cn(
              "fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-2rem)] bg-card border border-border rounded-2xl shadow-2xl shadow-black/30 overflow-hidden",
              isMinimized ? "h-auto" : "h-[600px] max-h-[calc(100vh-6rem)]"
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-red-600 to-red-800">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-sm">
                    Trợ lý AI
                  </h3>
                  <p className="text-white/70 text-xs">Luôn sẵn sàng hỗ trợ</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={toggleMinimized}
                  className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                >
                  {isMinimized ? (
                    <Maximize2 className="w-4 h-4" />
                  ) : (
                    <Minimize2 className="w-4 h-4" />
                  )}
                </button>
                <button
                  onClick={toggleOpen}
                  className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 h-[calc(100%-140px)]">
                  {messages.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500/20 to-red-600/20 flex items-center justify-center mx-auto mb-4">
                        <Sparkles className="w-8 h-8 text-red-400" />
                      </div>
                      <h4 className="text-white font-medium mb-2">
                        Xin chào! Tôi là trợ lý AI
                      </h4>
                      <p className="text-sm text-muted-foreground mb-4">
                        Tôi có thể giúp bạn tìm sản phẩm, gợi ý mua sắm và
                        nhiều hơn nữa!
                      </p>
                      <div className="space-y-2">
                        {suggestedQuestions.map((question, index) => (
                          <button
                            key={index}
                            onClick={() => {
                              setInput(question);
                              setTimeout(() => handleSend(), 100);
                            }}
                            className="block w-full text-left px-4 py-2.5 rounded-xl bg-secondary text-sm text-muted-foreground hover:text-white hover:bg-red-500/10 transition-colors"
                          >
                            {question}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    messages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={cn(
                          "flex gap-3",
                          message.role === "user"
                            ? "flex-row-reverse"
                            : "flex-row"
                        )}
                      >
                        <div
                          className={cn(
                            "w-8 h-8 rounded-xl flex items-center justify-center shrink-0",
                            message.role === "user"
                              ? "bg-red-500"
                              : "bg-gradient-to-br from-red-500 to-red-700"
                          )}
                        >
                          {message.role === "user" ? (
                            <User className="w-4 h-4 text-white" />
                          ) : (
                            <Bot className="w-4 h-4 text-white" />
                          )}
                        </div>
                        <div
                          className={cn(
                            "max-w-[80%] rounded-2xl px-4 py-3 text-sm",
                            message.role === "user"
                              ? "bg-red-500 text-white rounded-tr-md"
                              : "bg-secondary text-white rounded-tl-md"
                          )}
                        >
                          <div className="whitespace-pre-wrap leading-relaxed">
                            {message.content}
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                  {isStreaming && (
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                      <div className="bg-secondary rounded-2xl rounded-tl-md px-4 py-3">
                        <div className="flex gap-1">
                          <span className="w-2 h-2 rounded-full bg-red-400 animate-bounce" />
                          <span className="w-2 h-2 rounded-full bg-red-400 animate-bounce [animation-delay:0.1s]" />
                          <span className="w-2 h-2 rounded-full bg-red-400 animate-bounce [animation-delay:0.2s]" />
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 border-t border-border">
                  <div className="flex gap-2">
                    <Input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Nhập tin nhắn..."
                      className="flex-1 h-11"
                      disabled={isStreaming}
                    />
                    <button
                      onClick={handleSend}
                      disabled={!input.trim() || isStreaming}
                      className="w-11 h-11 rounded-xl bg-gradient-to-r from-red-600 to-red-700 text-white flex items-center justify-center hover:from-red-700 hover:to-red-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
