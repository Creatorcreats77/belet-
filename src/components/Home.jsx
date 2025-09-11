import React, { useState } from "react";
import { motion } from "framer-motion";
import { Home, Search, Film, Tv, Wifi, Layers, Folder } from "lucide-react";

export default function Home2() {
  const [isOpen, setIsOpen] = useState(true);

  const menuItems = [
    { name: "Gözleg", icon: <Search size={22} /> },
    { name: "Baş sahypa", icon: <Home size={22} /> },
    { name: "Film", icon: <Film size={22} /> },
    { name: "Serial", icon: <Tv size={22} /> },
    { name: "Live Sport", icon: <Wifi size={22} /> },
    { name: "Başgalar", icon: <Layers size={22} /> },
    { name: "Media", icon: <Folder size={22} /> },
  ];

  return (
    <div className="flex h-screen bg-black text-white">
      {/* Sidebar */}
      <motion.div
        animate={{ width: isOpen ? 250 : 80 }}
        className="bg-gray-900 h-full p-4 flex flex-col gap-6"
      >
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-gray-700 p-2 rounded-md mb-4 hover:bg-gray-600 transition"
        >
          {isOpen ? "<" : ">"}
        </button>

        {/* Profiles */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 w-10 h-10 rounded-md flex items-center justify-center">
              <span className="text-lg">P</span>
            </div>
            {isOpen && (
              <div>
                <p className="text-sm font-semibold">Profil</p>
                <p className="text-xs text-gray-400">99364629645</p>
              </div>
            )}
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-blue-500 to-orange-500 w-10 h-10 rounded-md flex items-center justify-center">
              <span className="text-xs font-bold">Kids</span>
            </div>
            {isOpen && (
              <div>
                <p className="text-sm font-semibold">Çagalar sahypasy</p>
                <p className="text-xs text-gray-400">0-12</p>
              </div>
            )}
          </div>
        </div>

        {/* Menu */}
        <nav className="flex flex-col gap-4 mt-4">
          {menuItems.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 cursor-pointer hover:text-yellow-400 transition"
            >
              {item.icon}
              {isOpen && <span className="text-sm font-medium">{item.name}</span>}
            </div>
          ))}
        </nav>

        {/* Bottom Links */}
        <div className="mt-auto flex flex-col gap-3 text-gray-400 text-sm">
          <span className="hover:text-white cursor-pointer">Sazlamalar</span>
          <span className="hover:text-white cursor-pointer">Goldaw</span>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 bg-gray-800 p-6 overflow-y-auto">
        {/* Hero Section */}
        <div className="relative rounded-2xl overflow-hidden shadow-lg">
          <img
            src="https://image.tmdb.org/t/p/w500/wMbWZSSRxlwDAmOSqDV5upiulbS.jpg"
            alt="Hero background"
            className="w-full h-64 object-cover opacity-70"
            loading="lazy"
          />
          <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-center p-6 bg-gradient-to-t from-black/80 to-transparent">
            <h1 className="text-3xl font-bold">Menden SORASAŇ...</h1>
            <p className="text-sm text-gray-300 max-w-lg mt-2">
              Ol harby gulluga gidip, öýine talyp bolup dolanýar. Durmuş toyuny
toylaýan günü hem ona kin.
            </p>
            <button className="mt-4 bg-yellow-500 hover:bg-yellow-400 px-4 py-2 rounded-lg text-black font-semibold">
              Giňişleýin
            </button>
          </div>
        </div>

        {/* Continue Watching */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-4">Dowamyny serediň</h2>
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="bg-gray-700 h-32 rounded-xl flex items-center justify-center"
              >
                <span className="text-gray-400">Movie {item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
