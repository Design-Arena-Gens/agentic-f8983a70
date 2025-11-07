import { NextRequest } from 'next/server';
import PDFDocument from 'pdfkit';
import { computeProfile } from '@/lib/numerology';
import { buildReportText } from '@/lib/report';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const { fullName, email, birthISO } = await req.json();
  if (!fullName || !email || !birthISO) {
    return new Response('Missing fields', { status: 400 });
  }
  const [y, m, d] = birthISO.split('-').map((x: string) => parseInt(x, 10));
  const profile = computeProfile(fullName, { year: y, month: m, day: d });
  const text = buildReportText({ fullName, email, birthISO }, profile);

  const doc = new PDFDocument({ size: 'A4', margin: 50 });
  const chunks: Uint8Array[] = [];
  doc.on('data', (c) => chunks.push(c));
  const done = new Promise<Buffer>((resolve) => {
    doc.on('end', () => resolve(Buffer.concat(chunks)));
  });

  doc.fontSize(20).text('B?O C?O TH?N S? H?C C? NH?N', { align: 'center' });
  doc.moveDown();
  doc.fontSize(12).text(text, { align: 'left' });
  doc.end();

  const buf = await done;
  return new Response(buf, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="bao-cao-than-so-hoc.pdf"`
    }
  });
}
