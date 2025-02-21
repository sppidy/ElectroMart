// pages/login.js
import { useState } from 'react';
import { useRouter } from 'next/router';
import { signIn } from 'next-auth/react';
import dynamic from 'next/dynamic';
import '../styles/globals.css';
import Header from '../components/Header';
import Footer from '../components/Footer';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        console.error('NextAuth error:', result.error);
        throw new Error(result.error);
      }

      console.log('Login successful, redirecting...');
      const sessionResponse = await fetch('/api/auth/session');
      const session = await sessionResponse.json();
      console.log('Session:', session);

      const destination = session?.user?.role === 'admin' ? '/admin' : '/dashboard';
      router.push(destination);
    } catch (err) {
      console.error('Login error:', err.message);
      setError('Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Header />
      <title>ElectroMart : Login</title>
      <main className="flex justify-center items-center h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md w-96">
          <h2 className="text-2xl font-bold text-center mb-4 text-black">Login</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-md"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-md"
              required
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              className="w-full bg-purple-800 text-white py-2 rounded-md hover:bg-purple-900"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default dynamic(() => Promise.resolve(LoginPage), { ssr: false });