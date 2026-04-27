import React from 'react';
import { motion } from 'framer-motion';
import { Globe, Heart, Sunrise, Coffee, Landmark, UtensilsCrossed } from 'lucide-react';

const AboutIndia = () => {
  const highlights = [
    {
      icon: <Sunrise className="text-[#00A699]" />,
      title: "Ancient Roots",
      desc: "Home to one of the world's oldest civilizations, where history breathes in every corner."
    },
    {
      icon: <Landmark className="text-[#00A699]" />,
      title: "Cultural Mosaic",
      desc: "28 States, 22 Official Languages, and thousands of years of shared heritage."
    },
    {
      icon: <UtensilsCrossed className="text-[#00A699]" />,
      title: "Sensory Feast",
      desc: "From the spicy street foods of Delhi to the subtle flavors of the South."
    }
  ];

  return (
    <div className="bg-white min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* --- Hero Intro --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-[#00A699] font-black uppercase tracking-[0.4em] text-xs mb-4">Discover the Essence</h2>
            <h1 className="text-6xl md:text-8xl font-black text-gray-900 tracking-tighter leading-none mb-8">
              INDIA: <br /> <span className="text-[#00A699]">A SOULFUL</span> <br /> JOURNEY.
            </h1>
            <p className="text-gray-500 font-medium text-lg leading-relaxed max-w-lg">
              India is not just a destination; it's an experience that stays with you forever. 
              From the snow-capped Himalayas in the North to the tropical backwaters of the South, 
              every mile tells a different story.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="relative"
          >
            <div className="aspect-[4/5] rounded-[4rem] overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1524492412937-b28074a5d7da" 
                alt="India Taj Mahal" 
                className="w-full h-full object-cover"
              />
            </div>
            {/* Floating Card */}
            <div className="absolute -bottom-10 -left-10 bg-white p-8 rounded-3xl shadow-xl border border-gray-100 hidden md:block">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-teal-50 rounded-full flex items-center justify-center text-[#00A699]">
                   <Globe size={24} />
                </div>
                <div>
                  <h4 className="font-black text-gray-900 leading-none">Global Heritage</h4>
                  <p className="text-xs text-gray-400 mt-1">40+ UNESCO World Heritage Sites</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* --- Core Philosophy --- */}
        <div className="bg-gray-50 rounded-[4rem] p-12 md:p-24 text-center mb-32">
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter mb-8 italic">
            "Atithi Devo Bhava"
          </h2>
          <p className="text-gray-400 font-bold uppercase tracking-widest text-sm mb-12">The Guest is God</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-left">
            {highlights.map((h, i) => (
              <div key={i} className="space-y-4">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                  {h.icon}
                </div>
                <h4 className="text-xl font-black text-gray-800">{h.title}</h4>
                <p className="text-gray-500 text-sm leading-relaxed">{h.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* --- Geography Section --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-4">
                <img src="https://images.unsplash.com/photo-1545208393-2160291ba89e" className="rounded-3xl h-64 w-full object-cover shadow-lg" alt="Mountains" />
                <img src="https://images.unsplash.com/photo-1590050853549-3663675003c2" className="rounded-3xl h-48 w-full object-cover shadow-lg" alt="Lakes" />
             </div>
             <div className="pt-12 space-y-4">
                <img src="https://images.unsplash.com/photo-1506461883276-594a12b11cf3" className="rounded-3xl h-48 w-full object-cover shadow-lg" alt="Culture" />
                <img src="https://images.unsplash.com/photo-1512343879784-a960bf40e7f2" className="rounded-3xl h-64 w-full object-cover shadow-lg" alt="Beaches" />
             </div>
          </div>
          
          <div>
            <h2 className="text-4xl font-black text-gray-900 tracking-tighter mb-6">A Land of Seven <span className="text-[#00A699]">Seasons.</span></h2>
            <p className="text-gray-500 font-medium mb-8 leading-relaxed">
              From the monsoon rains that bring the plains to life, to the crisp winters of the desert, India offers a climate for every mood. We help you find the right time and the right place to witness this transformation.
            </p>
            <ul className="space-y-4">
              {['Himalayan Majesty', 'Ganges Spirituality', 'Thar Desert Sands', 'Tropical Coastlines'].map(item => (
                <li key={item} className="flex items-center gap-3 font-black text-gray-800 text-sm">
                  <div className="w-2 h-2 rounded-full bg-[#00A699]" /> {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AboutIndia;