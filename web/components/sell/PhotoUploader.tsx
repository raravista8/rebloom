'use client';
// 1–5 bouquet photos. Each file: POST /api/photos {content_type} → {photo_id,
// upload_url}, then multipart POST the file to upload_url (FR-011 strips EXIF/GPS
// server-side). Mirrors canon's .pd-uploader markup (cover badge, remove, progress,
// add cell). Reports ready photo_ids up to the form.
import { useRef, useState } from 'react';
import { IconCamera, IconX } from '@/components/icons';
import { api } from '@/lib/api';

type Item = { localUrl: string; status: 'uploading' | 'done' | 'error'; photoId?: string };

const MAX = 5;

export default function PhotoUploader({ onPhotoIds }: { onPhotoIds: (ids: string[]) => void }) {
  const [items, setItems] = useState<Item[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  function commit(next: Item[]) {
    setItems(next);
    onPhotoIds(next.filter((i) => i.status === 'done' && i.photoId).map((i) => i.photoId!));
  }

  async function uploadOne(file: File, slot: number, current: Item[]): Promise<Item[]> {
    try {
      const { photo_id, upload_url } = await api.post<{ photo_id: string; upload_url: string }>('/photos', {
        content_type: file.type,
      });
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch(upload_url, { method: 'POST', body: fd, credentials: 'include' });
      if (!res.ok) throw new Error('upload failed');
      return current.map((it, i) => (i === slot ? { ...it, status: 'done', photoId: photo_id } : it));
    } catch {
      return current.map((it, i) => (i === slot ? { ...it, status: 'error' } : it));
    }
  }

  async function addFiles(files: FileList | null) {
    if (!files) return;
    const room = MAX - items.length;
    const picked = Array.from(files).slice(0, room);
    if (picked.length === 0) return;
    const base = items.length;
    let working: Item[] = [...items, ...picked.map((f) => ({ localUrl: URL.createObjectURL(f), status: 'uploading' as const }))];
    commit(working);
    for (let i = 0; i < picked.length; i++) {
      working = await uploadOne(picked[i], base + i, working);
      commit(working);
    }
  }

  function remove(slot: number) {
    commit(items.filter((_, i) => i !== slot));
  }

  return (
    <div className="pd-uploader">
      {items.map((it, i) => (
        <div className="pd-upcell" key={i}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={it.localUrl} alt="" style={it.status === 'uploading' ? { filter: 'brightness(.7)' } : undefined} />
          {it.status !== 'uploading' && (
            <button className="x" type="button" aria-label="Удалить фото" onClick={() => remove(i)}>
              <IconX className="pd-i14" />
            </button>
          )}
          {i === 0 && it.status === 'done' && <span className="cover">Обложка</span>}
          {it.status === 'uploading' && (
            <div className="prog">
              <div className="bar" />
            </div>
          )}
          {it.status === 'error' && (
            <button className="x" type="button" aria-label="Ошибка, удалить" onClick={() => remove(i)} style={{ background: 'var(--pd-danger)' }}>
              <IconX className="pd-i14" />
            </button>
          )}
        </div>
      ))}
      {items.length < MAX && (
        <button className="pd-upadd" type="button" onClick={() => inputRef.current?.click()}>
          <IconCamera className="pd-i24" />
          <span>
            Добавить
            <br />
            {items.length} из {MAX}
          </span>
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        hidden
        onChange={(e) => {
          void addFiles(e.target.files);
          e.target.value = '';
        }}
      />
    </div>
  );
}
