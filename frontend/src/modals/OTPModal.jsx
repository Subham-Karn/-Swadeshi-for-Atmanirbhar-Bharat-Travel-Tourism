import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, MailOpen } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import toast from 'react-hot-toast';

const OTPModal = ({ email, onClose }) => {
  const { verifyOtp, requestSignup, loading } = useAuthStore();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  
  // --- Timer State ---
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  // Timer Logic
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;
    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);
    if (element.value && element.nextSibling) {
      element.nextSibling.focus();
    }
  };

  const handleVerify = async () => {
    const code = otp.join("");
    const loadId = toast.loading("Verifying...");
    try {
      await verifyOtp(email, code);
      toast.success("Account created! Welcome.", { id: loadId });
      window.location.href = "/";
    } catch (err) {
      toast.error(err, { id: loadId });
    }
  };

  // --- Resend Logic ---
  const handleResend = async () => {
    if (!canResend) return;
    
    const loadId = toast.loading("Resending OTP...");
    try {
      await requestSignup({ email, resend: true }); 
      
      toast.success("New OTP sent!", { id: loadId });
      setTimer(30); 
      setCanResend(false);
      setOtp(['', '', '', '', '', '']);
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
                className="w-10 h-12 md:w-12 md:h-14 text-center text-xl font-black bg-gray-50 border-2 border-transparent focus:border-[#00A699] focus:bg-white rounded-xl outline-none transition-all"
                value={data}
                onChange={e => handleChange(e.target, index)}
                onFocus={e => e.target.select()}
              />
            ))}
          </div>

          <button 
            onClick={handleVerify}
            disabled={loading || otp.join("").length < 6}
            className={`w-full py-4 rounded-2xl font-black tracking-widest shadow-lg transition-all flex items-center justify-center gap-2
              ${loading ? 'bg-teal-200 cursor-not-allowed' : 'bg-[#00A699] hover:bg-[#008f84] text-white'}`}
          >
            {loading ? "VERIFYING..." : "VERIFY & SIGN UP"}
          </button>
          
          {/* --- Resend UI --- */}
          <div className="mt-8 text-sm font-bold text-gray-400">
            {canResend ? (
              <p>
                Didn't receive the code? 
                <button 
                  onClick={handleResend}
                  className="text-[#00A699] ml-1 hover:underline cursor-pointer"
                >
                  Resend OTP
                </button>
              </p>
            ) : (
              <p>
                Resend OTP in <span className="text-gray-900">{timer}s</span>
              </p>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default OTPModal;