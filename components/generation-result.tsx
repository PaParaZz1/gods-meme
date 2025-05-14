"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function GenerationResult() {
  const router = useRouter()
  const [generatedImage, setGeneratedImage] = useState("/template1.jpg") // Default to template1 as example
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showEntryAnimation, setShowEntryAnimation] = useState(true)

  // Entry animation effect
  useEffect(() => {
    // Hide animation after it completes
    const timer = setTimeout(() => {
      setShowEntryAnimation(false)
    }, 1500)
    
    return () => clearTimeout(timer)
  }, [])

  // Regenerate meme
  const handleRegenerate = () => {
    // Open the modal instead of immediately regenerating
    setIsModalOpen(true)
  }

  // Handle option selection
  const handleOptionSelect = (option: string) => {
    if (option === "CHANGE STYLE") {
      router.push("/generating")
      return
    }
    // Close the modal
    setIsModalOpen(false)
    
    // Logic for regeneration based on selected option
    // For demo, just toggle between templates
    setGeneratedImage(prev => 
      prev === "/template1.jpg" ? "/template2.jpg" : "/template1.jpg"
    )
  }

  return (
    <div className="flex flex-col max-w-md mx-auto min-h-screen relative overflow-hidden">
      {/* Entry animation overlay */}
      {showEntryAnimation && (
        <div className="absolute inset-0 z-50 bg-white flex flex-col items-center justify-center">
          <div className="relative w-40 h-40 mb-4">
            <Image 
              src="/template1.jpg" 
              alt="Meme" 
              fill 
              className="object-cover rounded-lg animate-pop"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 border-4 border-[#333333] border-t-transparent rounded-full animate-spin"></div>
            </div>
          </div>
          <div className="text-2xl font-phudu animate-pulse">Almost there...</div>
        </div>
      )}

      {/* Main content */}
      <div className={`flex flex-col min-h-screen transition-opacity duration-500 ${showEntryAnimation ? 'opacity-0' : 'opacity-100'}`}>
        {/* Header with title and help button */}
        <div className="flex items-center justify-between p-8 px-6">
          <div className="flex-1"></div>
          <h1 className="text-xl font-inika font-bold flex-1 text-center whitespace-nowrap">MEME Creation</h1>
          <div className="flex-1 flex justify-end">
            <button className="w-6 h-6 bg-[#333333] rounded-full flex items-center justify-center text-white text-xl">
              ?
            </button>
          </div>
        </div>

        {/* Generated meme result */}
        <div className="flex-1 flex items-center justify-center px-10">
          <div className="relative w-full aspect-square max-w-[350px] rounded-lg overflow-hidden border-2 border-[#333333] animate-fadeIn">
            <Image
              src={generatedImage}
              alt="Generated Meme"
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Action buttons */}
        <div className="px-8 pb-8 space-y-4">
          <button
            onClick={handleRegenerate}
            className="block w-full bg-white text-[#333333] py-3 rounded-full text-center font-phudu text-lg border-2 border-[#333333]"
          >
            REGENERATE
          </button>
          
          <Link
            href="/"
            className="block w-full bg-[#333333] text-white py-3 rounded-full text-center font-phudu text-lg"
          >
            NEXT
          </Link>
        </div>
      </div>

      {/* Regeneration options modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          {/* Backdrop overlay */}
          <div 
            className="absolute inset-0 bg-black/60" 
            onClick={() => setIsModalOpen(false)}
          ></div>
          
          {/* Modal content */}
          <div className="bg-[#333333] rounded-t-3xl p-6 w-full max-w-md relative z-10 animate-slideUp">
            <div className="w-12 h-1 bg-gray-400 rounded-full mx-auto mb-4"></div>
            <h2 className="text-white text-center mb-4 font-phudu text-2xl">Regeneration Option</h2>
            
            <div className="space-y-3 pb-4">
              {["CHANGE STYLE", "ADD ELEMENTS", "REMOVE ELEMENTS"].map((option) => (
                <button
                  key={option}
                  onClick={() => handleOptionSelect(option)}
                  className="block w-full bg-white text-[#333333] py-3 rounded-lg text-center font-phudu"
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Add animations */}
      <style jsx global>{`
        @keyframes slideUp {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        
        .animate-slideUp {
          animation: slideUp 0.3s ease-out forwards;
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
        
        @keyframes progressBar {
          0% {
            width: 0%;
          }
          50% {
            width: 70%;
          }
          100% {
            width: 100%;
          }
        }
        
        .animate-progressBar {
          animation: progressBar 1.2s linear forwards;
        }

        @keyframes pop {
          0% {
            transform: scale(0.8) rotate(-5deg);
            opacity: 0.5;
          }
          50% {
            transform: scale(1.05) rotate(5deg);
          }
          100% {
            transform: scale(1) rotate(0deg);
            opacity: 1;
          }
        }
        
        .animate-pop {
          animation: pop 1s ease-out forwards;
        }
      `}</style>
    </div>
  )
} 