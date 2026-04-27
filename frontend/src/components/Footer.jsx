import React from 'react';
import { Globe, Mail, Phone, MapPin,  Send } from 'lucide-react';
import { FaInstagram } from "react-icons/fa6";
import { FaFacebook } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FaYoutube } from "react-icons/fa";
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#1A1A1A] text-white pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Top Section: Newsletter */}
        <div className="bg-[#00A699] rounded-3xl p-8 md:p-12 md:px-16 mt-20 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl shadow-teal-900/20 translate-y-[-80px] mb-[-40px]">
          <div className="text-center md:text-left">
            <h2 className="text-2xl md:text-3xl font-black mb-2">Get Travel Updates</h2>
            <p className="text-teal-50 font-medium opacity-90">Subscribe to get secret deals and hidden gem alerts.</p>
          </div>
          <div className="w-full md:w-auto flex items-center bg-white/10 backdrop-blur-md rounded-2xl p-2 border border-white/20">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="bg-transparent border-none outline-none px-4 py-2 w-full md:w-64 placeholder:text-teal-100 text-white font-medium"
            />
            <button className="bg-white text-[#00A699] p-3 rounded-xl hover:bg-teal-50 transition-all active:scale-95">
              <Send size={20} />
            </button>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Column */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-[#00A699] p-2 rounded-xl">
                <Globe size={24} className="text-white" />
              </div>
              <span className="text-xl font-black tracking-tighter">
                BHARAT<span className="text-[#00A699]">DARSHAN</span>
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              Discover the Incredible India with us. We curate authentic experiences that connect travelers with the soul of the subcontinent.
            </p>
            <div className="flex gap-4">
              {[FaInstagram, FaFacebook, FaXTwitter, FaYoutube].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-full border border-gray-700 flex items-center justify-center text-gray-400 hover:bg-[#00A699] hover:text-white hover:border-[#00A699] transition-all">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-6">Quick Links</h3>
            <ul className="space-y-4 text-gray-400 text-sm">
              {['Destinations', 'Popular Trips', 'Travel Guide', 'About India', 'Contact Us'].map((item) => (
                <li key={item}>
                  <a href="#" className="hover:text-[#00A699] transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Top States */}
          <div>
            <h3 className="text-lg font-bold mb-6">Popular States</h3>
            <ul className="space-y-4 text-gray-400 text-sm">
              {['Kerala', 'Rajasthan', 'Himachal Pradesh', 'Goa', 'Uttarakhand'].map((item) => (
                <li key={item}>
                  <a href="#" className="hover:text-[#00A699] transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-6">Contact Us</h3>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-[#00A699] shrink-0" />
                <span>123 Travel Lane, Connaught Place,<br />New Delhi, India</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-[#00A699] shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-[#00A699] shrink-0" />
                <span>hello@bharatdarshan.com</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium text-gray-500 uppercase tracking-widest">
          <p>© {currentYear} Bharat Darshan. All Rights Reserved.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;