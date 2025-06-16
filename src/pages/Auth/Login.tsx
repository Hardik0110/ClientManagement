import { useState, type FormEvent } from 'react';
import { useAuth } from '../../lib/context/authContext';
import { useNavigate } from '@tanstack/react-router';

interface LoginFormData {
  email: string;
  password: string;
}

interface LoginError {
  message: string;
}

const Login = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<LoginError | null>(null);
  const [isSignUp, setIsSignUp] = useState<boolean>(false);

  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (error) {
      setError(null);
    }
  };

  const validateForm = (): boolean => {
    if (!formData.email.trim()) {
      setError({ message: 'Email is required' });
      return false;
    }
    
    if (!formData.password.trim()) {
      setError({ message: 'Password is required' });
      return false;
    }
    
    if (formData.password.length < 6) {
      setError({ message: 'Password must be at least 6 characters' });
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError({ message: 'Please enter a valid email address' });
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    setError(null);

    try {
      if (isSignUp) {
        await signUp(formData.email.trim(), formData.password);
      } else {
        await signIn(formData.email.trim(), formData.password);
      }
      
      // Navigation will be handled by the AuthRedirect component
      // when the auth state changes
      navigate({ to: '/dashboard' });
    } catch (err) {
      console.error('Authentication error:', err);
      
      let errorMessage = 'An unexpected error occurred';
      
      if (err instanceof Error) {
        if (err.message.includes('user-not-found')) {
          errorMessage = 'No account found with this email address';
        } else if (err.message.includes('wrong-password')) {
          errorMessage = 'Incorrect password';
        } else if (err.message.includes('email-already-in-use')) {
          errorMessage = 'An account with this email already exists';
        } else if (err.message.includes('weak-password')) {
          errorMessage = 'Password should be at least 6 characters';
        } else if (err.message.includes('invalid-email')) {
          errorMessage = 'Invalid email address';
        } else {
          errorMessage = err.message;
        }
      }
      
      setError({ message: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = (): void => {
    setIsSignUp(!isSignUp);
    setError(null);
    setFormData({ email: '', password: '' });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-900 via-purple-900 to-indigo-900 px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              {isSignUp ? 'Create Account' : 'Welcome Back'}
            </h2>
            <p className="text-white/70 mt-2">
              {isSignUp 
                ? 'Sign up to get started with your dashboard' 
                : 'Sign in to access your dashboard'
              }
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-white/80 text-sm font-medium mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
                  placeholder="Enter your email"
                  disabled={loading}
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-white/80 text-sm font-medium mb-2">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
                  placeholder="Enter your password"
                  disabled={loading}
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-500/20 border border-red-400/50 rounded-xl p-4">
                <p className="text-red-300 text-sm font-medium">{error.message}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 disabled:scale-100"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  <span>{isSignUp ? 'Creating Account...' : 'Signing In...'}</span>
                </div>
              ) : (
                isSignUp ? 'Create Account' : 'Sign In'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={toggleMode}
              disabled={loading}
              className="text-purple-300 hover:text-purple-200 text-sm font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSignUp 
                ? 'Already have an account? Sign in' 
                : "Don't have an account? Sign up"
              }
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;