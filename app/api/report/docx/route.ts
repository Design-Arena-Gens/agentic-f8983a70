import { NextRequest } from 'next/server';
import { Document, Packer, Paragraph, HeadingLevel, TextRun } from 'docx';
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

  const lines = text.split('\n');
  const doc = new Document({
    sections: [
      {
        children: [
          new Paragraph({ text: 'B?O C?O TH?N S? H?C C? NH?N', heading: HeadingLevel.HEADING_1 }),
          ...lines.map((l) => new Paragraph({ children: [new TextRun(l)] })),
        ],
      },
    ],
  });

  const buf = await Packer.toBuffer(doc);
  return new Response(buf, {
    status: 200,
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'Content-Disposition': `attachment; filename="bao-cao-than-so-hoc.docx"`
    }
  });
}
