"use client"

import Image from "next/image"
import { useEffect, useState } from "react"
import { createPortal } from "react-dom"

interface TutorialModalProps {
  isOpen: boolean
  onClose: () => void
  initialStep?: number // Optional prop to specify start step
  showNextButton?: boolean // Optional prop to control next button visibility
}

const TUTORIAL_STEPS = [
  {
    image: "/tutorial_main.png",
    text: "Welcome to God's Meme. Enter the keyword and make sure to select at least one tag under each category."
  },
  {
    image: "/tutorial_qa.png",
    text: "Answer God's random question — be as honest or mysterious as you like."
  },
  {
    image: "/tutorial_theme.png",
    text: "Pick at least one theme. Don't be greedy though — you can't choose more than three."
  },
  {
    image: "/tutorial_template.png",
    text: "Choose a recommended meme template, or upload your own meme with text."
  },
  {
    image: "/tutorial_generated.png",
    text: "Not satisfied? Feel free to change, add, or remove any elements."
  },
  {
    image: "/tutorial_result.png",
    text: "Done! Once your meme is generated, you can tweak the text or share it right away."
  }
]

export default function TutorialModal({ isOpen, onClose, initialStep = 0, showNextButton = false }: TutorialModalProps) {
  const [mounted, setMounted] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(initialStep)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)

  // Update index when opening or when initialStep changes
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialStep)
    }
  }, [isOpen, initialStep])

  useEffect(() => {
    setMounted(true)
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }
    return () => {
      document.body.style.overflow = "auto"
    }
  }, [isOpen])

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > 50
    const isRightSwipe = distance < -50

    if (isLeftSwipe) {
      handleNext()
    } else if (isRightSwipe) {
      handlePrev()
    }

    setTouchStart(0)
    setTouchEnd(0)
  }

  const handleNext = () => {
    if (currentIndex < TUTORIAL_STEPS.length - 1) {
      setCurrentIndex(prev => prev + 1)
    } else {
      onClose()
    }
  }

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1)
    }
  }

  if (!mounted || !isOpen) return null

  const currentStep = TUTORIAL_STEPS[currentIndex]

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Wrapper */}
      <div className="relative w-[90%] max-w-sm animate-in zoom-in-95 duration-200 border-[3px] border-black rounded-3xl">
        {/* Shadow Card */}
        <div className="absolute inset-0 w-full h-full bg-[#000000] opacity-20 rounded-3xl -z-10 rotate-[5deg]"></div>

        {/* Close Button - Outside Top Right */}
        <button
          onClick={onClose}
          className="absolute -top-14 -right-2 z-20 w-10 h-10 flex items-center justify-center rounded-full hover:scale-110 transition-transform"
        >
          <Image 
            src="/shutdown_share.png" 
            alt="Close" 
            width={40} 
            height={40}
            className="object-contain"
          />
        </button>

        {/* Modal Content */}
        <div 
          className="bg-white rounded-3xl shadow-2xl overflow-hidden"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="p-8 py-6 flex flex-col items-center">
              {/* Image Area */}
              <div className="relative w-full aspect-[3/4] mb-2 rounded-xl overflow-hidden bg-gray-50">
                  <Image
                      src={currentStep.image}
                      alt={`Tutorial step ${currentIndex + 1}`}
                      fill
                      className="object-contain"
                  />
              </div>

              {/* Text Area */}
              <p className="text-left text-[#333333] font-inika text-lg leading-relaxed mb-4 min-h-[80px]">
                  {currentStep.text}
              </p>
          </div>
        </div>

        {/* Pagination Dots - Outside Bottom Left */}
        <div className={`absolute -bottom-10 flex gap-3 ${showNextButton ? 'left-2' : 'left-1/2 -translate-x-1/2'}`}>
            {TUTORIAL_STEPS.map((_, index) => (
              <div 
                key={index}
                className={`w-4 h-4 rounded-full transition-colors duration-200 ${
                  index === currentIndex ? 'bg-white' : 'bg-[#999999]'
                }`}
              />
            ))}
        </div>

        {/* Next Button - Outside Bottom Right */}
        {showNextButton && (
          <button
            onClick={handleNext}
            className="absolute -bottom-32 right-2 w-20 h-20 flex items-center justify-center hover:scale-110 transition-transform"
          >
            <Image
              src="/tutorial_change.png"
              alt="Next"
              width={80}
              height={80}
              className="object-contain"
            />
          </button>
        )}
      </div>
    </div>,
    document.body
  )
}

