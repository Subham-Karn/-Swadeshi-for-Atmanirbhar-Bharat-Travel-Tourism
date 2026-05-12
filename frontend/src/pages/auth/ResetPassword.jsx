import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff, Loader2, ShieldCheck } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../store/useAuthStore';

const ResetPassword = () => {
  const { id, token } = useParams();
  const { resetPassword } = useAuthStore();
  const [showPass, setShowPass] = useState(false);
  const [formData, setFormData] = useState({ password: '', confirmPassword: '' });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    if(formData.password !== formData.confirmPassword) return toast.error("Passwords do not match");
    
    setIsLoading(true);
    await resetPassword(id, token, formData);
    setTimeout(() => {
      setIsLoading(false);
      navigate('/auth/login');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6 font-sans">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 p-8 md:p-12 border border-gray-100"
      >
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-[#00A699]/10 rounded-2xl text-[#00A699]">
            <ShieldCheck size={32} />
          </div>
        </div>

        <div className="text-center mb-10">
          <h1 className="text-3xl font-black text-gray-900 tracking-tighter uppercase mb-2">
            Secure <span className="text-[#00A699]">Reset</span>
          </h1>
          <p className="text-gray-500 text-sm font-medium">Create a strong new password for your account.</p>
        </div>

        <form onSubmit={handleReset} className="space-y-5">
          {/* New Password */}
          <div className="relative group">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">New Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
              <input 
                type={showPass ? "text" : "password"}
                required
                className="w-full bg-gray-50 border border-gray-100 py-4 pl-12 pr-12 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#00A699]/5 transition-all font-medium"
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
              <button 
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#00A699]"
              >
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="relative group">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Confirm New Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
              <input 
                type={showPass ? "text" : "password"}
                required
                className="w-full bg-gray-50 border border-gray-100 py-4 pl-12 pr-4 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#00A699]/5 transition-all font-medium"
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#0F172A] hover:bg-black text-white py-4 rounded-2xl font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 mt-4"
          >
            {isLoading ? <Loader2 className="animate-spin" size={20} /> : "Update Password"}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default ResetPassword;