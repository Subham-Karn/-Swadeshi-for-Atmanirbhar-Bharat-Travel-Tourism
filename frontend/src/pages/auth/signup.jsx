import React, { useState } from 'react';
import { User, Mail, Lock, Globe, ArrowRight, Phone, MapPin, Hash, UserCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import OTPModal from '../../modals/OTPModal'; 
import toast from 'react-hot-toast';
import { useAuthStore } from '../../store/useAuthStore';
const Signup = () => {
  const { requestSignup , loading } = useAuthStore();
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    gender: '',
    age: '',
    email: '',
    phone: '',
    address: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

const handleSignupSubmit = async (e) => {
    e.preventDefault();
    const loadId = toast.loading("Sending OTP...");
    try {
      await requestSignup(formData);
      toast.success("OTP sent to your email!", { id: loadId });
      setShowOTPModal(true);
    } catch (err) {
      toast.error(err, { id: loadId });
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-white overflow-hidden">
      {/* Left Visual Panel */}
      <div className="hidden lg:flex lg:w-1/3 relative bg-gray-900 p-12 items-end">
        <img 
          src="https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=2000" 
          className="absolute inset-0 w-full h-full object-cover opacity-40"
          alt="Signup Background"
        />
        <div className="relative z-10 text-white">
          <h2 className="text-4xl font-black tracking-tighter leading-none mb-4">JOIN THE <br/> ADVENTURE.</h2>
          <p className="text-gray-300 text-sm font-medium">Create an account to explore the soulful journeys of India.</p>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="w-full lg:w-2/3 flex items-center justify-center p-8 overflow-y-auto">
        <div className="w-full max-w-2xl py-10">
          <div className="mb-10 text-center lg:text-left">
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Create Account</h1>
            <p className="text-gray-400 font-medium text-sm mt-2">
              Already a member? <Link to="/login" className="text-[#00A699] font-black hover:underline">Sign in</Link>
            </p>
          </div>

          <form onSubmit={handleSignupSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Name */}
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                <input name="name" required onChange={handleChange} type="text" placeholder="Full Name" className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-[#00A699]/20 font-bold text-gray-700" />
              </div>
            </div>

            {/* Username */}
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Username</label>
              <div className="relative">
                <UserCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                <input name="username" required onChange={handleChange} type="text" placeholder="example123" className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-[#00A699]/20 font-bold text-gray-700" />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                <input name="email" required onChange={handleChange} type="email" placeholder="john@example.com" className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-[#00A699]/20 font-bold text-gray-700" />
              </div>
            </div>

            {/* Phone */}
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                <input name="phone" required onChange={handleChange} type="text" placeholder="+91 00000 00000" className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-[#00A699]/20 font-bold text-gray-700" />
              </div>
            </div>

            {/* Gender */}
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Gender</label>
              <select name="gender" required onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-[#00A699]/20 font-bold text-gray-700">
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Age */}
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Age</label>
              <div className="relative">
                <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                <input name="age" required onChange={handleChange} type="number" placeholder="25" className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-[#00A699]/20 font-bold text-gray-700" />
              </div>
            </div>

            {/* Address - Full Width */}
            <div className="md:col-span-2 space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Home Address</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-4 text-gray-300" size={18} />
                <textarea name="address" required onChange={handleChange} placeholder="House no, Street, City, State" rows="2" className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-[#00A699]/20 font-bold text-gray-700 resize-none"></textarea>
              </div>
            </div>

            {/* Password */}
            <div className="md:col-span-2 space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                <input name="password" required onChange={handleChange} type="password" placeholder="••••••••" className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-[#00A699]/20 font-bold text-gray-700" />
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
                  SENDING OTP...
                </>
              ) : (
                <>
                  CREATE ACCOUNT <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* OTP Verification Modal */}
      {showOTPModal && (
        <OTPModal 
          email={formData.email} 
          onClose={() => setShowOTPModal(false)} 
        />
      )}
    </div>
  );
};

export default Signup;