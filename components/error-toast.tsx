"use client"

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

interface ErrorToastProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
  autoHideDuration?: number;
}

export default function ErrorToast({ 
  message, 
  isVisible, 
  onClose, 
  autoHideDuration = 5000
}: ErrorToastProps) {
  const [isButtonTouchActive, setIsButtonTouchActive] = useState(false);
  
  // Auto-hide the error toast after specified duration
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (isVisible && autoHideDuration > 0) {
      timer = setTimeout(() => {
        onClose();
      }, autoHideDuration);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isVisible, autoHideDuration, onClose]);
  
  // Prevent body scrolling when error toast is shown
  useEffect(() => {
    const preventScroll = (e: TouchEvent) => {
      e.preventDefault();
    };
    
    if (isVisible) {
      // Disable scrolling on body
      document.body.style.overflow = 'hidden';
      
      // Add passive: false to override default browser behavior
      document.addEventListener('touchmove', preventScroll, { passive: false });
    } else {
      // Re-enable scrolling when toast is hidden
      document.body.style.overflow = 'auto';
      document.removeEventListener('touchmove', preventScroll);
    }
    
    return () => {
      document.body.style.overflow = 'auto';
      document.removeEventListener('touchmove', preventScroll);
    };
  }, [isVisible]);
  
  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Background overlay/mask */}
          <motion.div 
            className="fixed inset-0 bg-black/50 z-40 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
          />
          
          <motion.div 
            className="fixed bottom-20 inset-x-0 mx-auto z-50 w-full px-2 max-w-sm pointer-events-auto"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <div className="bg-white rounded-2xl shadow-lg p-5 flex flex-col items-center">
              <div className="mb-3">
                <Image 
                  src="/warning.png" 
                  alt="Warning"
                  width={50}
                  height={50}
                />
              </div>
              <p className="text-center text-[#333333] font-lexend mb-4 text-md">
                {message}
              </p>
              <button 
                onClick={onClose}
                className={`w-4/5 bg-[#333333] text-white py-3 rounded-full font-phudu text-lg
                  transform transition-all duration-300 relative overflow-hidden group hover:shadow-lg active:scale-95
                  ${isButtonTouchActive ? 'scale-[0.98] shadow-inner' : ''}`}
              >
                <span className="relative z-10 group-hover:tracking-wider">GOT IT</span>
                {/* Hover background effect */}
                <div className={`absolute inset-0 bg-gradient-to-r from-[#333333] via-[#444444] to-[#333333] transition-opacity duration-300 ${isButtonTouchActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}></div>
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
} 