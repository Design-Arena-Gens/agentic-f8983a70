import './globals.css';
import { ReactNode } from 'react';

export const metadata = {
  title: 'Th?n S? H?c - B?o c?o c? nh?n',
  description: '??ng nh?p Google, nh?p th?ng tin v? nh?n b?o c?o th?n s? h?c PDF/DOCX, g?i email.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="vi">
      <body className="min-h-screen antialiased bg-white text-gray-900">
        <div className="max-w-4xl mx-auto px-4 py-8">{children}</div>
      </body>
    </html>
  );
}
