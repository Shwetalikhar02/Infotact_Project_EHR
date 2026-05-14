import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ROUTE_PATHS } from '@/lib/index';
import api from '@/lib/axios';

export default function ResetPassword() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  const [isValidating, setIsValidating] = useState(true);
  const [isTokenValid, setIsTokenValid] = useState(false);
  
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // 1. Validate token on mount
  useEffect(() => {
    const validateToken = async () => {
      try {
        const res = await api.get(`/auth/reset-password/${token}/validate`);
        if (res.data.valid) {
          setIsTokenValid(true);
        } else {
          setIsTokenValid(false);
        }
      } catch (err) {
        setIsTokenValid(false);
      } finally {
        setIsValidating(false);
      }
    };

    if (token) {
      validateToken();
    } else {
      setIsValidating(false);
      setIsTokenValid(false);
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) return;
    
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      await api.post(`/auth/reset-password/${token}`, { 
        newPassword, 
        confirmPassword 
      });
      
      setSuccess('Password reset successfully! Redirecting to login...');
      setTimeout(() => {
        navigate(ROUTE_PATHS.LOGIN);
      }, 3000);
      
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-md bg-card p-8 rounded-xl shadow-lg border border-border">
        
        {isValidating ? (
          <div className="text-center py-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">Validating link...</h2>
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        ) : !isTokenValid ? (
          <div className="text-center py-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
              <h2 className="text-red-800 font-bold text-lg mb-2">Link Expired or Invalid</h2>
              <p className="text-red-700 text-sm">
                This password reset link is invalid or has expired. Please request a new one.
              </p>
            </div>
            <Link to={ROUTE_PATHS.FORGOT_PASSWORD}>
              <Button className="w-full bg-red-600 hover:bg-red-700 text-white">
                Request a new link
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-foreground">Create New Password</h1>
              <p className="text-muted-foreground mt-2 text-sm">
                Please enter your new password below.
              </p>
            </div>

            {success ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                <h3 className="text-green-800 font-semibold mb-2">Success!</h3>
                <p className="text-green-700 text-sm">{success}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    New Password
                  </label>
                  <Input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min. 8 characters"
                    required
                    minLength={8}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Confirm New Password
                  </label>
                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your new password"
                    required
                    minLength={8}
                    className="w-full"
                  />
                </div>

                {error && <p className="text-red-500 text-sm">{error}</p>}

                <Button
                  type="submit"
                  disabled={loading || !newPassword || !confirmPassword}
                  className="w-full bg-red-600 hover:bg-red-700 text-white mt-2"
                >
                  {loading ? 'Resetting Password...' : 'Reset Password'}
                </Button>
              </form>
            )}
          </>
        )}

      </div>
    </div>
  );
}
