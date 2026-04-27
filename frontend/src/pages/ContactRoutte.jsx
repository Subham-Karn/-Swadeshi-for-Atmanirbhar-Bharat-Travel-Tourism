import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, MessageSquare  } from 'lucide-react';
import { FaInstagram as Instagram } from "react-icons/fa6";
import { FaFacebook as Facebook } from "react-icons/fa";
import { FaXTwitter as  XTwitter } from "react-icons/fa6";
import { FaYoutube as Youtube } from "react-icons/fa";
const ContactRoute = () => {
  const contactInfo = [
    {
      icon: <Phone size={24} />,
      title: "Call Us",
      detail: "+91 98765 43210",
      sub: "Mon-Sat, 9am - 6pm IST"
    },
    {
      icon: <Mail size={24} />,
      title: "Email Us",
      detail: "hello@bharatdarshan.com",
      sub: "We reply within 24 hours"
    },
    {
      icon: <MapPin size={24} />,
      title: "Visit Us",
      detail: "Connaught Place, New Delhi",
      sub: "India - 110001"
    }
  ];

  return (
    <div className="bg-white min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* --- Header Section --- */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[#00A699] font-black uppercase tracking-[0.4em] text-xs mb-4"
          >
            Stay Connected
          </motion.h2>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black text-gray-900 tracking-tighter leading-none"
          >
            LET'S START YOUR <br /> <span className="text-[#00A699]">NEXT STORY.</span>
          </motion.h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          
          {/* --- Left: Contact Form --- */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gray-50 p-8 md:p-12 rounded-[3rem] border border-gray-100"
          >
            <h3 className="text-2xl font-black text-gray-900 mb-8 flex items-center gap-3">
              <MessageSquare className="text-[#00A699]" /> Drop a Message
            </h3>
            
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Full Name</label>
                  <input type="text" placeholder="John Doe" className="w-full px-6 py-4 rounded-2xl bg-white border-none outline-none focus:ring-2 focus:ring-[#00A699]/20 font-bold text-gray-700" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Email Address</label>
                  <input type="email" placeholder="john@example.com" className="w-full px-6 py-4 rounded-2xl bg-white border-none outline-none focus:ring-2 focus:ring-[#00A699]/20 font-bold text-gray-700" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Subject</label>
                <select className="w-full px-6 py-4 rounded-2xl bg-white border-none outline-none focus:ring-2 focus:ring-[#00A699]/20 font-bold text-gray-700 appearance-none">
                  <option>Booking Inquiry</option>
                  <option>Custom Trip Planning</option>
                  <option>Partnership</option>
                  <option>Other</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Your Message</label>
                <textarea rows="5" placeholder="Tell us about your dream trip..." className="w-full px-6 py-4 rounded-2xl bg-white border-none outline-none focus:ring-2 focus:ring-[#00A699]/20 font-bold text-gray-700 resize-none"></textarea>
              </div>

              <button className="w-full bg-[#00A699] text-white py-5 rounded-2xl font-black tracking-widest hover:bg-[#008f84] transition-all flex items-center justify-center gap-3 shadow-lg shadow-teal-100 group">
                SEND MESSAGE <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>
            </form>
          </motion.div>

          {/* --- Right: Contact Info Cards --- */}
          <div className="space-y-12 py-6">
            <div className="grid grid-cols-1 gap-8">
              {contactInfo.map((item, index) => (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  key={index} 
                  className="flex items-center gap-6 group"
                >
                  <div className="w-16 h-16 bg-teal-50 text-[#00A699] rounded-2xl flex items-center justify-center group-hover:bg-[#00A699] group-hover:text-white transition-all duration-300">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="text-gray-400 text-[10px] font-black uppercase tracking-widest">{item.title}</h4>
                    <p className="text-xl font-black text-gray-900 mt-1">{item.detail}</p>
                    <p className="text-sm text-gray-400 font-medium">{item.sub}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <hr className="border-gray-100" />

            {/* Social Connection */}
            <div>
              <h4 className="text-gray-900 font-black text-lg mb-6">Follow the Journey</h4>
              <div className="flex gap-4">
                {[Instagram, XTwitter, Facebook, Youtube].map((Icon, i) => (
                  <button key={i} className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:border-[#00A699] hover:text-[#00A699] transition-all">
                    <Icon size={20} />
                  </button>
                ))}
              </div>
            </div>

            {/* Trust Badge */}
            <div className="bg-[#00A699] p-8 rounded-[2.5rem] text-white">
              <h4 className="font-black text-xl mb-2">Plan your custom trip?</h4>
              <p className="text-teal-50 text-sm font-medium mb-6 opacity-80">Our travel designers are just a message away from crafting your perfect Indian itinerary.</p>
              <button className="bg-white text-[#00A699] px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest">
                Start Chatting
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ContactRoute;