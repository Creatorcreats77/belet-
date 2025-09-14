import React, { useEffect } from "react";
import { motion } from "framer-motion";
import logo from "../assets/logo.png"; 

export default function OnBoardingPage({ onFinish }) {

useEffect(() => {
    const timer = setTimeout(() => {
      if (onFinish) onFinish();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="overflow-hidden">
        <div className="h-screen w-screen bg-black flex items-center justify-center relative">
      <motion.div
        className="absolute bottom-1/2 left-1/2 w-[100%] aspect-square rounded-full bg-blue-500 blur-3xl pointer-events-none"
        initial={{ opacity: 0.9, scale: 0.5 }}      
        animate={{ opacity: 0, scale: 1.6 }}         
        transition={{ duration: 5, ease: "easeOut" }}
      />

      <motion.img
        src={logo}
        alt="Logo"
        className="w-[50%] h-[50%] z-10 object-cover"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.8, ease: "easeOut" }}
      />
    </div>
    </div>
  );
}
