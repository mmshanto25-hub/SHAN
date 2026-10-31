import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, AlertCircle } from 'lucide-react';
import { sendVisitorMessage, fetchVisitorThread, type Message } from '@/lib/api';

function getOrCreateVisitorToken(): string {
  const STORAGE_KEY = 'portfolio_visitor_chat_token';
  let token = localStorage.getItem(STORAGE_KEY);
  if (!token || !/^[\da-f]{8}-([\da-f]{4}-){3}[\da-f]{12}$/i.test(token)) {
    token = crypto.randomUUID();
    localStorage.setItem(STORAGE_KEY, token);
  }
  return token;
}

export const VisitorChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [visitorToken] = useState<string>(getOrCreateVisitorToken);
  const [messages, setMessages] = useState<Message[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [inputText, setInputText] = useState('');
  const [senderName, setSenderName] = useState(() => localStorage.getItem('visitor_chat_name') || '');
  const [senderEmail, setSenderEmail] = useState(() => localStorage.getItem('visitor_chat_email') || '');
  const [isSending, setIsSending] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Poll for messages
  const loadMessages = useCallback(async () => {
    try {
      const data = await fetchVisitorThread(visitorToken, isOpen);
      setMessages(data.messages);
      setUnreadCount(data.conversation?.unreadByVisitor && !isOpen ? 1 : 0);
    } catch (error) {
      setErrorMsg(error instanceof Error ? error.message : 'Could not load your messages.');
    }
  }, [visitorToken, isOpen]);

  useEffect(() => {
    void loadMessages();
    const interval = window.setInterval(() => void loadMessages(), isOpen ? 3000 : 15000);
    return () => clearInterval(interval);
  }, [loadMessages, isOpen]);

  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0);
      setTimeout(scrollToBottom, 100);
      inputRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const text = inputText.trim();
    if (!text || isSending) return;

    setErrorMsg(null);
    setIsSending(true);

    try {
      if (senderName) localStorage.setItem('visitor_chat_name', senderName);
      if (senderEmail) localStorage.setItem('visitor_chat_email', senderEmail);

      const res = await sendVisitorMessage({
        visitorToken,
        content: text,
        name: senderName || undefined,
        email: senderEmail || undefined
      });

      if (res.message) {
        setMessages((prev) => [...prev, res.message]);
        setInputText('');
      }
    } catch (error) {
      setErrorMsg(error instanceof Error ? error.message : 'Failed to send message. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      {/* Floating Launcher Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative w-14 h-14 rounded-full bg-gradient-premium shadow-[0_0_25px_rgba(59,130,246,0.5)] flex items-center justify-center text-white cursor-pointer focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/50 transition-all border border-white/20"
          aria-label={isOpen ? 'Close chat' : 'Open message chat'}
          aria-expanded={isOpen}
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <X className="w-6 h-6" />
              </motion.div>
            ) : (
              <motion.div
                key="open"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <MessageSquare className="w-6 h-6" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Unread Message Badge */}
          {unreadCount > 0 && !isOpen && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-5 w-5 bg-red-500 text-white text-[10px] font-bold items-center justify-center">
                !
              </span>
            </span>
          )}
        </motion.button>
      </div>

      {/* Chat Window Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="fixed bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-96 max-h-[82vh] h-[550px] flex flex-col rounded-3xl glassmorphism bg-background/95 border border-white/15 shadow-2xl backdrop-blur-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/5">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gradient-premium p-0.5">
                    <img
                      src="/profile.jpg"
                      alt="Meskatul Shanto"
                      className="w-full h-full rounded-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  </div>
                  <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-background" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white leading-tight font-heading">
                    Meskatul Masabhi Shanto
                  </h3>
                  <p className="text-[11px] text-green-400 font-medium">Online · Direct Chat</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center text-muted-foreground hover:text-white transition-colors"
                aria-label="Close chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Visitor Identity Mini Form (Optional) */}
            {messages.length === 0 && (
              <div className="p-3 bg-white/5 border-b border-white/10 text-xs space-y-2">
                <p className="text-muted-foreground text-[11px]">
                  Introduce yourself (optional) so I can reach back out:
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Your name"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    className="px-2.5 py-1.5 rounded-lg bg-background/60 border border-white/10 text-xs text-white placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/60"
                  />
                  <input
                    type="email"
                    placeholder="Your email"
                    value={senderEmail}
                    onChange={(e) => setSenderEmail(e.target.value)}
                    className="px-2.5 py-1.5 rounded-lg bg-background/60 border border-white/10 text-xs text-white placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/60"
                  />
                </div>
              </div>
            )}

            {/* Messages Scroll Area */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3.5">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 text-muted-foreground space-y-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold text-sm">Send a direct message</h4>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                      Have a project idea, question, or just want to connect? Type your message below.
                    </p>
                  </div>
                </div>
              ) : (
                messages.map((msg) => {
                  const isVisitor = msg.sender === 'visitor';
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isVisitor ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed ${
                          isVisitor
                            ? 'bg-gradient-premium text-white rounded-br-xs shadow-md'
                            : 'bg-white/10 text-white/95 rounded-bl-xs border border-white/10'
                        }`}
                      >
                        {!isVisitor && (
                          <div className="text-[10px] font-bold text-primary mb-1 flex items-center gap-1">
                            <span>Shanto</span>
                            <span className="text-[9px] px-1 py-0.2 rounded bg-primary/20 text-primary uppercase">
                              Admin
                            </span>
                          </div>
                        )}
                        <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                      </div>
                      <span className="text-[10px] text-muted-foreground/60 mt-1 px-1">
                        {new Date(msg.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="px-4 py-2 bg-red-500/10 border-t border-red-500/20 text-red-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span className="line-clamp-1">{errorMsg}</span>
              </div>
            )}

            {/* Input Composer */}
            <form onSubmit={handleSend} className="p-3 border-t border-white/10 bg-white/5 flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                placeholder="Type your message..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                disabled={isSending}
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-background/80 border border-white/15 text-xs text-white placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/60 transition-colors"
                maxLength={2000}
              />
              <button
                type="submit"
                disabled={!inputText.trim() || isSending}
                className="w-10 h-10 rounded-xl bg-gradient-premium text-white flex items-center justify-center cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_0_15px_rgba(59,130,246,0.4)] transition-all shrink-0"
                aria-label="Send message"
              >
                {isSending ? (
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
