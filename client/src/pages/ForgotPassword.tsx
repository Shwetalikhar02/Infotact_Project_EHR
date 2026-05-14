import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ROUTE_PATHS } from '@/lib/index';
import api from '@/lib/axios';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setError('');
    
    try {
      await api.post('/auth/forgot-password', { email });
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-md bg-card p-8 rounded-xl shadow-lg border border-border">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-foreground">Forgot Password</h1>
          <p className="text-muted-foreground mt-2 text-sm">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        {success ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
            <h3 className="text-green-800 font-semibold mb-2">Check your email</h3>
            <p className="text-green-700 text-sm mb-4">
              If an account exists for {email}, we've sent password reset instructions.
            </p>
            <p className="text-green-600 text-xs italic">
              Note: Please check your spam folder if you don't see it within a few minutes.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full"
              />
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            </div>

            <Button
              type="submit"
              disabled={loading || !email}
              className="w-full bg-red-600 hover:bg-red-700 text-white"
            >
              {loading ? 'Sending Request...' : 'Send Reset Link'}
            </Button>
          </form>
        )}

        <div className="mt-8 text-center">
          <Link to={ROUTE_PATHS.LOGIN} className="text-sm text-primary hover:underline font-medium">
            Remember it? Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}
