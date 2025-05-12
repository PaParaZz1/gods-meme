"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronsDown } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"

export default function MemeGenerator() {
  const router = useRouter()
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
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const dragItemRef = useRef<HTMLDivElement>(null)
  const initialTouchRef = useRef({ x: 0, y: 0 })
  const initialElementPosRef = useRef({ x: 0, y: 0 })
  
  // New state for character animations
  const [showAddAnimation, setShowAddAnimation] = useState(false)
  const [showRemoveAnimation, setShowRemoveAnimation] = useState(false)
  // New state to track if any animation is currently playing
  const [isAnimationPlaying, setIsAnimationPlaying] = useState(false)

  // Add a timestamp ref to track touch/click duration
  const touchStartTimeRef = useRef<number>(0)
  const isDragOperationRef = useRef<boolean>(false)

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
    // Don't allow toggling if an animation is already playing
    if (isAnimationPlaying) return;
    
    setWaterLevels(prev => {
      const currentLevel = prev[selectedTab][item]
      // only increase the level if it's not already at the max
      if (currentLevel === 3) {
        return prev
      }
      
      // Show remove animation when clicking to change water level
      setShowRemoveAnimation(true)
      // Make sure add animation is not showing
      setShowAddAnimation(false)
      // Set animation playing state
      setIsAnimationPlaying(true)
      
      setTimeout(() => {
        setShowRemoveAnimation(false)
        setIsAnimationPlaying(false)
      }, 1500) // Animation duration
      
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
  const handleDragEnd = (e: React.DragEvent) => {
    if (!draggedItem || !godAreaRef.current || isAnimationPlaying) {
      setDraggedItem(null)
      return;
    }
    
    const godRect = godAreaRef.current.getBoundingClientRect()
    
    if (
      e.clientX >= godRect.left &&
      e.clientX <= godRect.right &&
      e.clientY >= godRect.top &&
      e.clientY <= godRect.bottom
    ) {
      // Dragged to god area, decrease water level
      setWaterLevels(prev => {
        const currentLevel = prev[selectedTab as keyof typeof waterLevels][draggedItem as any]
        if (currentLevel > 0) {
          // Show add animation
          setShowAddAnimation(true)
          // Set animation playing state
          setIsAnimationPlaying(true)
          
          setTimeout(() => {
            setShowAddAnimation(false)
            setIsAnimationPlaying(false)
          }, 1500) // Animation duration
          
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
    
    setDraggedItem(null)
  }

  // Prevent page scrolling when dragging
  const preventScroll = (e: TouchEvent) => {
    if (isDragging) {
      e.preventDefault();
    }
  }

  // Add and remove event listeners for scroll prevention
  useEffect(() => {
    if (isDragging) {
      // Add passive: false to override default browser behavior
      document.addEventListener('touchmove', preventScroll, { passive: false });
    } else {
      document.removeEventListener('touchmove', preventScroll);
    }
    
    return () => {
      document.removeEventListener('touchmove', preventScroll);
    };
  }, [isDragging]);

  // Modified handleItemTouchStart to always record start time
  const handleItemTouchStart = (e: React.TouchEvent, item: string) => {
    // Always record the start time of the touch, regardless of water level
    touchStartTimeRef.current = Date.now()
    isDragOperationRef.current = false
    
    // Only proceed with drag setup if there's water to drag
    if (getWaterLevel(item) === 0) return;
    
    // Set dragging state immediately
    setIsDragging(true)
    
    const touch = e.touches[0]
    initialTouchRef.current = { x: touch.clientX, y: touch.clientY }
    
    if (dragItemRef.current) {
      const rect = dragItemRef.current.getBoundingClientRect()
      initialElementPosRef.current = { x: rect.left, y: rect.top }
    }
    
    setDraggedItem(item)
  }

  // Modified handleItemTouchMove to set drag operation flag
  const handleItemTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !draggedItem) return;
    
    // If the user has moved their finger, it's a drag operation
    isDragOperationRef.current = true
    
    const touch = e.touches[0]
    
    // Use current touch position directly
    setDragPosition({
      x: touch.clientX,
      y: touch.clientY
    })
    
  }

  const handleItemTouchEnd = (e: React.TouchEvent) => {
    if (!isDragging || !draggedItem || !godAreaRef.current || isAnimationPlaying) {
      setIsDragging(false)
      setDraggedItem(null)
      return;
    }
    
    const godRect = godAreaRef.current.getBoundingClientRect()
    const touch = e.changedTouches[0]
    
    if (
      touch.clientX >= godRect.left &&
      touch.clientX <= godRect.right &&
      touch.clientY >= godRect.top &&
      touch.clientY <= godRect.bottom
    ) {
      // Dragged to god area, decrease water level
      setWaterLevels(prev => {
        const currentLevel = prev[selectedTab as keyof typeof waterLevels][draggedItem as any]
        if (currentLevel > 0) {
          // Show add animation
          setShowAddAnimation(true)
          // Set animation playing state
          setIsAnimationPlaying(true)
          
          setTimeout(() => {
            setShowAddAnimation(false)
            setIsAnimationPlaying(false)
          }, 1500) // Animation duration
          
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
    
    setIsDragging(false)
    setDraggedItem(null)
  }

  // Add a click handler for the water glasses with debugging
  const handleWaterGlassClick = (item: keyof typeof waterLevels.sentiment | keyof typeof waterLevels.intention | keyof typeof waterLevels.style) => {
    // Only handle as a click if the touch duration was short
    const touchDuration = Date.now() - touchStartTimeRef.current
    
    // If this is a quick tap (less than 500ms), treat as a click
    if (!isDragOperationRef.current && touchDuration < 500) {
      toggleWaterLevel(item)
    }
    
    // Reset the drag operation flag
    isDragOperationRef.current = false
  }

  const handleBlendClick = () => {
    setIsBlending(true)
    // Simulate processing time, reset state after 3 seconds
    setTimeout(() => {
      setIsBlending(false)
      router.push("/template-selection")
    }, 1500)
  }

  const handleButtonTouchStart = () => {
    setIsTouchActive(true)
  }

  const handleButtonTouchEnd = () => {
    // Short delay to reset state, allowing user to see the effect
    setTimeout(() => {
      setIsTouchActive(false)
    }, 300)
  }

  return (
    <div 
      className="flex flex-col items-center max-w-md mx-auto min-h-screen overscroll-none"
      onTouchMove={handleItemTouchMove}
      onTouchEnd={handleItemTouchEnd}
    >
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
        <div className="w-full px-16 mt-6 mb-2">
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
        
        {/* Arrow indicator that points to the selected tab */}
        <div className="w-full relative h-4">
          <motion.div 
            className="absolute w-6 h-6 transform -translate-x-1/2"
            animate={{ left: selectedTab === "sentiment" ? "33.3%" : selectedTab === "intention" ? "50%" : "66.7%" }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <svg width="24" height="18" viewBox="0 0 24 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 0L24 18H0L12 0Z" fill="#EEEEEE" />
            </svg>
          </motion.div>
        </div>
        
      {/* Dynamic Content Grid based on selected tab */}
        <div className="w-full px-2">
          <div className="bg-[#EEEEEE] rounded-lg p-4 mx-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedTab}
                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -15, scale: 0.95 }}
                transition={{ 
                  duration: 0.25,
                  type: "spring",
                  stiffness: 400,
                  damping: 25
                }}
                className="grid grid-cols-6 gap-2"
              >
                {currentTabContent.items.map((item, index) => (
                  <motion.div
                    key={item} 
                    className="flex flex-col items-center cursor-pointer"
                    onClick={() => handleWaterGlassClick(item as keyof typeof waterLevels.sentiment | keyof typeof waterLevels.intention | keyof typeof waterLevels.style)}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.2,
                      delay: index * 0.03,
                      type: "spring",
                      stiffness: 400,
                      damping: 20
                    }}
                    whileHover={{ 
                      scale: 1.1,
                      transition: { duration: 0.15 }
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div 
                      ref={draggedItem === item ? dragItemRef : null}
                      className={`h-[78px] flex items-center justify-center relative ${getWaterLevel(item) > 0 ? 'cursor-grab active:cursor-grabbing' : ''}`}
                      draggable={getWaterLevel(item) > 0}
                      onDragStart={() => handleDragStart(item)}
                      onDragEnd={handleDragEnd}
                      onTouchStart={(e) => handleItemTouchStart(e, item)}
                    >
                      <Image 
                        src={`/glass_base.png`} 
                        alt={item} 
                        width={48} 
                        height={72} 
                        className={`object-contain relative z-10 ${draggedItem === item && isDragging ? 'opacity-30' : draggedItem === item ? 'opacity-50' : ''}`}
                      />
                      
                      {getWaterLevel(item) > 0 && (
                        <div className="absolute inset-0 scale-220 bottom-5 left-[calc(-4px)] flex items-center justify-center z-0">
                          <Image 
                            src={`/water_level${getWaterLevel(item)}.png`}
                            alt={`Water level ${getWaterLevel(item)}`}
                            width={48}
                            height={72}
                            className={`object-contain transition-all duration-300 ease-out ${draggedItem === item && isDragging ? 'opacity-30' : draggedItem === item ? 'opacity-50' : ''}`}
                          />
                        </div>
                      )}
                    </div>
                    <span className="text-xs font-inika text-center mt-1">{item}</span>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Character Display with fixed animations */}
        <div 
          ref={godAreaRef}
          className={"w-full flex justify-center mt-4 relative"}
        >
          <div className="relative w-[390px] h-[230px]">
            {/* Static image (always visible as base) */}
            <div className="absolute inset-0">
              <Image 
                src="/meme_god_static.png" 
                alt="Meme God" 
                width={390} 
                height={230} 
                className={`${showAddAnimation || showRemoveAnimation ? 'opacity-0' : 'opacity-100'} transition-opacity duration-200`}
              />
            </div>
            
            {/* Add animation */}
            {showAddAnimation && (
              <div className="absolute inset-0">
                <Image 
                  src="/god_add_elem.gif" 
                  alt="Adding Element" 
                  width={390} 
                  height={230} 
                  priority 
                />
              </div>
            )}
            
            {/* Remove animation */}
            {showRemoveAnimation && (
              <div className="absolute inset-0">
                <Image 
                  src="/god_remove_elem.gif" 
                  alt="Removing Element" 
                  width={390} 
                  height={230} 
                  priority 
                />
              </div>
            )}
            
            {/* Highlight area when dragging */}
            {/*<div className="absolute inset-0 rounded-xl border-2 border-dashed border-[#333333]/30 bg-[#EEEEEE]/50 pointer-events-none z-10" />*/}
            {draggedItem && (
              <div className="absolute inset-0 rounded-xl bg-[#EEEEEE]/50 pointer-events-none z-10" />
            )}
          </div>
        </div>

        {/* Blend Button */}
        <div className="w-full px-6 mt-6 mb-4">
          <button 
            onClick={handleBlendClick}
            disabled={isBlending}
            onTouchStart={handleButtonTouchStart}
            onTouchEnd={handleButtonTouchEnd}
            className={`w-full bg-[#333333] text-white py-4 rounded-full font-phudu text-2xl 
              transform transition-all duration-300 relative overflow-hidden group
              ${isBlending ? 'scale-[0.98] shadow-inner' : 'hover:shadow-lg active:scale-[0.98]'}`}
          >
            {/* Button text that disappears when loading */}
            <span className={`relative z-10 transition-all duration-300 ${isBlending ? 'opacity-0' : 'opacity-100 group-hover:tracking-wider'}`}>
              BLEND IT
            </span>
            
            {/* Loading dots that appear in place of text */}
            {isBlending && (
              <div className="absolute inset-0 flex items-center justify-center z-20">
                <div className="flex space-x-2">
                  <div className="w-2.5 h-2.5 bg-white rounded-full animate-pulse-dot1"></div>
                  <div className="w-2.5 h-2.5 bg-white rounded-full animate-pulse-dot2"></div>
                  <div className="w-2.5 h-2.5 bg-white rounded-full animate-pulse-dot3"></div>
                </div>
              </div>
            )}
            
            {/* Hover background effect */}
            <div className={`absolute inset-0 bg-gradient-to-r from-[#333333] via-[#444444] to-[#333333] transition-opacity duration-300 ${isTouchActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}></div>
            
            {/* Hover particle effects */}
            <div className={`absolute inset-0 overflow-hidden transition-opacity duration-300 ${isTouchActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
              <div className="absolute h-1 w-1 bg-white/40 rounded-full top-[20%] left-[15%] animate-float-particle1"></div>
              <div className="absolute h-1.5 w-1.5 bg-white/30 rounded-full top-[60%] left-[25%] animate-float-particle2"></div>
              <div className="absolute h-1 w-1 bg-white/40 rounded-full top-[30%] left-[60%] animate-float-particle3"></div>
              <div className="absolute h-2 w-2 bg-white/20 rounded-full top-[70%] left-[80%] animate-float-particle4"></div>
              <div className="absolute h-1.5 w-1.5 bg-white/30 rounded-full top-[40%] left-[40%] animate-float-particle5"></div>
            </div>
            
            {isBlending && (
              <>
                {/* Pulse border effect */}
                <div className="absolute inset-0 rounded-full border-2 border-white/0 animate-pulse-border"></div>
              </>
            )}
          </button>
        </div>

        {/* Scroll Indicator */}
        <div className="flex flex-col items-center">
          <ChevronsDown className="w-4 h-4" />
          <span className="text-xs text-[#666666]">Scroll down to view gallery</span>
        </div>

        {/* Floating drag element */}
        {isDragging && draggedItem && (
          <div 
            className="fixed pointer-events-none z-50"
            style={{ 
              left: `${dragPosition.x}px`, 
              top: `${dragPosition.y}px`,
              transform: 'translate(-50%, -50%)' // Center the element
            }}
          >
            <div className="relative">
              <Image 
                src={`/glass_base.png`} 
                alt={draggedItem} 
                width={48} 
                height={72} 
                className="object-contain relative z-10 opacity-80"
              />
              
              {getWaterLevel(draggedItem) > 0 && (
                <div className="absolute inset-0 scale-220 bottom-5 left-[calc(-4px)] flex items-center justify-center z-0">
                  <Image 
                    src={`/water_level${getWaterLevel(draggedItem)}.png`}
                    alt={`Water level ${getWaterLevel(draggedItem)}`}
                    width={48}
                    height={72}
                    className="object-contain opacity-80"
                  />
                </div>
              )}
            </div>
          </div>
        )}

      {/* Updated animations */}
      <style jsx global>{`
        @keyframes fadeIn {
          0% { opacity: 0; transform: translateY(10px) scale(0.95); }
          60% { transform: translateY(-3px) scale(1.02); }
          80% { transform: translateY(1px) scale(0.98); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes wiggle {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-5deg); }
          75% { transform: rotate(5deg); }
        }
        
        @keyframes pop {
          0% { transform: scale(0.8); opacity: 0; }
          50% { transform: scale(1.1); }
          70% { transform: scale(0.95); }
          100% { transform: scale(1); opacity: 1; }
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
          animation: fadeIn 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
        
        .animate-bounce {
          animation: bounce 0.6s ease-in-out infinite;
        }
        
        .animate-wiggle {
          animation: wiggle 0.5s ease-in-out;
        }
        
        .animate-pop {
          animation: pop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
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
