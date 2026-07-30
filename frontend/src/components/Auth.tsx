import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Mail, Lock, User } from 'lucide-react';
import { useAuthStore } from "../store/authStore";

interface AuthFormData {
  email: string;
  password: string;
  name?: string;
  phone?: string;
  street?: string;
  city?: string;
  state?: string;
  pincode?: string;
}

const Auth: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showForgot, setShowForgot] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetMessage, setResetMessage] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthFormData>();
  const { signIn, signUp, signInWithGoogle, resetPassword } = useAuthStore();
  const navigate = useNavigate();

  const onSubmit = async (data: AuthFormData) => {
    setErrorMessage('');
    try {
      if (isSignUp) {
        await signUp({ email: data.email, password: data.password, name: data.name || '' });
      } else {
        await signIn({ email: data.email, password: data.password });
      }
      navigate('/');
    } catch (error: any) {
      console.error('Authentication error:', error);
      setErrorMessage(error.message || 'Authentication failed');
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMessage('');
    try {
      await signInWithGoogle();
      navigate('/');
    } catch (error: any) {
      console.error('Google Sign-In Error:', error);
      setErrorMessage(error.message || 'Google Sign-In failed');
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetMessage('');
    try {
      await resetPassword(resetEmail);
      setResetMessage('Password reset email sent! Check your inbox.');
    } catch (error: any) {
      setResetMessage(error.message || 'Failed to send reset email');
    }
  };

  return (
    <div className="min-h-screen pt-20 bg-[#FFF8F2] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-sm p-8 max-w-md w-full"
      >
        <h1 className="text-3xl font-serif text-[#5A4232] mb-6 text-center">
          {isSignUp ? 'Create Account' : 'Welcome Back'}
        </h1>

        {/* Forgot Password Form */}
        {showForgot ? (
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Enter your email</label>
              <input
                type="email"
                value={resetEmail}
                onChange={e => setResetEmail(e.target.value)}
                className="input w-full border rounded px-3 py-2"
                placeholder="your@email.com"
                required
              />
            </div>
            {resetMessage && (
              <div className="text-center text-sm text-green-600">{resetMessage}</div>
            )}
            <button
              type="submit"
              className="w-full bg-[#C9A66B] hover:bg-[#5A4232] text-white py-2 rounded transition duration-300"
            >
              Send Reset Email
            </button>
            <div className="mt-2 text-center">
              <button
                type="button"
                className="text-[#C9A66B] hover:text-[#5A4232] text-sm"
                onClick={() => { setShowForgot(false); setResetMessage(''); }}
              >
                Back to Sign In
              </button>
            </div>
          </form>
        ) : (
          <>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {isSignUp && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        {...register('name', { required: isSignUp })}
                        type="text"
                        className="input pl-10 w-full border rounded px-3 py-2"
                        placeholder="Your name"
                      />
                    </div>
                    {errors.name && <span className="text-red-500 text-sm">Name is required</span>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <div className="relative">
                      <input
                        {...register('phone', { required: isSignUp, pattern: /^[0-9]{10}$/ })}
                        type="tel"
                        className="input pl-3 w-full border rounded px-3 py-2"
                        placeholder="Phone number"
                      />
                    </div>
                    {errors.phone && <span className="text-red-500 text-sm">Valid phone number is required</span>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                    <input
                      {...register('street', { required: isSignUp })}
                      type="text"
                      className="input w-full border rounded px-3 py-2"
                      placeholder="Street address"
                    />
                    {errors.street && <span className="text-red-500 text-sm">Street address is required</span>}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                      <input
                        {...register('city', { required: isSignUp })}
                        type="text"
                        className="input w-full border rounded px-3 py-2"
                        placeholder="City"
                      />
                      {errors.city && <span className="text-red-500 text-sm">City is required</span>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                      <input
                        {...register('state', { required: isSignUp })}
                        type="text"
                        className="input w-full border rounded px-3 py-2"
                        placeholder="State"
                      />
                      {errors.state && <span className="text-red-500 text-sm">State is required</span>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                    <input
                      {...register('pincode', { required: isSignUp, pattern: /^[0-9]{6}$/ })}
                      type="text"
                      className="input w-full border rounded px-3 py-2"
                      placeholder="Pincode"
                    />
                    {errors.pincode && <span className="text-red-500 text-sm">Valid pincode is required</span>}
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    {...register('email', { required: true, pattern: /^\S+@\S+$/i })}
                    type="email"
                    className="input pl-10 w-full border rounded px-3 py-2"
                    placeholder="your@email.com"
                  />
                </div>
                {errors.email && (
                  <span className="text-red-500 text-sm">Valid email is required</span>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    {...register('password', { required: true, minLength: 6 })}
                    type="password"
                    className="input pl-10 w-full border rounded px-3 py-2"
                    placeholder="••••••••"
                  />
                </div>
                {errors.password && (
                  <span className="text-red-500 text-sm">
                    Password must be at least 6 characters
                  </span>
                )}
              </div>

              {errorMessage && (
                <div className="text-red-500 text-sm text-center">{errorMessage}</div>
              )}

              <button
                type="submit"
                className="w-full bg-[#C9A66B] hover:bg-[#5A4232] text-white py-2 rounded transition duration-300"
              >
                {isSignUp ? 'Sign Up' : 'Sign In'}
              </button>
            </form>

            <div className="mt-4 text-center text-gray-600 text-sm">or</div>

            <div className="mt-4">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                className="w-full border border-gray-300 flex items-center justify-center gap-2 py-2 rounded hover:bg-gray-100 transition duration-300"
              >
                <img
                  src="https://www.svgrepo.com/show/475656/google-color.svg"
                  alt="Google"
                  className="w-5 h-5"
                />
                Sign in with Google
              </button>
            </div>

            <div className="mt-6 text-center">
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-[#C9A66B] hover:text-[#5A4232] transition-colors"
              >
                {isSignUp
                  ? 'Already have an account? Sign in'
                  : "Don't have an account? Sign up"}
              </button>
            </div>

            {!isSignUp && (
              <div className="mt-2 text-center">
                <button
                  type="button"
                  className="text-[#C9A66B] hover:text-[#5A4232] text-sm"
                  onClick={() => setShowForgot(true)}
                >
                  Forgot Password?
                </button>
              </div>
            )}
          </>
        )}
      </motion.div>
    </div>
  );
};

export default Auth;

