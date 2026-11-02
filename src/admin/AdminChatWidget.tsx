import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, MessageSquare, Send, X } from 'lucide-react';
import {
  CHAT_MESSAGE_MAX_LENGTH,
  fetchAdminChatMessages,
  fetchChatConversations,
  markChatConversationRead,
  sendAdminChatMessage,
  type ChatConversation,
  type Message,
} from '@/lib/api';

export function AdminChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const unreadCount = conversations.filter((conversation) => conversation.unreadByAdmin).length;
  const selectedConversation = conversations.find((conversation) => conversation.id === selectedId);

  const refreshConversations = useCallback(async () => {
    const result = await fetchChatConversations();
    setConversations(result);
    setSelectedId((current) => current && result.some((conversation) => conversation.id === current)
      ? current
      : result[0]?.id ?? null);
    return result;
  }, []);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const result = await fetchChatConversations();
        if (!active) return;
        setConversations(result);
        setSelectedId((current) => current && result.some((conversation) => conversation.id === current)
          ? current
          : result[0]?.id ?? null);
        setError(null);
      } catch (loadError) {
        if (active) setError(loadError instanceof Error ? loadError.message : 'Could not load chat conversations.');
      } finally {
        if (active) setLoading(false);
      }
    };

    void load();
    const interval = window.setInterval(() => void load(), isOpen ? 5000 : 15000);
    return () => {
      active = false;
      window.clearInterval(interval);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !selectedId) {
      setMessages([]);
      return;
    }

    let active = true;
    const load = async () => {
      try {
        const result = await fetchAdminChatMessages(selectedId);
        if (active) {
          setMessages(result);
          setError(null);
        }
      } catch (loadError) {
        if (active) setError(loadError instanceof Error ? loadError.message : 'Could not load this conversation.');
      }
    };

    void load();
    void markChatConversationRead(selectedId)
      .then(() => refreshConversations())
      .catch((readError) => {
        if (active) setError(readError instanceof Error ? readError.message : 'Could not mark this conversation as read.');
      });
    const interval = window.setInterval(() => void load(), 3000);
    return () => {
      active = false;
      window.clearInterval(interval);
    };
  }, [isOpen, selectedId, refreshConversations]);

  useEffect(() => {
    if (isOpen) messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [isOpen, messages]);

  const sendReply = async (event: React.FormEvent) => {
    event.preventDefault();
    const content = draft.trim();
    if (!selectedId || !content || sending) return;

    setSending(true);
    setError(null);
    try {
      await sendAdminChatMessage(selectedId, content);
      setDraft('');
      setMessages(await fetchAdminChatMessages(selectedId));
      await refreshConversations();
    } catch (sendError) {
      setError(sendError instanceof Error ? sendError.message : 'Could not send your reply.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[60]">
      <AnimatePresence>
        {isOpen && (
          <motion.section
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.96 }}
            transition={{ duration: 0.18 }}
            aria-label="Visitor chat"
            className="absolute bottom-20 right-0 flex h-[min(34rem,calc(100dvh-8rem))] w-[min(24rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-3xl border border-white/15 bg-background/95 shadow-2xl backdrop-blur-2xl"
          >
            <header className="flex items-center justify-between border-b border-white/10 bg-white/5 p-4">
              <div className="flex min-w-0 items-center gap-3">
                <div className="relative grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 text-white">
                  <MessageSquare className="h-5 w-5" />
                  <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background bg-green-500" />
                </div>
                <div className="min-w-0">
                  <h2 className="truncate text-sm font-semibold">Visitor messages</h2>
                  <p className="text-[11px] font-medium text-green-400">Admin · Direct chat</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close chat"
                className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </header>

            {conversations.length > 0 && (
              <div className="border-b border-white/10 bg-white/[0.03] p-3">
                <label htmlFor="admin-chat-conversation" className="mb-1.5 block text-[11px] text-muted-foreground">
                  Conversation
                </label>
                <select
                  id="admin-chat-conversation"
                  value={selectedId ?? ''}
                  onChange={(event) => setSelectedId(event.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-background px-3 py-2 text-sm outline-none focus:border-primary/60"
                >
                  {conversations.map((conversation) => (
                    <option key={conversation.id} value={conversation.id}>
                      {conversation.visitorName || 'Visitor'}{conversation.unreadByAdmin ? ' · New' : ''}
                    </option>
                  ))}
                </select>
                {selectedConversation?.visitorEmail && (
                  <p className="mt-1.5 truncate text-[11px] text-muted-foreground">{selectedConversation.visitorEmail}</p>
                )}
              </div>
            )}

            <div className="flex-1 space-y-3.5 overflow-y-auto p-4">
              {loading ? (
                <p className="grid h-full place-items-center text-center text-sm text-muted-foreground">Loading messages…</p>
              ) : conversations.length === 0 ? (
                <div className="grid h-full place-items-center p-5 text-center">
                  <div>
                    <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-full border border-primary/20 bg-primary/10 text-primary">
                      <MessageSquare className="h-6 w-6" />
                    </div>
                    <h3 className="text-sm font-semibold">No visitor messages yet</h3>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      Messages sent from the public chat widget will appear here.
                    </p>
                  </div>
                </div>
              ) : messages.length === 0 ? (
                <p className="grid h-full place-items-center text-center text-sm text-muted-foreground">No messages in this conversation yet.</p>
              ) : messages.map((message) => {
                const isAdmin = message.sender === 'admin';
                return (
                  <div key={message.id} className={`flex flex-col ${isAdmin ? 'items-end' : 'items-start'}`}>
                    <div className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                      isAdmin
                        ? 'rounded-br-sm bg-gradient-to-br from-blue-500 to-cyan-500 text-white'
                        : 'rounded-bl-sm border border-white/10 bg-white/10 text-foreground'
                    }`}>
                      {!isAdmin && <p className="mb-1 text-[10px] font-semibold text-primary">Visitor</p>}
                      <p className="whitespace-pre-wrap break-words">{message.content}</p>
                    </div>
                    <time className="mt-1 px-1 text-[10px] text-muted-foreground/70" dateTime={message.createdAt}>
                      {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </time>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {error && (
              <div role="alert" className="flex items-center gap-2 border-t border-destructive/20 bg-destructive/10 px-4 py-2 text-xs text-destructive">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                <span className="line-clamp-2">{error}</span>
              </div>
            )}

            <form onSubmit={(event) => void sendReply(event)} className="flex items-center gap-2 border-t border-white/10 bg-white/5 p-3">
              <textarea
                rows={2}
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                maxLength={CHAT_MESSAGE_MAX_LENGTH}
                aria-label="Reply to visitor"
                placeholder={selectedId ? 'Type your reply…' : 'No conversation selected'}
                disabled={!selectedId || sending}
                className="min-h-10 max-h-24 min-w-0 flex-1 resize-none overflow-y-auto rounded-2xl border border-white/10 bg-background px-3.5 py-2.5 text-xs outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-primary/60 disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={!draft.trim() || !selectedId || sending}
                aria-label="Send reply"
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </motion.section>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label={isOpen ? 'Close visitor chat' : 'Open visitor chat'}
        aria-expanded={isOpen}
        className="relative grid h-14 w-14 place-items-center rounded-full border border-white/20 bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-[0_0_25px_rgba(59,130,246,0.4)] transition-shadow hover:shadow-[0_0_30px_rgba(59,130,246,0.55)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/50"
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
        {unreadCount > 0 && !isOpen && (
          <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full border-2 border-background bg-red-500 px-1 text-[10px] font-bold text-white" aria-label={`${unreadCount} unread conversations`}>
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </motion.button>
    </div>
  );
}
