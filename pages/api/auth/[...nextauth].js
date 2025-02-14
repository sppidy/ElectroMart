import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export default NextAuth({
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        const { error, user } = await supabase.auth.signInWithPassword({
          email: credentials.email,
          password: credentials.password
        });
        if (error || !user) throw new Error('Invalid credentials');
        return { id: user.id, email: user.email };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) { if (user) token.id = user.id; return token; },
                        async session({ session, token }) { session.user.id = token.id; return session; }
  },
  pages: { signIn: '/login' }
});
