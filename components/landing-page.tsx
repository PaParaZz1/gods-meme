"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"

export default function LandingPage() {
  const router = useRouter()
  const [isHovering, setIsHovering] = useState(false)
  const [isClicking, setIsClicking] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isSmallMobile, setIsSmallMobile] = useState(false)
  const [gifPlayed, setGifPlayed] = useState(false)
  
  // Animation states
  const [isLoaded, setIsLoaded] = useState(false)
  const [showLogo, setShowLogo] = useState(false)
  const [showTitle, setShowTitle] = useState(false)
  const [showText, setShowText] = useState(false)
  const [showButton, setShowButton] = useState(false)
  
  // Ref for the GIF element
  const gifRef = useRef(null)

  // Handle touch start for mobile
  const handleTouchStart = () => {
    setIsHovering(true)
  }

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
      setIsSmallMobile(window.innerWidth <= 375)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => {
      window.removeEventListener('resize', checkMobile)
    }
  }, [])
  
  // Sequence the animations - compressed to 1800ms total
  useEffect(() => {
    // Start animations after a short delay
    const loadTimer = setTimeout(() => setIsLoaded(true), 200)
    
    // Sequence the elements with compressed timing
    const logoTimer = setTimeout(() => setShowLogo(true), 600)
    const titleTimer = setTimeout(() => setShowTitle(true), 1200)
    const textTimer = setTimeout(() => setShowText(true), 2000)
    const buttonTimer = setTimeout(() => setShowButton(true), 3000)
    
    // Set GIF to played after its duration 
    const gifTimer = setTimeout(() => setGifPlayed(true), 4000)
    
    // Clean up timers
    return () => {
      clearTimeout(loadTimer)
      clearTimeout(logoTimer)
      clearTimeout(titleTimer)
      clearTimeout(textTimer)
      clearTimeout(buttonTimer)
      clearTimeout(gifTimer)
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

  // Prevent button animation on mobile
  const buttonAnimationClass = isMobile ? '' : (isHovering ? 'scale-105 shadow-lg' : '')

  return (
    <div className={`flex flex-col items-center w-full transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      {/* Top section with cat illustration - fixed at top */}
      <div className="w-full bg-[#333333] fixed top-0 left-0 right-0 z-10" style={{ borderBottomLeftRadius: '75% 18%', borderBottomRightRadius: '75% 18%' }}>
        <div className="flex justify-center items-center w-full">
          {/* Cat logo - using GIF animation that plays once */}
          <div className={`flex justify-center items-center w-full transition-all duration-300 ease-in-out transform ${showLogo ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
            {/* Show GIF initially, then switch to static image */}
            <div className="flex justify-center w-full">
              {!gifPlayed ? (
                <Image 
                  ref={gifRef}
                  src="/landing_cat.gif" 
                  alt="God's Meme Cat Logo Animation" 
                  width={isSmallMobile ? 240 : 400} 
                  height={isSmallMobile ? 200 : 320}
                  className="transform-gpu mx-auto"
                  style={{ 
                    width: isSmallMobile ? '240px' : '400px',
                    height: 'auto' 
                  }}
                  priority
                />
              ) : (
                <Image 
                  src="/landing_cat_waiting.gif" 
                  alt="God's Meme Cat Logo" 
                  width={isSmallMobile ? 240 : 400} 
                  height={isSmallMobile ? 200 : 320}
                  className="transform-gpu mx-auto"
                  style={{ 
                    width: isSmallMobile ? '240px' : '400px',
                    height: 'auto' 
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Spacer to push content below fixed header - responsive height */}
      <div className={`${isSmallMobile ? 'h-[200px]' : 'h-[320px]'}`}></div>

      {/* Text content - adjust for small screens */}
      <div className="text-center px-6 py-8 max-w-xs mx-auto">
        <h1 className={`font-inika text-[#333333] mb-6 ${isSmallMobile ? 'text-3xl' : 'text-4xl'} transition-all duration-300 ease-in-out transform ${showTitle ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
          GOD'S MEME
        </h1>
        <p className={`text-[#333333] leading-relaxed font-['Lexend'] ${isSmallMobile ? 'text-md' : 'text-lg'} transition-all duration-300 ease-in-out transform ${showText ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
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
            relative overflow-hidden text-white py-4 px-8 
            rounded-full text-2xl font-phudu w-[90%] max-w-xs mt-4 
            transform transition-all duration-300 ease-in-out
            ${buttonAnimationClass}
            ${isClicking ? 'scale-95' : 'bg-[#333333]'}
            ${showButton ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
          `}
        >
          {/* Color transition overlay - radial gradient from center */}
          <div className={`
            absolute inset-0 bg-[#333333]
            transition-all duration-800 ease-in-out
            ${isClicking ? 'button-click-effect' : ''}
          `}></div>
          
          {/* Button text */}
          <span className="relative z-10">LET THERE BE MEMES</span>
        </button>
      </div>

      {/* CSS for animations */}
      <style jsx>{`
        .button-click-effect {
          background: radial-gradient(circle, #1a365d 0%, #333333 100%);
          animation: pulseGradient 0.8s ease forwards;
        }
        
        @keyframes pulseGradient {
          0% {
            background: #333333;
          }
          50% {
            background: radial-gradient(circle, #1a365d 30%, #333333 100%);
          }
          100% {
            background: radial-gradient(circle, #1a365d 60%, #333333 100%);
          }
        }
      `}</style>
    </div>
  )
}
