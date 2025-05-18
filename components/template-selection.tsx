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
      <div className="flex items-center justify-between p-6 px-6 xs:p-4 xs:px-4">
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
  const [isFullImageOpen, setIsFullImageOpen] = useState(false)
  const [fullImageSrc, setFullImageSrc] = useState("")
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [transitionDirection, setTransitionDirection] = useState<'left' | 'right' | null>(null)
  const [exitingTemplate, setExitingTemplate] = useState<number | null>(null)
  const [nextTemplateIndex, setNextTemplateIndex] = useState<number | null>(null)
  
  const imageRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const templateContainerRef = useRef<HTMLDivElement>(null)
  const currentFrameRef = useRef<HTMLDivElement>(null)
  const exitingFrameRef = useRef<HTMLDivElement>(null)

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

  // Random number of similar memes for each template
  const [similarMemesCount] = useState<Record<number, number>>({
    0: Math.floor(Math.random() * 3) + 5, // 5-7
    1: Math.floor(Math.random() * 3) + 5,
    2: Math.floor(Math.random() * 3) + 5,
    3: Math.floor(Math.random() * 3) + 5,
    4: Math.floor(Math.random() * 3) + 5,
  })

  // 添加防抖功能的引用，防止快速多次触发
  const isProcessingSwipeRef = useRef(false);

  // Open full image
  const openFullImage = (src: string) => {
    setFullImageSrc(src)
    setIsFullImageOpen(true)
    // Prevent body scrolling when modal is open
    document.body.style.overflow = 'hidden'
  }

  // Close full image
  const closeFullImage = () => {
    setIsFullImageOpen(false)
    // Restore body scrolling
    document.body.style.overflow = 'auto'
  }

  // 统一的模板切换动画函数
  const changeTemplate = (direction: 'left' | 'right') => {
    // 如果正在进行动画，则不重复触发
    if (isTransitioning || isProcessingSwipeRef.current) return;
    
    isProcessingSwipeRef.current = true;
    
    // 计算下一个/上一个模板的索引
    const newIndex = direction === 'left'
      ? (currentTemplate === templates.length - 1 ? 0 : currentTemplate + 1)
      : (currentTemplate === 0 ? templates.length - 1 : currentTemplate - 1);
    
    // 设置转场状态
    setExitingTemplate(currentTemplate);
    setIsTransitioning(true);
    setTransitionDirection(direction);
    setNextTemplateIndex(newIndex);
    
    // 等待动画完成后更新状态
    setTimeout(() => {
      setCurrentTemplate(newIndex);
      
      // 延迟清除动画元素，确保无缝过渡
      setTimeout(() => {
        setIsTransitioning(false);
        setExitingTemplate(null);
        setNextTemplateIndex(null);
        
        // 重置处理标志
        isProcessingSwipeRef.current = false;
      }, 50);
    }, 550); // 稍微长于动画时间
  };

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
    if (!touchStart || !touchEnd || isProcessingSwipeRef.current) return
    
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance
    
    // 直接调用统一的动画函数
    if (isLeftSwipe) {
      changeTemplate('left');
    } else if (isRightSwipe) {
      changeTemplate('right');
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
    // Ensure body scrolling is restored when component unmounts
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [])

  return (
    <div className="flex flex-col max-w-md mx-auto min-h-screen">
      {/* Header */}
      <Header onBack={() => router.push("/meme-generator")} />

      {/* Template Preview with navigation arrows */}
      <div className="px-6 py-4 xs:px-4 xs:py-3 flex justify-center relative">
        {/* Left navigation arrow */}
        <button 
          onClick={() => changeTemplate('right')}
          className="absolute left-2 top-1/2 transform -translate-y-1/2 z-50 w-8 h-8 bg-[#333333] rounded-full flex items-center justify-center text-white"
        >
          <ChevronLeft size={20} />
        </button>

        {/* Image container with frame - with touch events */}
        <div 
          ref={templateContainerRef}
          className="relative overflow-hidden"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{ perspective: '800px' }}
        >
          {/* Current template */}
          <div 
            ref={currentFrameRef}
            className={`relative transition-opacity duration-500 ease-out ${
              isTransitioning ? 'pointer-events-none opacity-0' : 'opacity-100'
            }`}
            style={{ 
              transformStyle: 'preserve-3d',
              backfaceVisibility: 'hidden'
            }}
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
            
            {/* Template image */}
            <div 
              className="absolute inset-0 rounded-lg overflow-hidden"
              style={{ 
                top: '10%', 
                left: '10%', 
                right: '10%', 
                bottom: '20%' 
              }}
              onClick={() => {
                openFullImage(templates[currentTemplate])
              }}
            >
              <Image
                src={templates[currentTemplate] || "/placeholder.svg"}
                alt="Meme template"
                fill
                className="object-cover z-20 rounded-lg"
                draggable={false}
              />
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
          
          {/* Exiting template */}
          {exitingTemplate !== null && (
            <div 
              ref={exitingFrameRef}
              className="absolute top-0 left-0 w-full h-full"
              style={{
                animation: transitionDirection === 'left' 
                  ? 'flipPageLeft 550ms cubic-bezier(0.4, 0.0, 0.2, 1) forwards' 
                  : 'flipPageRight 550ms cubic-bezier(0.4, 0.0, 0.2, 1) forwards',
                transformStyle: 'preserve-3d',
                transformOrigin: transitionDirection === 'left' ? 'left center' : 'right center',
                backfaceVisibility: 'hidden',
                zIndex: 20
              }}
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
              
              {/* Template image */}
              <div 
                className="absolute inset-0 rounded-lg overflow-hidden"
                style={{ 
                  top: '10%', 
                  left: '10%', 
                  right: '10%', 
                  bottom: '20%' 
                }}
              >
                <Image
                  src={templates[exitingTemplate] || "/placeholder.svg"}
                  alt="Previous meme template"
                  fill
                  className="object-cover z-20 rounded-lg"
                  draggable={false}
                />
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

              {/* Dimensions label */}
              <div className="absolute bottom-0 left-0 right-0 bg-[#666666] text-white text-center py-1 rounded-b-lg z-40">
                <span className="text-sm"><i>Meme Template Tags</i></span>
              </div>
              
              {/* 阴影效果增强翻页感 */}
              <div 
                className="absolute inset-0 z-30 pointer-events-none"
                style={{
                  background: transitionDirection === 'left' 
                    ? 'linear-gradient(to right, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0) 70%)' 
                    : 'linear-gradient(to left, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0) 70%)',
                  opacity: 0.8
                }}
              />
            </div>
          )}
          
          {/* Next template (entering) */}
          {nextTemplateIndex !== null && (
            <div 
              className="absolute top-0 left-0 w-full h-full"
              style={{
                animation: transitionDirection === 'left' 
                  ? 'revealPageLeft 550ms cubic-bezier(0.4, 0.0, 0.2, 1) forwards'
                  : 'revealPageRight 550ms cubic-bezier(0.4, 0.0, 0.2, 1) forwards',
                transformStyle: 'preserve-3d',
                transformOrigin: transitionDirection === 'left' ? 'right center' : 'left center',
                backfaceVisibility: 'hidden',
                zIndex: 10
              }}
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
              
              {/* Template image */}
              <div 
                className="absolute inset-0 rounded-lg overflow-hidden"
                style={{ 
                  top: '10%', 
                  left: '10%', 
                  right: '10%', 
                  bottom: '20%' 
                }}
              >
                <Image
                  src={templates[nextTemplateIndex] || "/placeholder.svg"}
                  alt="Next meme template"
                  fill
                  className="object-cover z-20 rounded-lg"
                  draggable={false}
                />
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

              {/* Dimensions label */}
              <div className="absolute bottom-0 left-0 right-0 bg-[#666666] text-white text-center py-1 rounded-b-lg z-40">
                <span className="text-sm"><i>Meme Template Tags</i></span>
              </div>
              
              {/* 阴影效果增强翻页感 */}
              <div 
                className="absolute inset-0 z-30 pointer-events-none"
                style={{
                  background: transitionDirection === 'left' 
                    ? 'linear-gradient(to left, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0) 70%)' 
                    : 'linear-gradient(to right, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0) 70%)',
                  opacity: 0.6
                }}
              />
            </div>
          )}
        </div>

        {/* Right navigation arrow */}
        <button 
          onClick={() => changeTemplate('left')}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 z-50 w-8 h-8 bg-[#333333] rounded-full flex items-center justify-center text-white"
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

      {/* Similar memes section with horizontal scrolling */}
      <div className="px-6 mt-8 xs:mt-6">
        <h2 className="text-lg font-inika uppercase text-[#666666] mb-2">MEME USING THE SAME TEMPLATE</h2>
        
        {/* Horizontally scrollable container */}
        <div 
          ref={scrollRef}
          className="overflow-x-auto hide-scrollbar pb-4"
          style={{ scrollbarWidth: 'none' }}
        >
          <div className="grid grid-rows-2 xs:grid-rows-1 grid-flow-col gap-2 w-max">
            {/* Generate random number of similar memes for the current template */}
            {Array.from({ length: getCurrentSimilarMemesCount() }).map((_, index) => (
              <div 
                key={index} 
                className="w-[150px] h-[150px] border border-[#333333] rounded-lg overflow-hidden cursor-pointer"
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
      {isFullImageOpen && (
        <div 
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={closeFullImage}
        >
          <div className="relative max-w-full max-h-full">
            <Image
              src={fullImageSrc}
              alt="Full size meme template"
              width={800}
              height={800}
              className="max-h-[90vh] w-auto object-contain"
            />
            <button 
              className="absolute top-4 right-4 bg-white rounded-full w-8 h-8 flex items-center justify-center"
              onClick={closeFullImage}
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Custom animations */}
      <style jsx global>{`
        @keyframes flipPageLeft {
          0% {
            transform: rotateY(0deg) translateZ(0);
            opacity: 1;
          }
          100% {
            transform: rotateY(-75deg) translateZ(-100px);
            opacity: 0;
          }
        }
        
        @keyframes flipPageRight {
          0% {
            transform: rotateY(0deg) translateZ(0);
            opacity: 1;
          }
          100% {
            transform: rotateY(75deg) translateZ(-100px);
            opacity: 0;
          }
        }
        
        @keyframes revealPageLeft {
          0% {
            transform: rotateY(45deg) translateZ(-50px);
            opacity: 0;
          }
          100% {
            transform: rotateY(0deg) translateZ(0);
            opacity: 1;
          }
        }
        
        @keyframes revealPageRight {
          0% {
            transform: rotateY(-45deg) translateZ(-50px);
            opacity: 0;
          }
          100% {
            transform: rotateY(0deg) translateZ(0);
            opacity: 1;
          }
        }
        
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
