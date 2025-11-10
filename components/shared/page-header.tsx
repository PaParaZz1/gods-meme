"use client"

import Image from "next/image"

interface PageHeaderProps {
  showLogo?: boolean
  logoSize?: number
  className?: string
}

export default function PageHeader({ 
  showLogo = true, 
  logoSize = 96,
  className = ""
}: PageHeaderProps) {
  return (
    <div className={`w-full flex flex-col items-center relative px-6 ${className}`}>
      {/* Question mark button positioned absolutely to the right */}
      <div className="absolute right-6 top-2">
        <button className="w-6 h-6 bg-[#333333] rounded-full flex items-center justify-center text-white text-xl">
          ?
        </button>
      </div>
      
      {/* Centered logo and title */}
      {showLogo && (
        <div className="flex flex-col items-center">
          <div className="bg-[#333333] rounded-full w-16 h-16 flex items-center justify-center mb-2">
            <Image src="/logo_head.png" alt="God's Meme Logo" width={logoSize} height={logoSize} />
          </div>
          <h1 className="text-3xl xs:text-2xl font-inika text-[#333333]">GOD'S MEME</h1>
        </div>
      )}
    </div>
  )
}

