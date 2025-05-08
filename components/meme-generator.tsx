"use client"

import { useState } from "react"
import { ChevronsDown } from "lucide-react"
import Image from "next/image"

export default function MemeGenerator() {
  const [selectedTab, setSelectedTab] = useState("sentiment")
  const [waterLevels, setWaterLevels] = useState({
    sentiment: { happiness: 3, love: 3, anger: 3, sorrow: 3, fear: 3, hate: 3 },
    intention: { humor: 3, sarcasm: 3, rant: 3, encourage: 3, "self-mockery": 3, expressive: 3 },
    style: { motivational: 3, funny: 3, wholesome: 3, dark: 3, romantic: 3, sarcastic: 3 }
  })

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
    return waterLevels[selectedTab as keyof typeof waterLevels][item as any] || 2
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
            placeholder="Enter your keywords"
            className="w-full px-6 py-3 rounded-full border-2 border-[#333333] text-left bg-white font-lexend"
            style={{ textAlign: 'left' }}
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
                <div className="h-[78px] flex items-center justify-center relative">
                  <Image 
                    src={`/glass_base.png`} 
                    alt={item} 
                    width={48} 
                    height={72} 
                    className="object-contain relative z-10" 
                  />
                  
                  <div className="absolute inset-0 scale-220 bottom-5 left-[calc(-4px)] flex items-center justify-center z-0">
                    <Image 
                      src={`/water_level${getWaterLevel(item)}.png`}
                      alt={`Water level ${getWaterLevel(item)}`}
                      width={48}
                      height={72}
                      className="object-contain transition-all duration-300 ease-out"
                    />
                  </div>
                </div>
                <span className="text-xs font-inika text-center mt-1">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Character Display */}
      <div className="w-full flex justify-center mt-4 relative">
        <div className="relative">
          <Image src="/meme_god_static.png" alt="Meme God" width={392} height={230} />
        </div>
      </div>

      {/* Blend Button */}
      <div className="w-full px-6 mt-8 mb-4">
        <button className="w-full bg-[#333333] text-white py-4 rounded-full font-phudu text-2xl transform transition-transform active:scale-98 hover:shadow-lg">BLEND IT</button>
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
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
        
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
        
        .animate-wave {
          animation: wave 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
