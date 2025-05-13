"use client"

import { useState, useRef, useEffect, TouchEvent } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { X, ChevronLeft, ChevronRight } from "lucide-react"

interface HeaderProps {
  onBack: () => void
}

function Header({ onBack }: HeaderProps) {
    return (
      <div className="flex items-center justify-between p-6 px-6">
        <button 
          onClick={onBack}
          className="flex items-center text-[#333333]"
        >
          <Image 
            src="/back_to_meme_generator.png" 
            alt="Back" 
            width={56} 
            height={43} 
            className="mr-10"
          />
          <span className="text-xl font-inika font-bold">Choose a template</span>
        </button>
        <button className="w-6 h-6 bg-[#333333] rounded-full flex items-center justify-center text-white text-xl">
          ?
        </button>
      </div>
    )
} 

export default function TemplateEditor() {
  const router = useRouter()
  const [currentTemplate, setCurrentTemplate] = useState(0)
  const [dimensions, setDimensions] = useState({ width: 209.74, height: 219.54 })
  const [showFullImage, setShowFullImage] = useState(false)
  const [fullImageSrc, setFullImageSrc] = useState("")
  const [similarMemesCount, setSimilarMemesCount] = useState<number[]>([])
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const templateContainerRef = useRef<HTMLDivElement>(null)

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50

  // Templates - in a real app, these would come from an API
  const templates = [
    "/template1.jpg",
    "/template2.jpg",
    "/template3.jpg",
    "/template4.jpg",
    "/template5.jpg",
  ]

  // Generate random number of similar memes (4-6) for each template
  useEffect(() => {
    const counts = templates.map(() => Math.floor(Math.random() * 3) + 4) // Random number between 4-6
    setSimilarMemesCount(counts)
  }, [templates.length])

  // Open full image viewer
  const openFullImage = (src: string) => {
    setFullImageSrc(src)
    setShowFullImage(true)
    // Prevent body scrolling when modal is open
    document.body.style.overflow = 'hidden'
  }

  // Close full image viewer
  const closeFullImage = () => {
    setShowFullImage(false)
    // Restore body scrolling
    document.body.style.overflow = 'auto'
  }

  // Update dimensions when resizing
  const updateDimensions = () => {
    if (imageRef.current) {
      const rect = imageRef.current.getBoundingClientRect()
      setDimensions({
        width: Number.parseFloat(rect.width.toFixed(2)),
        height: Number.parseFloat(rect.height.toFixed(2)),
      })
    }
  }

  // Navigate to previous template
  const prevTemplate = () => {
    setCurrentTemplate(prev => {
      const newTemplate = prev === 0 ? templates.length - 1 : prev - 1
      resetScrollPosition()
      return newTemplate
    })
  }

  // Navigate to next template
  const nextTemplate = () => {
    setCurrentTemplate(prev => {
      const newTemplate = prev === templates.length - 1 ? 0 : prev + 1
      resetScrollPosition()
      return newTemplate
    })
  }

  // Reset scroll position of similar memes container
  const resetScrollPosition = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0
    }
  }

  // Get current similar memes count
  const getCurrentSimilarMemesCount = () => {
    return similarMemesCount[currentTemplate] || 4 // Default to 4 if not set
  }

  // Handle touch start
  const handleTouchStart = (e: TouchEvent) => {
    setTouchEnd(null) // Reset touchEnd
    setTouchStart(e.targetTouches[0].clientX)
  }

  // Handle touch move
  const handleTouchMove = (e: TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  // Handle touch end
  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance
    
    // Add a small delay to prevent accidental clicks when swiping
    if (isLeftSwipe) {
      setTimeout(() => nextTemplate(), 50)
    }
    if (isRightSwipe) {
      setTimeout(() => prevTemplate(), 50)
    }
    
    // Reset values
    setTouchStart(null)
    setTouchEnd(null)
  }

  // Reset scroll position when template changes
  useEffect(() => {
    resetScrollPosition()
  }, [currentTemplate])

  useEffect(() => {
    window.addEventListener("resize", updateDimensions)
    return () => {
      window.removeEventListener("resize", updateDimensions)
      // Ensure body scrolling is restored when component unmounts
      document.body.style.overflow = 'auto'
    }
  }, [])

  return (
    <div className="flex flex-col max-w-md mx-auto min-h-screen">
      {/* Header */}
      <Header onBack={() => router.push("/meme-generator")} />

      {/* Template Preview with navigation arrows */}
      <div className="px-6 py-4 flex justify-center relative">
        {/* Left navigation arrow */}
        <button 
          onClick={prevTemplate}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 z-50 w-8 h-8 bg-[#333333] rounded-full flex items-center justify-center text-white"
        >
          <ChevronLeft size={20} />
        </button>

        {/* Guide lines - changed from blue to black */}
        <div className="absolute top-0 bottom-0 left-1/2 border-l-2 border-dashed border-[#333333]/30 z-0"></div>
        <div className="absolute left-0 right-0 top-1/2 border-t-2 border-dashed border-[#333333]/30 z-0"></div>

        {/* Image container with frame - with touch events */}
        <div 
          ref={templateContainerRef}
          className="relative"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Frame 1 (background) */}
          <div className="relative w-[240px] h-[250px]">
            <Image
              src="/template_frame1.png"
              alt="Template frame background"
              fill
              className="object-contain"
            />
          </div>
          
          {/* Template image - clickable to view full size */}
          <div 
            ref={imageRef} 
            className="absolute inset-0 rounded-lg overflow-hidden cursor-pointer"
            style={{ 
              top: '10%', 
              left: '10%', 
              right: '10%', 
              bottom: '15%' 
            }}
            onClick={() => {
              // Only open full image if not swiping
              if (!touchStart || !touchEnd || Math.abs(touchStart - touchEnd) < minSwipeDistance) {
                openFullImage(templates[currentTemplate])
              }
            }}
          >
            <Image
              src={templates[currentTemplate] || "/placeholder.svg"}
              alt="Meme template"
              fill
              className="object-cover z-20 rounded-lg"
              draggable={false}
            />
            
            {/* Resize handles - changed to gray */}
            <div className="absolute top-0 left-0 w-4 h-4 bg-[#666666] border-2 border-white rounded-full z-30"></div>
            <div className="absolute top-0 right-0 w-4 h-4 bg-[#666666] border-2 border-white rounded-full z-30"></div>
            <div className="absolute bottom-0 left-0 w-4 h-4 bg-[#666666] border-2 border-white rounded-full z-30"></div>
            <div className="absolute bottom-0 right-0 w-4 h-4 bg-[#666666] border-2 border-white rounded-full z-30"></div>
          </div>
          
          {/* Frame 2 (overlay) */}
          <div className="absolute inset-0 pointer-events-none">
            <Image
              src="/template_frame2.png"
              alt="Template frame overlay"
              fill
              className="object-contain z-10"
              draggable={false}
            />
          </div>

          {/* Dimensions label - changed to gray */}
          <div className="absolute bottom-0 left-0 right-0 bg-[#666666] text-white text-center py-1 rounded-b-lg z-40">
            <span className="text-sm"><i>Meme Template Tags</i></span>
          </div>
        </div>

        {/* Right navigation arrow */}
        <button 
          onClick={nextTemplate}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 z-50 w-8 h-8 bg-[#333333] rounded-full flex items-center justify-center text-white"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Pagination dots */}
      <div className="flex justify-center space-x-2 mt-4">
        {templates.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full ${index === currentTemplate ? "bg-[#333333]" : "bg-gray-300"}`}
            onClick={() => {
              setCurrentTemplate(index)
              resetScrollPosition()
            }}
          />
        ))}
      </div>

      {/* Next button */}
      <div className="px-6 mt-4">
        <Link
          href="/generating"
          className="block w-full bg-[#333333] text-white py-3 rounded-full text-center font-phudu text-lg"
        >
          NEXT
        </Link>
      </div>

      {/* Similar memes section with vertical scrolling - no buttons */}
      <div className="px-6 mt-8">
        <h2 className="text-lg font-inika uppercase text-[#666666] mb-2">MEME USING THE SAME TEMPLATE</h2>
        
        {/* Vertically scrollable container - no buttons */}
        <div 
          ref={scrollRef}
          className="max-h-[320px] overflow-y-auto hide-scrollbar"
          style={{ scrollbarWidth: 'none' }}
        >
          <div className="grid grid-cols-2 gap-2">
            {/* Generate random number of similar memes (4-6) for the current template */}
            {Array.from({ length: getCurrentSimilarMemesCount() }).map((_, index) => (
              <div 
                key={index} 
                className="aspect-square border border-[#333333] rounded-lg overflow-hidden cursor-pointer"
                onClick={() => openFullImage(templates[currentTemplate])}
              >
                <Image
                  src={templates[currentTemplate]}
                  alt={`Similar meme ${index + 1}`}
                  width={150}
                  height={150}
                  className="w-full h-full object-cover"
                  draggable={false}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Full image viewer modal */}
      {showFullImage && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <button 
            onClick={closeFullImage}
            className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center"
          >
            <X size={24} />
          </button>
          <div className="relative w-full max-w-3xl max-h-[80vh]">
            <Image
              src={fullImageSrc}
              alt="Full size template"
              width={800}
              height={800}
              className="w-full h-auto object-contain"
              draggable={false}
            />
          </div>
        </div>
      )}

      {/* Hide scrollbar styles */}
      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  )
}
