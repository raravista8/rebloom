'use client';
// Reusable chat panel — REST load + send, optional best-effort WS for live updates.
// Held messages (contacts stripped) shown to their own sender, flagged. Mirrors
// canon's .pd-chat + ChatInput. Used by the pre-purchase listing chat (the deal
// chat predates this and keeps its own copy).
import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PdBubble } from '@/components/canon';
import { IconSend } from '@/components/icons';
import { api, ApiError } from '@/lib/api';
import { formatTime } from '@/lib/format';
import type { ChatMessage, Paginated } from '@/lib/types';

export default function ChatPanel({
  loadPath,
  sendPath,
  wsPath,
  emptyText = 'Сообщений пока нет. Напишите первым.',
}: {
  loadPath: string;
  sendPath: string;
  wsPath?: string;
  emptyText?: string;
}) {
  const router = useRouter();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const [err, setErr] = useState<string | undefined>();
  const endRef = useRef<HTMLDivElement>(null);

  const upsert = useCallback((m: ChatMessage) => {
    setMessages((prev) => (prev.some((x) => x.id === m.id) ? prev : [...prev, m]));
  }, []);

  useEffect(() => {
    let alive = true;
    api
      .get<Paginated<ChatMessage>>(loadPath)
      .then((p) => alive && setMessages(p.items))
      .catch(() => {})
      .finally(() => alive && setLoaded(true));
    return () => {
      alive = false;
    };
  }, [loadPath]);

  useEffect(() => {
    if (!wsPath || typeof window === 'undefined') return;
    let ws: WebSocket | null = null;
    try {
      const proto = window.location.protocol === 'https:' ? 'wss' : 'ws';
      ws = new WebSocket(`${proto}://${window.location.host}${wsPath}`);
      ws.onmessage = (e) => {
        try {
          const d = JSON.parse(e.data);
          if (d?.type === 'message' && d.message?.id) upsert(d.message as ChatMessage);
        } catch {
          /* ignore */
        }
      };
    } catch {
      /* WS unavailable */
    }
    return () => ws?.close();
  }, [wsPath, upsert]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: 'end' });
  }, [messages]);

  const send = useCallback(async () => {
    const body = text.trim();
    if (!body || sending) return;
    setSending(true);
    setErr(undefined);
    try {
      const m = await api.post<ChatMessage>(sendPath, { body });
      upsert(m);
      setText('');
    } catch (e) {
      if (e instanceof ApiError && e.code === 'unauthorized') router.push('/login');
      else if (e instanceof ApiError && e.code === 'content_blocked') setErr('Контакты и ссылки убираем — общаться безопаснее внутри сделки.');
      else setErr(e instanceof ApiError ? e.message : 'Не удалось отправить');
    } finally {
      setSending(false);
    }
  }, [text, sending, sendPath, upsert, router]);

  return (
    <>
      <div className="pd-chat" style={{ minHeight: 220 }}>
        {loaded && messages.length === 0 && (
          <p style={{ textAlign: 'center', color: 'var(--pd-muted)', fontSize: 13, padding: '24px 16px' }}>{emptyText}</p>
        )}
        {messages.map((m) => (
          <div key={m.id}>
            <PdBubble kind={m.mine ? 'out' : 'in'} time={formatTime(m.created_at)}>
              {m.body}
            </PdBubble>
            {m.held && (
              <div style={{ fontSize: 11.5, color: 'var(--pd-warn)', textAlign: m.mine ? 'right' : 'left', margin: '2px 4px 0' }}>
                Контакты убраны — общаться безопаснее внутри сделки
              </div>
            )}
          </div>
        ))}
        <div ref={endRef} />
      </div>
      {err && <div style={{ padding: '0 14px', color: 'var(--pd-danger)', fontSize: 12.5 }}>{err}</div>}
      <div className="pd-chatinput">
        <div className="pd-input" style={{ flex: 1, padding: '9px 14px' }}>
          <input
            placeholder="Сообщение…"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') void send();
            }}
            aria-label="Сообщение"
          />
        </div>
        <button className="send" onClick={send} disabled={sending} aria-label="Отправить">
          <IconSend className="pd-i20" />
        </button>
      </div>
    </>
  );
}
