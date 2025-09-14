import React from "react";
import { motion } from "framer-motion";
import { Home, Search, Film, Tv, Wifi, Layers, Folder } from "lucide-react";

const SideBar = ({ isOpen, focusedIndex, onInfo }) => {
  const menuItems = [
    { name: "Gözleg", icon: <Search size={38} /> },
    { name: "Baş sahypa", icon: <Home size={38} /> },
    { name: "Film", icon: <Film size={38} /> },
    { name: "Serial", icon: <Tv size={38} /> },
    { name: "Live Sport", icon: <Wifi size={38} /> },
    { name: "Başgalar", icon: <Layers size={38} /> },
    { name: "Media", icon: <Folder size={38} /> },
  ];

  React.useEffect(() => {
    if (onInfo) onInfo(menuItems.length);
  }, [menuItems.length, onInfo]);

  return (
    <div className="h-full w-full">
      <motion.div
        initial={{ x: -464 }}
        animate={{ x: isOpen ? 0 : -464 }}
        transition={{ type: "spring", stiffness: 800, damping: 80 }}
        className="h-full w-[928px] flex"
      >
        <div className="bg-gray-900 h-full p-12 flex flex-col gap-6 w-[464px]">
          {/* Profiles */}
          <div className="flex flex-col gap-6 p">
            <div className="flex items-center gap-6">
              <div
                className={` ${
                  focusedIndex === 0
                    ? "ring-4 ring-white bg-blue-600 w-16 h-16 rounded-md flex items-center justify-center"
                    : "bg-blue-600 w-16 h-16 rounded-md flex items-center justify-center"
                }`}
              >
                <span className="text-lg">P</span>
              </div>
              {isOpen && (
                <div>
                  <p className="text-3xl font-semibold text-white">Profil</p>
                  <p
                    className={`${
                      focusedIndex === 0
                        ? "text-3xl text-white"
                        : "text-3xl text-gray-400"
                    }`}
                  >
                    99364629645
                  </p>
                </div>
              )}
            </div>
            <div className="flex items-center gap-6">
              <div
                className={`${
                  focusedIndex === 1
                    ? "ring-4 ring-white bg-gradient-to-r from-blue-500 to-orange-500 w-16 h-16 rounded-md flex items-center justify-center"
                    : "bg-gradient-to-r from-blue-500 to-orange-500 w-16 h-16 rounded-md flex items-center justify-center"
                }`}
              >
                <span className="text-xs font-bold">Kids</span>
              </div>
              {isOpen && (
                <div>
                  <p className="text-3xl font-semibold text-white">
                    Çagalar sahypasy
                  </p>
                  <p
                    className={`${
                      focusedIndex === 1
                        ? "text-3xl text-white"
                        : "text-3xl text-gray-400"
                    }`}
                  >
                    0-12
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Menu */}
          <nav className="flex flex-col gap-x-6 mt-4">
            {menuItems.map((item, idx) => (
              <div
                key={idx}
                className={`flex items-center gap-x-6 cursor-pointer text-gray-400 transition
                  ${focusedIndex === idx + 2 ? "text-white rounded-md" : ""}
                `}
              >
                <div className="p-3">{item.icon}</div>
                {isOpen && (
                  <span className="text-3xl font-medium">{item.name}</span>
                )}
              </div>
            ))}
          </nav>

          {/* Bottom Links */}
          <div className="mt-auto flex flex-col gap-6 text-gray-400 text-3xl">
            <span
              key={menuItems.length + 2}
              className={`${
                focusedIndex === menuItems.length + 2
                  ? "text-3xl text-white"
                  : "text-3xl text-gray-400"
              }`}
            >
              Sazlamalar
            </span>
            <span
              key={menuItems.length + 2 + 1}
              className={`${
                focusedIndex === menuItems.length + 2 + 1
                  ? "text-3xl text-white"
                  : "text-3xl text-gray-400"
              }`}
            >
              Goldaw
            </span>
          </div>
        </div>
        <div className="w-[464px] h-full bg-gradient-to-r from-black/80 to-black/0 text-amber-50"></div>
      </motion.div>
    </div>
  );
};

export default SideBar;
