import { useCallback, useEffect, useRef, useState } from 'react';
import { Send } from 'lucide-react';
import {
  fetchAdminChatMessages,
  fetchChatConversations,
  markChatConversationRead,
  sendAdminChatMessage,
  type ChatConversation,
  type Message,
} from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function AdminChatInbox() {
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const refreshConversations = useCallback(async () => {
    const result = await fetchChatConversations();
    setConversations(result);
    setSelectedId((current) => current && result.some((conversation) => conversation.id === current)
      ? current
      : result[0]?.id ?? null);
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
    const interval = window.setInterval(() => void load(), 10000);
    return () => {
      active = false;
      window.clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (!selectedId) {
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

    void markChatConversationRead(selectedId)
      .then(() => refreshConversations())
      .catch((readError) => {
        if (active) setError(readError instanceof Error ? readError.message : 'Could not mark this conversation as read.');
      });
    void load();
    const interval = window.setInterval(() => void load(), 4000);
    return () => {
      active = false;
      window.clearInterval(interval);
    };
  }, [selectedId, refreshConversations]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const selectedConversation = conversations.find((conversation) => conversation.id === selectedId);

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
    <Card>
      <CardHeader><CardTitle>Visitor chats</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        {error && <p role="alert" className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading conversations…</p>
        ) : conversations.length === 0 ? (
          <p className="text-sm text-muted-foreground">No visitor chats yet. Messages sent from the public chat widget will appear here.</p>
        ) : (
          <div className="grid min-h-[26rem] gap-4 md:grid-cols-[minmax(12rem,0.8fr)_minmax(0,1.6fr)]">
            <nav aria-label="Visitor conversations" className="max-h-[36rem] space-y-2 overflow-y-auto rounded-xl border border-border p-2">
              {conversations.map((conversation) => (
                <button
                  key={conversation.id}
                  type="button"
                  onClick={() => setSelectedId(conversation.id)}
                  aria-current={selectedId === conversation.id ? 'true' : undefined}
                  className={`w-full rounded-lg border p-3 text-left transition-colors ${
                    selectedId === conversation.id
                      ? 'border-primary/50 bg-primary/10'
                      : 'border-transparent bg-muted/30 hover:bg-muted/60'
                  }`}
                >
                  <span className="flex items-center justify-between gap-2">
                    <span className="truncate text-sm font-medium">{conversation.visitorName || 'Visitor'}</span>
                    {conversation.unreadByAdmin && <span className="h-2 w-2 shrink-0 rounded-full bg-primary" aria-label="Unread" />}
                  </span>
                  <span className="mt-1 block truncate text-xs text-muted-foreground">{conversation.visitorEmail || 'No email provided'}</span>
                  <span className="mt-1 block text-[11px] text-muted-foreground">
                    {new Date(conversation.lastMessageAt).toLocaleString()}
                  </span>
                </button>
              ))}
            </nav>

            {selectedConversation ? (
              <section aria-label="Selected conversation" className="flex min-h-[26rem] flex-col overflow-hidden rounded-xl border border-border">
                <header className="border-b border-border p-3">
                  <p className="font-medium">{selectedConversation.visitorName || 'Visitor'}</p>
                  <p className="text-xs text-muted-foreground">{selectedConversation.visitorEmail || 'No email provided'}</p>
                </header>
                <div className="flex-1 space-y-3 overflow-y-auto p-4">
                  {messages.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No messages in this conversation yet.</p>
                  ) : messages.map((message) => (
                    <div key={message.id} className={`flex ${message.sender === 'admin' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] rounded-2xl px-3 py-2 ${
                        message.sender === 'admin' ? 'bg-primary text-primary-foreground' : 'bg-muted'
                      }`}>
                        <p className="whitespace-pre-wrap break-words text-sm">{message.content}</p>
                        <time className="mt-1 block text-right text-[10px] opacity-70" dateTime={message.createdAt}>
                          {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </time>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
                <form onSubmit={(event) => void sendReply(event)} className="flex gap-2 border-t border-border p-3">
                  <input
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                    maxLength={2000}
                    aria-label="Reply to visitor"
                    placeholder="Write a reply…"
                    className="min-w-0 flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                  />
                  <Button type="submit" disabled={!draft.trim() || sending} aria-label="Send reply">
                    <Send className="h-4 w-4" /> Reply
                  </Button>
                </form>
              </section>
            ) : (
              <div className="grid place-items-center rounded-xl border border-border text-sm text-muted-foreground">Select a conversation</div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
