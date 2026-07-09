import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { 
  User, Mail, Shield, Terminal, Cpu, 
  Layers, Compass, HelpCircle, Laptop, HardDrive 
} from 'lucide-react';

const SettingsPage = () => {
  const { user } = useAuthStore();
  const [deviceSpecs, setDeviceSpecs] = useState({
    os: "Detecting OS...",
    browser: "Detecting Browser...",
    memory: "Calculating...",
    platform: "Detecting Platform..."
  });
 

  useEffect(() => {
    const ua = window.navigator.userAgent;
    const platform = window.navigator.platform;
    
    // 1. Detect Operating System Matrix
    let detectedOS = "Unknown OS";
    if (ua.indexOf("Win") !== -1) detectedOS = "Windows OS";
    if (ua.indexOf("Mac") !== -1) detectedOS = "macOS";
    if (ua.indexOf("X11") !== -1) detectedOS = "UNIX OS";
    if (ua.indexOf("Linux") !== -1) detectedOS = "Linux Core Cluster";

    // 2. Detect Browser Engine
    let detectedBrowser = "Unknown Browser";
    if (ua.indexOf("Chrome") !== -1) detectedBrowser = "Google Chrome";
    if (ua.indexOf("Safari") !== -1 && ua.indexOf("Chrome") === -1) detectedBrowser = "Apple Safari";
    if (ua.indexOf("Firefox") !== -1) detectedBrowser = "Mozilla Firefox";
    if (ua.indexOf("Edg") !== -1) detectedBrowser = "Microsoft Edge";

    // 3. Approximate RAM allocation via DeviceMemory API
    // Falls back gracefully if restricted by browser context security boundaries
    const ramApproximation = window.navigator.deviceMemory 
      ? `${window.navigator.deviceMemory} GB Operational RAM` 
      : "8 GB RAM (Estimated)";

    setDeviceSpecs({
      os: detectedOS,
      browser: detectedBrowser,
      memory: ramApproximation,
      platform: platform || "Web Environment Node"
    });
  }, []);

  return (
    <div className=" min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* --- Top Layout Header Row --- */}
        <div>
          <div className="inline-flex items-center gap-1 px-3 py-1 bg-white border border-slate-200 rounded-lg shadow-3xs mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00A699] animate-pulse"></span>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
              Account Integrity Hub
            </span>
          </div>
          <h1 className="text-4xl font-black text-slate-950 tracking-tight uppercase">
            SYSTEM <span className="text-[#00A699]">SETTINGS</span>
          </h1>
          <p className="text-xs font-bold text-slate-400 mt-0.5">
            Review your authenticated identity data and runtime terminal specifications.
          </p>
        </div>

        {/* --- Layout Distribution Split Grid --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Account Identity Inputs */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/60 p-6 md:p-8 shadow-2xs space-y-6">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 border border-slate-200/40 flex items-center justify-center">
                <User size={18} />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900 leading-tight">Identity Registry</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Primary Account Identifiers</p>
              </div>
            </div>

            <div className="space-y-5">
              {/* Profile Name Context */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block pl-1">
                  Profile Name Context
                </label>
                <div className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200/60 rounded-xl font-black text-xs text-slate-800 flex items-center gap-3 cursor-not-allowed select-all">
                  <User size={15} className="text-slate-400 shrink-0" />
                  <span>{user?.name || "Subham Kumar"}</span>
                </div>
              </div>

              {/* Communications Anchor */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block pl-1">
                  Communications Anchor
                </label>
                <div className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200/60 rounded-xl font-bold text-xs text-slate-600 flex items-center gap-3 cursor-not-allowed select-all">
                  <Mail size={15} className="text-slate-400 shrink-0" />
                  <span>{user?.email || "developer.subham@gmail.com"}</span>
                </div>
              </div>

              {/* System Authority Level */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block pl-1">
                  System Authority Level
                </label>
                <div className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200/60 rounded-xl font-black text-xs text-[#00A699] tracking-wider uppercase flex items-center gap-3 cursor-not-allowed select-all">
                  <Shield size={15} className="text-[#00A699] shrink-0" />
                  <span>{user?.role || "ADMIN"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Dynamic Machine Diagnostics via UserAgent */}
          <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200/60 p-6 shadow-2xs space-y-5">
            <h4 className="font-black text-slate-950 text-sm border-b border-slate-50 pb-3 uppercase tracking-wider">
              Machine Diagnostics
            </h4>

            <div className="space-y-3">
              
              {/* Dynamic OS block */}
              <div className="flex items-center gap-3 p-4 bg-slate-50 border border-slate-100 rounded-xl">
                <Cpu size={16} className="text-slate-400 shrink-0" />
                <div className="min-w-0">
                  <span className="block text-[8px] font-black text-slate-400 uppercase tracking-wider">Operating Architecture</span>
                  <p className="text-slate-800 font-black text-xs truncate">{deviceSpecs.os}</p>
                </div>
              </div>

              {/* Dynamic Browser Engine block */}
              <div className="flex items-center gap-3 p-4 bg-slate-50 border border-slate-100 rounded-xl">
                <Terminal size={16} className="text-slate-400 shrink-0" />
                <div className="min-w-0">
                  <span className="block text-[8px] font-black text-slate-400 uppercase tracking-wider">Interface Engine</span>
                  <p className="text-slate-800 font-black text-xs truncate">{deviceSpecs.browser}</p>
                </div>
              </div>

              {/* Dynamic RAM approximation block */}
              <div className="flex items-center gap-3 p-4 bg-slate-50 border border-slate-100 rounded-xl">
                <Layers size={16} className="text-slate-400 shrink-0" />
                <div className="min-w-0">
                  <span className="block text-[8px] font-black text-slate-400 uppercase tracking-wider">Dynamic Cache Space</span>
                  <p className="text-slate-800 font-black text-xs truncate">{deviceSpecs.memory}</p>
                </div>
              </div>

              {/* Dynamic Platform Base block */}
              <div className="flex items-center gap-3 p-4 bg-slate-50 border border-slate-100 rounded-xl">
                <Laptop size={16} className="text-slate-400 shrink-0" />
                <div className="min-w-0">
                  <span className="block text-[8px] font-black text-slate-400 uppercase tracking-wider">System Interface Matrix</span>
                  <p className="text-slate-800 font-black text-xs truncate">{deviceSpecs.platform}</p>
                </div>
              </div>

              {/* Legal Advisory Banner Notice */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-2 text-[10px] text-slate-400 font-bold leading-normal">
                <HelpCircle size={14} className="text-slate-400 shrink-0 mt-0.5" />
                <p>
                  These profile registers are immutable. For credentials updates or cryptographic resets, please consult server root protocols.
                </p>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default SettingsPage;