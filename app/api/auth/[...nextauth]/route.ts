import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';

const hasGoogle = Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);

const handler = NextAuth({
  providers: hasGoogle ? [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    })
  ] : [],
  session: { strategy: 'jwt' },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
