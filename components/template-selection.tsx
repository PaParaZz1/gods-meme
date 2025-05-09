"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"

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
  const imageRef = useRef<HTMLDivElement>(null)

  // Templates - in a real app, these would come from an API
  const templates = [
    "/template1.jpg",
    "/template2.jpg",
    "/template3.jpg",
    "/template4.jpg",
    "/template5.jpg",
  ]

  // Similar memes using the same template
  const similarMemes = ["/hamster.jpg", "/hamster.jpg", "/hamster.jpg", "/hamster.jpg"]

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

  useEffect(() => {
    window.addEventListener("resize", updateDimensions)
    return () => window.removeEventListener("resize", updateDimensions)
  }, [])

  return (
    <div className="flex flex-col max-w-md mx-auto min-h-screen">
      {/* Header */}
      <Header onBack={() => router.push("/meme-generator")} />

      {/* Template Preview */}
      <div className="px-6 py-4 flex justify-center relative">
        {/* Guide lines - changed from blue to black */}
        <div className="absolute top-0 bottom-0 left-1/2 border-l-2 border-dashed border-[#333333]/30 z-0"></div>
        <div className="absolute left-0 right-0 top-1/2 border-t-2 border-dashed border-[#333333]/30 z-0"></div>

        {/* Image container with frame */}
        <div className="relative">
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
            ref={imageRef} 
            className="absolute inset-0 rounded-lg overflow-hidden"
            style={{ 
              top: '10%', 
              left: '10%', 
              right: '10%', 
              bottom: '15%' 
            }}
          >
            <Image
              src={templates[currentTemplate] || "/placeholder.svg"}
              alt="Meme template"
              fill
              className="object-cover z-20 rounded-lg"
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
            />
          </div>

          {/* Dimensions label - changed to gray */}
          <div className="absolute bottom-0 left-0 right-0 bg-[#666666] text-white text-center py-1 rounded-b-lg z-40">
            {dimensions.width.toFixed(2)} × {dimensions.height.toFixed(2)}
          </div>
        </div>
      </div>

      {/* Pagination dots */}
      <div className="flex justify-center space-x-2 mt-4">
        {templates.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full ${index === currentTemplate ? "bg-[#333333]" : "bg-gray-300"}`}
            onClick={() => setCurrentTemplate(index)}
          />
        ))}
      </div>

      {/* Next button */}
      <div className="px-6 mt-4">
        <Link
          href="/meme-result"
          className="block w-full bg-[#333333] text-white py-3 rounded-full text-center font-phudu text-lg"
        >
          NEXT
        </Link>
      </div>

      {/* Similar memes section */}
      <div className="px-6 mt-8">
        <h2 className="text-lg font-inika uppercase text-[#666666] mb-2">MEME USING THE SAME TEMPLATE</h2>
        <div className="grid grid-cols-2 gap-2">
          {similarMemes.map((meme, index) => (
            <div key={index} className="border border-[#333333] rounded-lg overflow-hidden">
              <Image
                src={templates[currentTemplate]}
                alt={`Similar meme ${index + 1}`}
                width={150}
                height={150}
                className="w-full h-auto"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
