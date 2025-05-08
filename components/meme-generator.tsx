"use client"

import { useState, useRef } from "react"
import { ChevronsDown } from "lucide-react"
import Image from "next/image"

export default function MemeGenerator() {
  const [selectedTab, setSelectedTab] = useState("sentiment")
  const [waterLevels, setWaterLevels] = useState({
    sentiment: { happiness: 3, love: 3, anger: 3, sorrow: 3, fear: 3, hate: 3 },
    intention: { humor: 3, sarcasm: 3, rant: 3, encourage: 3, "self-mockery": 3, expressive: 3 },
    style: { motivational: 3, funny: 3, wholesome: 3, dark: 3, romantic: 3, sarcastic: 3 }
  })
  const [draggedItem, setDraggedItem] = useState<string | null>(null)
  const godAreaRef = useRef<HTMLDivElement>(null)
  const [isInputFocused, setIsInputFocused] = useState(false)
  const [isBlending, setIsBlending] = useState(false)
  const [isTouchActive, setIsTouchActive] = useState(false)

  const tabContent = {
    sentiment: {
      title: "Sentiment",
      items: ["happiness", "love", "anger", "sorrow", "fear", "hate"]
    },
    intention: {
      title: "Intention",
      items: ["humor", "sarcasm", "rant", "encourage", "self-mockery", "expressive"]
    },
    style: {
      title: "Style",
      items: ["motivational", "funny", "wholesome", "dark", "romantic", "sarcastic"]
    }
  }

  const currentTabContent = tabContent[selectedTab as keyof typeof tabContent]

  const toggleWaterLevel = (item: keyof typeof waterLevels.sentiment | keyof typeof waterLevels.intention | keyof typeof waterLevels.style) => {
    setWaterLevels(prev => {
      const currentLevel = prev[selectedTab][item]
      // only increase the level if it's not already at the max
      if (currentLevel === 3) {
        return prev
      }
      const newLevel = currentLevel % 3 + 1
      
      return {
        ...prev,
        [selectedTab]: {
          ...prev[selectedTab as keyof typeof waterLevels],
          [item]: newLevel
        }
      }
    })
  }

  const getWaterLevel = (item: string) => {
    return waterLevels[selectedTab as keyof typeof waterLevels][item as any] || 0
  }

  const handleDragStart = (item: string) => {
    setDraggedItem(item)
  }

  // handle drag end event for desktop/pc devices
  const handleDragEnd = () => {
    if (draggedItem && godAreaRef.current) {
      const godRect = godAreaRef.current.getBoundingClientRect()
      
      if (
        typeof window.event !== 'undefined' && 
        'clientX' in window.event && 
        'clientY' in window.event
      ) {
        const e = window.event as MouseEvent
        if (
          e.clientX >= godRect.left &&
          e.clientX <= godRect.right &&
          e.clientY >= godRect.top &&
          e.clientY <= godRect.bottom
        ) {
          setWaterLevels(prev => {
            const currentLevel = prev[selectedTab as keyof typeof waterLevels][draggedItem as any]
            if (currentLevel > 0) {
              return {
                ...prev,
                [selectedTab]: {
                  ...prev[selectedTab as keyof typeof waterLevels],
                  [draggedItem]: currentLevel - 1
                }
              }
            }
            return prev
          })
        }
      }
    }
    setDraggedItem(null)
  }

  // add touch event handler for mobile devices
  const handleTouchStart = (item: string) => {
    setDraggedItem(item)
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (draggedItem && godAreaRef.current) {
      const godRect = godAreaRef.current.getBoundingClientRect()
      const touch = e.changedTouches[0]
      
      if (
        touch.clientX >= godRect.left &&
        touch.clientX <= godRect.right &&
        touch.clientY >= godRect.top &&
        touch.clientY <= godRect.bottom
      ) {
        setWaterLevels(prev => {
          const currentLevel = prev[selectedTab as keyof typeof waterLevels][draggedItem as any]
          if (currentLevel > 0) {
            return {
              ...prev,
              [selectedTab]: {
                ...prev[selectedTab as keyof typeof waterLevels],
                [draggedItem]: currentLevel - 1
              }
            }
          }
          return prev
        })
      }
    }
    setDraggedItem(null)
  }

  const handleBlendClick = () => {
    setIsBlending(true)
    // 模拟处理时间，3秒后重置状态
    setTimeout(() => {
      setIsBlending(false)
    }, 3000)
  }

  const handleButtonTouchStart = () => {
    setIsTouchActive(true)
  }

  const handleButtonTouchEnd = () => {
    // 短暂延迟重置状态，让用户能看到效果
    setTimeout(() => {
      setIsTouchActive(false)
    }, 300)
  }

  return (
    <div className="flex flex-col items-center max-w-md mx-auto min-h-screen">
      {/* Header */}
      <div className="w-full flex flex-col items-center relative px-6 pt-8">
        {/* Question mark button positioned absolutely to the right */}
        <div className="absolute right-6 top-10">
          <button className="w-6 h-6 bg-[#333333] rounded-full flex items-center justify-center text-white text-xl">
            ?
          </button>
        </div>
        
        {/* Centered logo and title */}
        <div className="flex flex-col items-center">
          <div className="bg-[#333333] rounded-full w-16 h-16 flex items-center justify-center mb-2">
            <Image src="/logo_head.png" alt="God's Meme Logo" width={96} height={96} />
          </div>
          <h1 className="text-3xl font-inika text-[#333333]">GOD'S MEME</h1>
        </div>
      </div>

      {/* Search Input with curved lines */}
      <div className="w-full mt-4 relative">
        <div className="relative px-8">
          <input
            type="text"
            placeholder="Enter your keywords (e.g. cat, funny)"
            className={`w-full px-6 py-3 rounded-full border-2 border-[#333333] text-left font-lexend transition-colors duration-300 focus:outline-none ${
              isInputFocused 
                ? "bg-[#333333] text-white placeholder-white/70" 
                : "bg-white text-[#333333] placeholder-[#666666]"
            }`}
            style={{ textAlign: 'left' }}
            onFocus={() => setIsInputFocused(true)}
            onBlur={() => setIsInputFocused(false)}
          />
        </div>
        
        {/* Left curved line - flatter curve from edge to padding */}
        <div className="absolute left-0 top-1/4 -translate-y-1/2 pointer-events-none">
          <svg width="32" height="20" viewBox="0 0 32 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 5 Q10 15, 32 20" stroke="#333333" strokeWidth="2" />
          </svg>
        </div>
        
        {/* Right curved line - flatter curve from padding to edge */}
        <div className="absolute right-0 top-1/4 -translate-y-1/2 pointer-events-none">
          <svg width="32" height="20" viewBox="0 0 32 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M32 5 Q22 15, 0 20" stroke="#333333" strokeWidth="2" />
          </svg>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="w-full px-16 my-6">
        <div className="flex space-x-2 items-center justify-center">
          <button
            className={`flex items-center rounded-full relative overflow-hidden transform transition-all duration-300 ease-in-out active:scale-95 ${
              selectedTab === "sentiment" 
                ? "pr-3 bg-[#EEEEEE] shadow-inner" 
                : "bg-white hover:bg-gray-50 hover:shadow-sm"
            }`}
            onClick={() => setSelectedTab("sentiment")}
          >
            <div className={`relative z-10 transition-transform duration-300 ${selectedTab === "sentiment" ? "scale-100" : ""}`}>
              <Image src="/sentiment.png" alt="Sentiment" width={49} height={49} className="mr-1" />
            </div>
            {selectedTab === "sentiment" && (
              <span className="font-inika text-sm relative z-10 animate-fadeIn">
                Sentiment
              </span>
            )}
            {selectedTab === "sentiment" && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
            )}
          </button>
          <button
            className={`flex items-center rounded-full relative overflow-hidden transform transition-all duration-300 ease-in-out active:scale-95 ${
              selectedTab === "intention" 
                ? "pr-3 bg-[#EEEEEE] shadow-inner" 
                : "bg-white hover:bg-gray-50 hover:shadow-sm"
            }`}
            onClick={() => setSelectedTab("intention")}
          >
            <div className={`relative z-10 transition-transform duration-300 ${selectedTab === "intention" ? "scale-100" : ""}`}>
              <Image src="/intention.png" alt="Intention" width={49} height={49} className="mr-1" />
            </div>
            {selectedTab === "intention" && (
              <span className="font-inika text-sm relative z-10 animate-fadeIn">
                Intention
              </span>
            )}
            {selectedTab === "intention" && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
            )}
          </button>
          <button
            className={`flex items-center rounded-full relative overflow-hidden transform transition-all duration-300 ease-in-out active:scale-95 ${
              selectedTab === "style" 
                ? "pr-3 bg-[#EEEEEE] shadow-inner" 
                : "bg-white hover:bg-gray-50 hover:shadow-sm"
            }`}
            onClick={() => setSelectedTab("style")}
          >
            <div className={`relative z-10 transition-transform duration-300 ${selectedTab === "style" ? "scale-100" : ""}`}>
              <Image src="/style.png" alt="Style" width={49} height={49} className="mr-1" />
            </div>
            {selectedTab === "style" && (
              <span className="font-inika text-sm relative z-10 animate-fadeIn">
                Style
              </span>
            )}
            {selectedTab === "style" && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
            )}
          </button>
        </div>
      </div>

      {/* Dynamic Content Grid based on selected tab */}
      <div className="w-full px-2">
        <div className="bg-[#EEEEEE] rounded-lg p-4 mx-2">
          <div className="grid grid-cols-6 gap-2">
            {currentTabContent.items.map((item) => (
              <div 
                key={item} 
                className="flex flex-col items-center cursor-pointer"
                onClick={() => toggleWaterLevel(item)}
              >
                <div 
                  className="h-[78px] flex items-center justify-center relative"
                  draggable={getWaterLevel(item) > 0}
                  onDragStart={() => handleDragStart(item)}
                  onDragEnd={handleDragEnd}
                  onTouchStart={() => handleTouchStart(item)}
                  onTouchEnd={handleTouchEnd}
                >
                  <Image 
                    src={`/glass_base.png`} 
                    alt={item} 
                    width={48} 
                    height={72} 
                    className={`object-contain relative z-10 ${draggedItem === item ? 'opacity-50' : ''}`}
                  />
                  
                  {getWaterLevel(item) > 0 && (
                    <div className="absolute inset-0 scale-220 bottom-5 left-[calc(-4px)] flex items-center justify-center z-0">
                      <Image 
                        src={`/water_level${getWaterLevel(item)}.png`}
                        alt={`Water level ${getWaterLevel(item)}`}
                        width={48}
                        height={72}
                        className={`object-contain transition-all duration-300 ease-out ${draggedItem === item ? 'opacity-50' : ''}`}
                      />
                    </div>
                  )}
                </div>
                <span className="text-xs font-inika text-center mt-1">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Character Display */}
      <div 
        ref={godAreaRef}
        className={`w-full flex justify-center mt-4 relative ${draggedItem ? 'bg-[#EEEEEE]/50 rounded-xl border-2 border-dashed border-[#333333]/30' : ''}`}
      >
        <div className="relative">
          <Image src="/meme_god_static.png" alt="Meme God" width={392} height={230} />
        </div>
      </div>

      {/* Blend Button */}
      <div className="w-full px-6 mt-8 mb-4">
        <button 
          onClick={handleBlendClick}
          disabled={isBlending}
          onTouchStart={handleButtonTouchStart}
          onTouchEnd={handleButtonTouchEnd}
          className={`w-full bg-[#333333] text-white py-4 rounded-full font-phudu text-2xl 
            transform transition-all duration-300 relative overflow-hidden group
            ${isBlending ? 'scale-[0.98] shadow-inner' : 'hover:shadow-lg active:scale-[0.98]'}`}
        >
          <span className={`relative z-10 transition-all duration-300 ${isBlending ? 'opacity-70' : 'group-hover:tracking-wider'}`}>
            BLEND IT
          </span>
          
          {/* 悬停时的背景效果 */}
          <div className={`absolute inset-0 bg-gradient-to-r from-[#333333] via-[#444444] to-[#333333] transition-opacity duration-300 ${isTouchActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}></div>
          
          {/* 悬停时的粒子效果 */}
          <div className={`absolute inset-0 overflow-hidden transition-opacity duration-300 ${isTouchActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
            <div className="absolute h-1 w-1 bg-white/40 rounded-full top-[20%] left-[15%] animate-float-particle1"></div>
            <div className="absolute h-1.5 w-1.5 bg-white/30 rounded-full top-[60%] left-[25%] animate-float-particle2"></div>
            <div className="absolute h-1 w-1 bg-white/40 rounded-full top-[30%] left-[60%] animate-float-particle3"></div>
            <div className="absolute h-2 w-2 bg-white/20 rounded-full top-[70%] left-[80%] animate-float-particle4"></div>
            <div className="absolute h-1.5 w-1.5 bg-white/30 rounded-full top-[40%] left-[40%] animate-float-particle5"></div>
          </div>
          
          {/* 文字效果 */}
          <span className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${isTouchActive ? 'tracking-wider' : ''}`}>
            {isBlending ? '' : ''}
          </span>
          
          {isBlending && (
            <>
              {/* 边缘脉冲效果 */}
              <div className="absolute inset-0 rounded-full border-2 border-white/0 animate-pulse-border"></div>
              
              {/* 处理中的点 */}
              <div className="absolute right-8 top-1/2 -translate-y-1/2 flex space-x-1">
                <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse-dot1"></div>
                <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse-dot2"></div>
                <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse-dot3"></div>
              </div>
            </>
          )}
        </button>
      </div>

      {/* Scroll Indicator */}
      <div className="flex flex-col items-center">
        <ChevronsDown className="w-4 h-4" />
        <span className="text-xs text-[#666666]">Scroll down to view gallery</span>
      </div>

      {/* Add these animations to your global CSS or tailwind.config.js */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateX(-10px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        @keyframes wave {
          0%, 100% { transform: translateX(-100%); }
          50% { transform: translateX(100%); }
        }
        
        @keyframes scanning {
          0% { transform: translateX(0); }
          100% { transform: translateX(400%); }
        }
        
        @keyframes pulse-border {
          0%, 100% { border-color: rgba(255, 255, 255, 0); }
          50% { border-color: rgba(255, 255, 255, 0.3); }
        }
        
        @keyframes pulse-dot1 {
          0%, 100% { opacity: 0.4; }
          25% { opacity: 1; }
        }
        
        @keyframes pulse-dot2 {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
        
        @keyframes pulse-dot3 {
          0%, 100% { opacity: 0.4; }
          75% { opacity: 1; }
        }
        
        @keyframes float-particle1 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(10px, -15px); }
        }
        
        @keyframes float-particle2 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(-8px, -12px); }
        }
        
        @keyframes float-particle3 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(12px, -10px); }
        }
        
        @keyframes float-particle4 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(-15px, -8px); }
        }
        
        @keyframes float-particle5 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(10px, -20px); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
        
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
        
        .animate-wave {
          animation: wave 2s ease-in-out infinite;
        }
        
        .animate-scanning {
          animation: scanning 2s linear infinite;
        }
        
        .animate-pulse-border {
          animation: pulse-border 2s ease-in-out infinite;
        }
        
        .animate-pulse-dot1 {
          animation: pulse-dot1 1.5s infinite;
        }
        
        .animate-pulse-dot2 {
          animation: pulse-dot2 1.5s infinite;
        }
        
        .animate-pulse-dot3 {
          animation: pulse-dot3 1.5s infinite;
        }
        
        .animate-float-particle1 {
          animation: float-particle1 3s ease-in-out infinite;
        }
        
        .animate-float-particle2 {
          animation: float-particle2 4s ease-in-out infinite;
        }
        
        .animate-float-particle3 {
          animation: float-particle3 3.5s ease-in-out infinite;
        }
        
        .animate-float-particle4 {
          animation: float-particle4 4.5s ease-in-out infinite;
        }
        
        .animate-float-particle5 {
          animation: float-particle5 5s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
