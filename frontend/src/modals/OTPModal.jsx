import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, ShieldCheck, MailOpen } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import toast from 'react-hot-toast';

const OTPModal = ({ email, onClose }) => {
  const { verifyOtp , loading} = useAuthStore();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;
    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);
    if (element.nextSibling) {
      element.nextSibling.focus();
    }
  };

const handleVerify = async () => {
    const code = otp.join("");
    const loadId = toast.loading("Verifying...");
    
    try {
      await verifyOtp(email, code);
      toast.success("Account created! Welcome.", { id: loadId });
      // Navigation is usually handled here or in the Store
      window.location.href = "/"; 
    } catch (err) {
      toast.error(err, { id: loadId });
    }
  };

  return (
    <div className="fixed inset-0 z-200 flex items-center justify-center p-6 bg-black/60 ">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white w-full max-w-md rounded-[2.5rem] p-10 relative overflow-hidden"
      >
        <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-gray-900">
          <X size={24} />
        </button>

        <div className="text-center">
          <div className="w-20 h-20 bg-teal-50 text-[#00A699] rounded-3xl flex items-center justify-center mx-auto mb-6">
            <MailOpen size={40} />
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-2 tracking-tight">Verify Your Email</h2>
          <p className="text-gray-500 text-sm font-medium mb-8">
            We've sent a 6-digit code to <br/> <span className="text-gray-900 font-bold">{email}</span>
          </p>

          <div className="flex gap-2 justify-center mb-10">
            {otp.map((data, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                className="w-12 h-14 text-center text-xl font-black bg-gray-50 border-2 border-transparent focus:border-[#00A699] focus:bg-white rounded-xl outline-none transition-all"
                value={data}
                onChange={e => handleChange(e.target, index)}
                onFocus={e => e.target.select()}
              />
            ))}
          </div>

        <button 
          onClick={handleVerify}
          disabled={loading || otp.join("").length < 6} // Disable if loading or OTP incomplete
          className={`w-full py-4 rounded-2xl font-black tracking-widest shadow-lg transition-all flex items-center justify-center gap-2
            ${loading ? 'bg-teal-200 cursor-not-allowed' : 'bg-[#00A699] hover:bg-[#008f84] text-white'}`}
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              VERIFYING...
            </>
          ) : (
            "VERIFY & SIGN UP"
          )}
        </button>
          
          <p className="mt-6 text-xs font-bold text-gray-400">
            Didn't receive the code? <button className="text-[#00A699] hover:underline">Resend OTP</button>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default OTPModal;