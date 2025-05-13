"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"

export default function GeneratingPage() {
  const router = useRouter()
  const [progress, setProgress] = useState(0)
  const [showMeme, setShowMeme] = useState(false)
  const [imageIndex, setImageIndex] = useState(0)
  
  // Array of image paths for the animation sequence
  const animationImages = [
    "/template1.jpg",
    "/template2.jpg",
    "/template3.jpg",
    "/template4.jpg",
    "/template5.jpg",
  ]
  
  // Cycle through animation images
  useEffect(() => {
    if (showMeme) return; // Stop animation when meme is ready
    
    const imageInterval = setInterval(() => {
      setImageIndex(prev => (prev + 1) % animationImages.length);
    }, 400);
    
    return () => clearInterval(imageInterval);
  }, [showMeme, animationImages.length]);
  
  // Simulate progress bar growth
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        // When progress reaches 100%
        if (prev >= 100) {
          clearInterval(interval)
          // Show the meme
          setShowMeme(true)
          // Return to home page after 3 seconds
          setTimeout(() => {
            //router.push("/")
          }, 3000)
          return 100
        }
        // Randomly increase progress to make it look more natural
        return prev + Math.random() * 2 + 1
      })
    }, 100)

    return () => clearInterval(interval)
  }, [router])

  return (
    <div className="flex flex-col items-center min-h-screen bg-white">
      {/* Question mark button in top right corner */}
      <div className="w-full flex justify-end p-8 pr-6">
        <button className="w-6 h-6 bg-[#333333] rounded-full flex items-center justify-center text-white text-xl">
          ?
        </button>
      </div>
      
      {/* Main content - centered vertically and horizontally */}
      <div className="flex-1 flex flex-col items-center justify-center w-[75%] -mt-16">
        <div className="w-full max-w-md flex flex-col items-center">
          {/* Title */}
          <h1 className="font-inika text-2xl text-center mb-8 italic">
            {progress >= 100 ? "Your meme is ready!" : "God is creating your meme..."}
          </h1>
          
          {/* Character animation using image sequence - larger and centered */}
          <div className="relative w-64 h-64 mb-8 flex items-center justify-center">
            {/* Show current animation frame */}
            <Image 
              src={animationImages[imageIndex]} 
              alt={"Template preview"} 
              width={256} 
              height={256} 
              className="rounded-lg shadow-md object-cover transition-opacity duration-300"
              priority
            />
          </div>
          
          {/* Progress bar container with relative positioning */}
          <div className="w-full relative mb-8 mt-6">
            {/* Cat animation that moves with progress - adjusted position */}
            <div 
              className="absolute bottom-full transition-all duration-300 ease-out"
              style={{ 
                left: `calc(${progress}% - 20px)`, 
              }}
            >
              <div className="relative h-10 w-10">
                <Image
                  src="/generating_cat.gif"
                  alt="Loading cat"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>
            
            {/* Progress bar without percentage inside */}
            <div className="w-full bg-gray-200 rounded-sm h-2 overflow-hidden">
              <div 
                className="bg-[#333333] h-2 rounded-sm transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              >
              </div>
            </div>
            
            {/* Percentage display that moves with progress */}
            <div 
              className="absolute transition-all duration-300 ease-out mt-1"
              style={{ 
                left: `calc(${progress}% - 12px)`, 
                top: '100%'
              }}
            >
              <span className="text-[#333333] font-bold text-phudu">{Math.round(progress)}%</span>
            </div>
          </div>
          
          {/* Loading text prompts */}
          <div className={`text-center transition-opacity duration-300 ${showMeme ? 'opacity-0' : 'opacity-100'}`}>
            <p className="text-gray-600 font-phudu text-sm">
              {progress < 30 ? "Gathering divine inspiration..." : 
               progress < 60 ? "Infusing with heavenly humor..." : 
               progress < 90 ? "Adding the final blessed touches..." : 
               "Your meme is almost ready!"}
            </p>
          </div>
        </div>
      </div>
      
      {/* Add some fun background elements */}
      <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
        <div className="absolute h-20 w-20 bg-blue-100 rounded-full top-[10%] left-[15%] animate-float-particle1 opacity-30"></div>
        <div className="absolute h-16 w-16 bg-yellow-100 rounded-full top-[60%] left-[80%] animate-float-particle2 opacity-30"></div>
        <div className="absolute h-24 w-24 bg-purple-100 rounded-full top-[80%] left-[30%] animate-float-particle3 opacity-30"></div>
      </div>
    </div>
  )
} 