// pages/api/auth/[...nextauth].js
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log('Service Key:', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Set' : 'Missing');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const ADMIN_UUID = process.env.ADMIN_UUID;

export default NextAuth({
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        console.log('Authorize started for:', credentials.email);
        try {
          const { data: { user }, error } = await supabase.auth.signInWithPassword({
            email: credentials.email,
            password: credentials.password
          });

          if (error || !user) {
            console.error('Supabase auth error:', error?.message);
            throw new Error('Invalid credentials');
          }

          console.log('User authenticated:', user.id, user.email);

          // Determine role based on UUID
          if (!ADMIN_UUID) {
            console.error('Missing ADMIN_UUID');
            throw new Error('Server configuration error: Missing admin UUID');
          }

          const userRole = user.id === ADMIN_UUID ? 'admin' : 'user';
          console.log('Assigned role based on UUID:', userRole);

          if (userRole === 'admin' && user.id !== ADMIN_UUID) {
            console.error('Admin UUID mismatch:', user.id, '!=', ADMIN_UUID);
            throw new Error('Unauthorized: Invalid admin credentials');
          }

          console.log('Authorize successful:', { id: user.id, email: user.email, role: userRole });
          return { id: user.id, email: user.email, role: userRole };
        } catch (err) {
          console.error('Authorize failed:', err.message);
          throw err;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.role = user.role;
      }
      console.log('JWT Token:', token);
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.role = token.role;
      }
      console.log('Session Data:', session);
      return token ? session : null;
    }
  },
  pages: { signIn: '/login' },
  session: { strategy: 'jwt' }
});