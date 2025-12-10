"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronsUp } from "lucide-react"

interface GalleryImage {
  id: number
  src: string
  likes: number
  height: number
}

interface MemeGalleryProps {
  showGallery: boolean
  galleryPosition: 'closed' | 'full'
  scrollY: number
  scrollThreshold?: number
  dragConstraints: { top: number; bottom: number }
  isDraggingGallery: boolean
  onScroll: (e: React.UIEvent<HTMLDivElement>) => void
  onDragStart: () => void
  onDragEnd: (info: any) => void
  onTouchStart: (e: React.TouchEvent) => void
  onTouchMove: (e: React.TouchEvent) => void
  onTouchEnd: () => void
  onToggleGallery: () => void
  className?: string
}

export default function MemeGallery({
  showGallery,
  galleryPosition,
  scrollY,
  scrollThreshold = 100,
  dragConstraints,
  isDraggingGallery,
  onScroll,
  onDragStart,
  onDragEnd,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
  onToggleGallery,
  className = ""
}: MemeGalleryProps) {
  const galleryRef = useRef<HTMLDivElement>(null)
  
  // Default gallery images
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([
    { id: 1, src: "/template1.jpg", likes: 120, height: 320 },
    { id: 2, src: "/template2.jpg", likes: 85, height: 280 },
    { id: 3, src: "/template3.jpg", likes: 230, height: 350 },
    { id: 4, src: "/template4.jpg", likes: 67, height: 300 },
    { id: 5, src: "/template5.jpg", likes: 192, height: 270 },
    { id: 6, src: "/template1.jpg", likes: 145, height: 330 },
    { id: 7, src: "/template2.jpg", likes: 78, height: 290 },
    { id: 8, src: "/template3.jpg", likes: 210, height: 310 },
    { id: 9, src: "/template5.jpg", likes: 142, height: 280 },
    { id: 10, src: "/template1.jpg", likes: 245, height: 340 },
    { id: 11, src: "/template2.jpg", likes: 178, height: 270 },
    { id: 12, src: "/template3.jpg", likes: 110, height: 330 },
  ])
  
  const [likedImages, setLikedImages] = useState<number[]>([])

  const handleLikeImage = (id: number) => {
    if (likedImages.includes(id)) {
      // Cancel like
      setLikedImages(prev => prev.filter(imageId => imageId !== id))
      setGalleryImages(prev => 
        prev.map(img => img.id === id ? {...img, likes: img.likes - 1} : img)
      )
    } else {
      // Add like
      setLikedImages(prev => [...prev, id])
      setGalleryImages(prev => 
        prev.map(img => img.id === id ? {...img, likes: img.likes + 1} : img)
      )
    }
  }

  return (
    <AnimatePresence>
      {showGallery && (
        <motion.div 
          ref={galleryRef}
          className={`fixed inset-0 bg-[#333333] z-50 overflow-auto shadow-lg ${className}`}
          initial={{ y: "100%" }}
          animate={{ 
            y: galleryPosition === 'full' ? '0%' : '100%'
          }}
          exit={{ y: "100%" }}
          transition={{ 
            type: "tween", 
            ease: "easeOut", 
            duration: 0.3 
          }}
          onScroll={onScroll}
          drag="y"
          dragConstraints={dragConstraints}
          dragElastic={0.2}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          style={{ overflow: isDraggingGallery ? 'hidden' : 'auto' }}
        >
          {/* Drag indicator */}
          <div className="absolute top-0 left-0 right-0 flex justify-center pt-2">
            <div className="w-10 h-1 bg-white/30 rounded-full"></div>
          </div>
          
          {/* Gallery Header */}
          <motion.div 
            className="sticky top-0 bg-[#333333] shadow-sm z-10 p-4 mt-6 flex flex-col items-center"
            animate={{ 
              opacity: galleryPosition === 'full' && scrollY > scrollThreshold ? 0 : 1,
              height: galleryPosition === 'full' && scrollY > scrollThreshold ? 0 : 'auto'
            }}
            transition={{ duration: 0.3 }}
          >
            <div 
              className="flex flex-col items-center cursor-pointer" 
              onClick={onToggleGallery}
            >
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                <ChevronsUp className="w-4 h-4" color="#808080"/>
              </motion.div>
              <span className="text-sm text-[#808080]">Click to the home</span>
            </div>
          </motion.div>
          
          {/* Scroll to top button - only visible in full mode when scrolled down */}
          {galleryPosition === 'full' && scrollY > scrollThreshold && (
            <motion.div 
              className="fixed top-4 inset-x-0 mx-auto w-fit z-20 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg cursor-pointer flex items-center justify-center"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => {
                if (galleryRef.current) {
                  galleryRef.current.scrollTo({ top: 0, behavior: 'smooth' })
                }
              }}
            >
              <ChevronsUp className="w-4 h-4" color="white" />
            </motion.div>
          )}
          
          {/* Gallery Grid */}
          <div className="p-4 bg-[#f8f8f8] min-h-screen rounded-t-[30px]">
            <div className="flex justify-center mb-6">
              <h2 className="text-xl font-inika text-[#333333] mt-2 bg-[#f5f5f5] px-6 py-1 rounded-full">MEME GALLERY</h2>
            </div>
            <div className="columns-2 gap-5 mx-2">
              {galleryImages.map((image) => (
                <div 
                  key={image.id} 
                  className="mb-4 break-inside-avoid relative group"
                  style={{ 
                    height: `${image.height}px`,
                    borderRadius: "12px",
                    overflow: "hidden"
                  }}
                >
                  {/* Image */}
                  <div className="absolute inset-0">
                    <Image 
                      src={image.src} 
                      alt={`Meme template ${image.id}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                  
                  {/* Like Button */}
                  <div className="absolute bottom-2 right-2">
                    <button 
                      onClick={() => handleLikeImage(image.id)}
                      className={`flex items-center space-x-1 px-2 py-1 rounded-full ${
                        likedImages.includes(image.id) 
                          ? 'bg-[#333333] text-white' 
                          : 'bg-white/80 text-gray-700 hover:bg-gray-100'
                      } transition-colors duration-200 shadow-md`}
                    >
                      <svg 
                        width="16" 
                        height="16" 
                        viewBox="0 0 24 24" 
                        fill={likedImages.includes(image.id) ? "white" : "none"} 
                        stroke={likedImages.includes(image.id) ? "white" : "currentColor"} 
                        strokeWidth="2"
                      >
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                      </svg>
                      <span className="text-xs">{image.likes}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

