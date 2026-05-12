import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';

const ForgotPassword = () => {
  const {state } = useLocation();
  const [email, setEmail] = useState(state?.email || '');
  const {forgetPassword } = useAuthStore();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    await forgetPassword(email);
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6 font-sans">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 p-8 md:p-12 border border-gray-100"
      >
        {!isSubmitted ? (
          <>
            <button 
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-400 hover:text-[#00A699] transition-colors mb-8 group"
            >
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
              <span className="text-xs font-black uppercase tracking-widest">Back to Login</span>
            </button>

            <div className="mb-8">
              <h1 className="text-3xl font-black text-gray-900 tracking-tighter uppercase mb-2">
                Forgot <span className="text-[#00A699]">Password?</span>
              </h1>
              <p className="text-gray-500 text-sm font-medium leading-relaxed">
                Enter your registered email address below. We'll send a secure reset link to your inbox.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative group">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#00A699] transition-colors" size={20} />
                  <input 
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@registry.com"
                    className="w-full bg-gray-50 border border-gray-100 py-4 pl-12 pr-4 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#00A699]/5 focus:bg-white transition-all font-medium"
                  />
                </div>
              </div>

              <button 
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#00A699] hover:bg-[#008c82] text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-[#00A699]/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {isLoading ? <Loader2 className="animate-spin" size={20} /> : "Send Reset Link"}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center py-4">
            <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={40} className="text-emerald-500" />
            </div>
            <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight mb-3">Check Your Email</h2>
            <p className="text-gray-500 text-sm font-medium leading-relaxed mb-8">
              We have sent a secure password reset link to <br /><span className="text-gray-900 font-bold">{email}</span>
            </p>
            <button 
              onClick={() => setIsSubmitted(false)}
              className="text-[#00A699] text-xs font-black uppercase tracking-widest hover:underline"
            >
              Didn't receive it? Try again
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ForgotPassword;