'use client';
// Deal chat — REST load + send (GET/POST /api/deals/{id}/messages), with a
// best-effort WS subscription for live updates (degrades to the REST state if the
// socket can't connect — API_CONTRACT §8). Held messages (contacts stripped) are
// shown to their own sender, flagged. Mirrors canon's .pd-chat + ChatInput.
import { useCallback, useEffect, useRef, useState } from 'react';
import { PdBubble } from '@/components/canon';
import { IconSend } from '@/components/icons';
import { api, ApiError } from '@/lib/api';
import { formatTime } from '@/lib/format';
import type { ChatMessage, Paginated } from '@/lib/types';

export default function DealChat({ dealId }: { dealId: string }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const [err, setErr] = useState<string | undefined>();
  const endRef = useRef<HTMLDivElement>(null);

  const scrollDown = () => endRef.current?.scrollIntoView({ block: 'end' });

  const upsert = useCallback((m: ChatMessage) => {
    setMessages((prev) => (prev.some((x) => x.id === m.id) ? prev : [...prev, m]));
  }, []);

  useEffect(() => {
    let alive = true;
    api
      .get<Paginated<ChatMessage>>(`/deals/${dealId}/messages`)
      .then((p) => alive && setMessages(p.items))
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [dealId]);

  // best-effort live updates
  useEffect(() => {
    if (typeof window === 'undefined') return;
    let ws: WebSocket | null = null;
    try {
      const proto = window.location.protocol === 'https:' ? 'wss' : 'ws';
      ws = new WebSocket(`${proto}://${window.location.host}/api/ws/deals/${dealId}`);
      ws.onmessage = (e) => {
        try {
          const data = JSON.parse(e.data);
          if (data?.type === 'message' && data.message?.id) upsert(data.message as ChatMessage);
        } catch {
          /* ignore malformed frames */
        }
      };
    } catch {
      /* WS unavailable — REST state stands */
    }
    return () => ws?.close();
  }, [dealId, upsert]);

  useEffect(scrollDown, [messages]);

  const send = useCallback(async () => {
    const body = text.trim();
    if (!body || sending) return;
    setSending(true);
    setErr(undefined);
    try {
      const m = await api.post<ChatMessage>(`/deals/${dealId}/messages`, { body });
      upsert(m);
      setText('');
    } catch (e) {
      setErr(e instanceof ApiError ? e.message : 'Не удалось отправить');
    } finally {
      setSending(false);
    }
  }, [text, sending, dealId, upsert]);

  return (
    <>
      <div className="pd-chat">
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
