import { NextRequest } from 'next/server';
import { Resend } from 'resend';
import PDFDocument from 'pdfkit';
import { computeProfile } from '@/lib/numerology';
import { buildReportText } from '@/lib/report';

export const runtime = 'nodejs';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function POST(req: NextRequest) {
  if (!resend) return new Response('Email service not configured', { status: 500 });
  const { fullName, email, birthISO } = await req.json();
  if (!fullName || !email || !birthISO) return new Response('Missing fields', { status: 400 });

  const [y, m, d] = birthISO.split('-').map((x: string) => parseInt(x, 10));
  const profile = computeProfile(fullName, { year: y, month: m, day: d });
  const text = buildReportText({ fullName, email, birthISO }, profile);

  const pdf = await createPdf(text);

  const from = process.env.EMAIL_FROM || 'no-reply@example.com';
  const site = process.env.SITE_URL || 'https://example.com';

  const { error } = await resend.emails.send({
    from,
    to: email,
    subject: 'B?o c?o th?n s? h?c c?a b?n',
    html: `<p>Xin ch?o ${fullName},</p><p>B?n vui l?ng xem b?o c?o ??nh k?m.</p><p>Tr?n tr?ng,<br/>${site}</p>`,
    attachments: [
      {
        filename: 'bao-cao-than-so-hoc.pdf',
        content: pdf.toString('base64'),
        path: undefined,
      },
    ],
  });

  if (error) return new Response(error.message ?? 'Email send failed', { status: 500 });
  return new Response('OK', { status: 200 });
}

async function createPdf(text: string): Promise<Buffer> {
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
  return await done;
}
