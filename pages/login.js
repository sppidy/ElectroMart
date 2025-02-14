import { useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabase';
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
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      const { user } = data;
      console.log('User:', user);
      const { data: userProfile, error: profileError } = await supabase.from('profiles').select('role').eq('id', user.id).single();
      console.log('User Profile:', userProfile);
      if (userProfile) {
        console.log(`User Role: ${userProfile.role}`);
      }
      if (profileError) throw profileError;
      const destination = userProfile?.role === 'admin' ? '/admin' : '/dashboard';
      console.log('Redirecting to:', destination);
      router.push(destination);
    } catch (err) {
      console.error('Login error:', err);
      setError('Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Header />
      <main className="flex justify-center items-center h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md w-96">
          <h2 className="text-2xl font-bold text-center mb-4">Login</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2 border rounded-md" required />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-2 border rounded-md" required />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button type="submit" className="w-full bg-purple-800 text-white py-2 rounded-md hover:bg-purple-900" disabled={loading}>
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
