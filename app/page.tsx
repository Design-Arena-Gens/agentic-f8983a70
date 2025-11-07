"use client";

import { useMemo, useState } from 'react';
import Button from '@/components/Button';
import Input, { Label } from '@/components/Input';
import { computeProfile } from '@/lib/numerology';

export default function Page() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [birthISO, setBirthISO] = useState('');
  const [downloading, setDownloading] = useState<'pdf' | 'docx' | null>(null);
  const [sending, setSending] = useState(false);

  const profile = useMemo(() => {
    if (!fullName || !birthISO) return null;
    const [y, m, d] = birthISO.split('-').map((x) => parseInt(x, 10));
    try {
      return computeProfile(fullName, { year: y, month: m, day: d });
    } catch {
      return null;
    }
  }, [fullName, birthISO]);

  const canGenerate = Boolean(fullName && email && birthISO);

  async function download(kind: 'pdf' | 'docx') {
    setDownloading(kind);
    try {
      const res = await fetch(`/api/report/${kind}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, email, birthISO }),
      });
      if (!res.ok) throw new Error('Download failed');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = kind === 'pdf' ? 'bao-cao-than-so-hoc.pdf' : 'bao-cao-than-so-hoc.docx';
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e) {
      alert('Kh?ng th? t?i b?o c?o.');
    } finally {
      setDownloading(null);
    }
  }

  async function sendEmail() {
    setSending(true);
    try {
      const res = await fetch('/api/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, email, birthISO }),
      });
      if (!res.ok) throw new Error('Email failed');
      alert('?? g?i email b?o c?o!');
    } catch (e) {
      alert('Kh?ng th? g?i email. Vui l?ng th? l?i.');
    } finally {
      setSending(false);
    }
  }

  return (
    <main>
      <h1 className="text-3xl font-bold tracking-tight">B?o c?o Th?n S? H?c</h1>
      <p className="mt-2 text-gray-600">??ng nh?p Google (t?y ch?n) ho?c nh?p th?ng tin b?n d??i ?? t?o b?o c?o ??y ?? v? t?i v? d??i d?ng PDF/DOCX, ??ng th?i g?i v? email c?a b?n.</p>

      <section className="mt-8 grid gap-6 sm:grid-cols-2">
        <div className="space-y-4">
          <div>
            <Label>H? v? t?n</Label>
            <Input placeholder="V? d?: Nguy?n V?n A" value={fullName} onChange={(e) => setFullName(e.target.value)} />
          </div>
          <div>
            <Label>Ng?y sinh</Label>
            <Input type="date" value={birthISO} onChange={(e) => setBirthISO(e.target.value)} />
          </div>
          <div>
            <Label>Email nh?n b?o c?o</Label>
            <Input type="email" placeholder="ban@vidu.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <Button onClick={() => download('pdf')} disabled={!canGenerate || downloading !== null}>
              {downloading === 'pdf' ? '?ang t?o PDF...' : 'T?i PDF'}
            </Button>
            <Button onClick={() => download('docx')} disabled={!canGenerate || downloading !== null}>
              {downloading === 'docx' ? '?ang t?o DOCX...' : 'T?i DOCX'}
            </Button>
            <Button onClick={sendEmail} disabled={!canGenerate || sending}>
              {sending ? '?ang g?i...' : 'G?i email PDF'}
            </Button>
          </div>
        </div>

        <div className="border rounded-lg p-4 bg-gray-50">
          <h2 className="text-xl font-semibold">T?m t?t ch? s?</h2>
          {!profile ? (
            <p className="mt-2 text-gray-600">Nh?p ??y ?? th?ng tin ?? xem t?m t?t.</p>
          ) : (
            <ul className="mt-3 space-y-1">
              <li>???ng ??i: <strong>{profile.lifePath}</strong></li>
              <li>Bi?u ??t: <strong>{profile.expression}</strong></li>
              <li>Linh h?n: <strong>{profile.soulUrge}</strong></li>
              <li>Nh?n c?ch: <strong>{profile.personality}</strong></li>
              <li>Ng?y sinh: <strong>{profile.birthday}</strong></li>
            </ul>
          )}
        </div>
      </section>

      <section className="mt-10 border-t pt-6">
        <h3 className="text-lg font-semibold">??ng nh?p Google (t?y ch?n)</h3>
        <p className="text-gray-600">T?nh n?ng ??ng nh?p Google s? s?n s?ng khi c?u h?nh m?i tr??ng ph? h?p.</p>
      </section>
    </main>
  );
}
