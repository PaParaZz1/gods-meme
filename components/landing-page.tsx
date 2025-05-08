"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import LogoCat from "@/components/ui/logo-cat.svg"

export default function LandingPage() {
  const router = useRouter()
  const [isHovering, setIsHovering] = useState(false)
  const [isClicking, setIsClicking] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Detect mobile devices
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => {
      window.removeEventListener('resize', checkMobile)
    }
  }, [])

  const handleClick = (e) => {
    e.preventDefault()
    setIsClicking(true)
    
    // Delay navigation to show the animation
    setTimeout(() => {
      router.push("/meme-generator")
    }, 800)
  }

  // For mobile, we'll show effects on touch start
  const handleTouchStart = () => {
    if (isMobile) {
      setIsHovering(true)
    }
  }

  return (
    <div className="flex flex-col items-center w-full">
      {/* Top section with cat illustration - fixed at top */}
      <div className="w-full bg-[#333333] rounded-b-[50%] flex justify-center items-center fixed top-0 left-0 right-0 z-10">
        <div className="relative">
          {/* Cat logo */}
          <Image 
            src={LogoCat} 
            alt="God's Meme Cat Logo" 
            width={400} 
            height={320}
            priority
          />
        </div>
      </div>

      {/* Spacer to push content below fixed header */}
      <div className="h-[320px]"></div>

      {/* Text content */}
      <div className="text-center px-6 py-8 max-w-xs mx-auto">
        <h1 className="text-4xl font-inika text-[#333333] mb-6">GOD'S MEME</h1>
        <p className="text-[#333333] text-lg leading-relaxed font-['Lexend']">
          Type in a keyword, and boom! 
          <br />
          God's MEME will deliver a meme so perfect, you'll question free will itself. 
          <br />
          Because apparently, even the universe runs on memes.
        </p>
      </div>

      {/* Button */}
      <div className="flex flex-col items-center w-full">
        <button
          onClick={handleClick}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          onTouchStart={handleTouchStart}
          className={`
            relative overflow-hidden bg-[#333333] text-white py-4 px-8 
            rounded-full text-2xl font-phudu w-[90%] max-w-xs mt-4 
            transform transition-all duration-300 ease-in-out
            ${isHovering ? 'scale-105 shadow-lg' : ''}
            ${isClicking ? 'scale-95' : ''}
          `}
        >
          {/* Tech effect elements */}
          <div className="absolute inset-0 overflow-hidden">
            {/* Gradient overlay */}
            <div className={`
              absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-blue-500/20
              transition-opacity duration-300 ${isHovering ? 'opacity-100' : 'opacity-0'}
            `}></div>
            
            {/* Scan lines - visible on hover or mobile */}
            {(isHovering || isMobile) && (
              <>
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent animate-scanline"></div>
                <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent animate-scanline-reverse"></div>
              </>
            )}
            
            {/* Click effect - separate from button opacity */}
            {isClicking && (
              <div className="absolute inset-0 bg-white/30 animate-pulse-out z-20"></div>
            )}
          </div>
          
          {/* Button text - stays visible during animation */}
          <span className={`relative z-10 transition-opacity duration-800 ${isClicking ? 'opacity-0' : 'opacity-100'}`}>
            LET THERE BE MEMES
          </span>
        </button>
      </div>

      {/* Animations */}
      <style jsx global>{`
        @keyframes scanline {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        @keyframes scanline-reverse {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        
        @keyframes pulse-out {
          0% { opacity: 0; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.5); }
          100% { opacity: 0; transform: scale(2); }
        }
        
        .animate-scanline {
          animation: scanline 2s linear infinite;
        }
        
        .animate-scanline-reverse {
          animation: scanline-reverse 2s linear infinite;
        }
        
        .animate-pulse-out {
          animation: pulse-out 0.8s ease-out forwards;
        }
        
        /* Make sure animations work on mobile */
        @media (max-width: 767px) {
          .animate-scanline,
          .animate-scanline-reverse,
          .animate-pulse-out {
            will-change: transform, opacity;
            transform: translateZ(0);
          }
        }
      `}</style>
    </div>
  )
}
