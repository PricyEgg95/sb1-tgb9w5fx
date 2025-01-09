import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    try {
      setError('');
      setLoading(true);
      await login(email, password);
      navigate('/');
    } catch (error) {
      setError('Failed to sign in');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center coffee-pattern">
      <div className="max-w-md w-full bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-8 border border-[var(--color-cream)]">
        <div className="flex flex-col items-center mb-6">
          <h2 className="text-2xl font-bold text-[var(--color-espresso)]">Welcome Back</h2>
          <p className="text-[var(--color-mocha)]">Sign in to your account</p>
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--color-espresso)]">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border-[var(--color-cream)] shadow-sm focus:border-[var(--color-cappuccino)] focus:ring focus:ring-[var(--color-latte)] focus:ring-opacity-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-espresso)]">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border-[var(--color-cream)] shadow-sm focus:border-[var(--color-cappuccino)] focus:ring focus:ring-[var(--color-latte)] focus:ring-opacity-50"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[var(--color-espresso)] text-white py-2 px-4 rounded hover:bg-[var(--color-mocha)] disabled:bg-[var(--color-latte)] transition-colors duration-200"
          >
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-sm text-[var(--color-mocha)]">
            Need an account?{' '}
            <Link to="/signup" className="text-[var(--color-espresso)] hover:text-[var(--color-mocha)] underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}