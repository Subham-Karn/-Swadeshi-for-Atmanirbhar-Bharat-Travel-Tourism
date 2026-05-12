import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, Globe, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import toast from 'react-hot-toast';

const Login = () => {
  const {loginUser , loading} = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
     const res = await loginUser({ email, password });
     if(!res.success) throw new Error(res.message);
     toast.success("Login successful");
     navigate('/');
    } catch (error) {
      toast.error(error.message);
    }
  }
  return (
    <div className="min-h-screen w-full flex bg-white overflow-hidden">
      {/* Left Visual Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gray-900 p-16 items-end">
        <img 
          src="https://images.unsplash.com/photo-1506461883276-594a12b11cf3?q=80&w=2000" 
          className="absolute inset-0 w-full h-full object-cover opacity-50"
          alt="Login Background"
        />
        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-2 mb-8">
             <div className="bg-[#00A699] p-2 rounded-xl"><Globe size={24} className="text-white" /></div>
             <span className="text-white font-black text-xl tracking-tighter">BHARAT<span className="text-[#00A699]">DARSHAN</span></span>
          </Link>
          <h2 className="text-5xl font-black text-white tracking-tighter leading-none mb-4">WELCOME <br/> BACK.</h2>
          <p className="text-gray-400 font-medium">Continue your journey across the subcontinent.</p>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-16">
        <div className="w-full max-w-md">
          <div className="mb-10">
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">LogIn</h1>
            <p className="text-gray-400 font-medium text-sm mt-2">
              Don't have an account? <Link to="/auth/signup" className="text-[#00A699] font-black hover:underline">Create one</Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                <input type="email" onChange={(e)=>setEmail(e.target.value)} placeholder="name@example.com" className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-[#00A699]/20 font-bold text-gray-700" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between px-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Password</label>
                <button type="button" onClick={()=>navigate("/auth/forget-password" , { state: { email } })} className="text-[10px] font-black text-[#00A699] uppercase">Forgot?</button>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                <input type={showPassword ? "text" : "password"} onChange={(e)=>setPassword(e.target.value)} placeholder="••••••••" className="w-full pl-12 pr-12 py-4 rounded-2xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-[#00A699]/20 font-bold text-gray-700" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading} // 2. Disable while loading
              className={`md:col-span-2 w-full py-4 rounded-xl font-black tracking-widest transition-all flex items-center justify-center gap-2 shadow-xl mt-4 
                ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gray-900 hover:bg-[#00A699] text-white'}`}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                   LOGINING....
                </>
              ) : (
                <>
                  <span>LOGIN</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;