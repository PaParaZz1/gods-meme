"use client"

import { ChevronsDown } from "lucide-react"

interface ScrollHintProps {
  onClick?: () => void
  onTouchStart?: (e: React.TouchEvent) => void
  onTouchMove?: (e: React.TouchEvent) => void
  onTouchEnd?: () => void
  className?: string
}

export default function ScrollHint({
  onClick,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
  className = ""
}: ScrollHintProps) {
  return (
    <div 
      className={`flex flex-col items-center cursor-pointer ${className}`}
      onClick={onClick}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <ChevronsDown className="w-4 h-4 text-[#666666]" />
      <span className="text-xs text-[#666666] mt-1">Swipe up to view gallery</span>
    </div>
  )
}

