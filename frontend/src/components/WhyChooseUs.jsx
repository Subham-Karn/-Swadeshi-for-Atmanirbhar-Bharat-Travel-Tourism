import React from 'react';
import { ShieldCheck, Headphones, Map, Wallet } from 'lucide-react';

const WhyChooseUs = () => {
  const features = [
    { icon: <Map className="text-[#00A699]" />, title: "Handpicked Routes", desc: "Every itinerary is tested and verified by local experts." },
    { icon: <ShieldCheck className="text-[#00A699]" />, title: "Secure Travel", desc: "Your safety is our priority with 24/7 verified stays." },
    { icon: <Wallet className="text-[#00A699]" />, title: "Best Price", desc: "No hidden charges. We offer the most competitive rates." },
    { icon: <Headphones className="text-[#00A699]" />, title: "24/7 Support", desc: "A dedicated team to help you at every step of your journey." },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {features.map((f, i) => (
          <div key={i} className="flex flex-col items-center text-center p-6 hover:bg-teal-50 rounded-3xl transition-colors group">
            <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-white shadow-sm transition-all">
              {f.icon}
            </div>
            <h3 className="text-lg font-black text-gray-900 mb-2">{f.title}</h3>
            <p className="text-sm text-gray-500 font-medium">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default WhyChooseUs;