"use client"

interface ActionButtonProps {
  text: string
  onClick: () => void
  disabled?: boolean
  isLoading?: boolean
  isTouchActive?: boolean
  onTouchStart?: () => void
  onTouchEnd?: () => void
  variant?: "simple" | "enhanced" // simple for QA page, enhanced for main page
  className?: string
}

export default function ActionButton({
  text,
  onClick,
  disabled = false,
  isLoading = false,
  isTouchActive = false,
  onTouchStart,
  onTouchEnd,
  variant = "simple",
  className = ""
}: ActionButtonProps) {
  const isSimple = variant === "simple"
  
  return (
    <button 
      onClick={onClick}
      disabled={disabled || isLoading}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      className={`w-full py-4 xs:py-2 rounded-full font-phudu text-2xl xs:text-md transform transition-all duration-300 relative overflow-hidden group ${
        disabled || isLoading
          ? "bg-[#CCCCCC] text-[#666666] cursor-not-allowed"
          : isSimple
            ? "bg-[#333333] text-white hover:bg-[#444444] active:scale-[0.98]"
            : "bg-[#333333] text-white hover:shadow-lg active:scale-[0.98]"
      } ${isLoading && !isSimple ? 'scale-[0.98] shadow-inner' : ''} ${className}`}
    >
      {/* Button text */}
      <span className={`relative z-10 transition-all duration-300 ${
        isLoading ? 'opacity-0' : 'opacity-100'
      } ${!isSimple ? 'group-hover:tracking-wider' : ''}`}>
        {text}
      </span>
      
      {/* Loading dots that appear in place of text */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <div className="flex space-x-2">
            <div className="w-2.5 h-2.5 bg-white rounded-full animate-pulse-dot1"></div>
            <div className="w-2.5 h-2.5 bg-white rounded-full animate-pulse-dot2"></div>
            <div className="w-2.5 h-2.5 bg-white rounded-full animate-pulse-dot3"></div>
          </div>
        </div>
      )}
      
      {/* Hover background effect */}
      {!disabled && !isLoading && (
        <div className={`absolute inset-0 bg-gradient-to-r from-[#333333] via-[#444444] to-[#333333] transition-opacity duration-300 ${isTouchActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}></div>
      )}
      
      {/* Enhanced variant: Hover particle effects */}
      {!isSimple && !disabled && !isLoading && (
        <div className={`absolute inset-0 overflow-hidden transition-opacity duration-300 ${isTouchActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
          <div className="absolute h-1 w-1 bg-white/40 rounded-full top-[20%] left-[15%] animate-float-particle1"></div>
          <div className="absolute h-1.5 w-1.5 bg-white/30 rounded-full top-[60%] left-[25%] animate-float-particle2"></div>
          <div className="absolute h-1 w-1 bg-white/40 rounded-full top-[30%] left-[60%] animate-float-particle3"></div>
          <div className="absolute h-2 w-2 bg-white/20 rounded-full top-[70%] left-[80%] animate-float-particle4"></div>
          <div className="absolute h-1.5 w-1.5 bg-white/30 rounded-full top-[40%] left-[40%] animate-float-particle5"></div>
        </div>
      )}
      
      {/* Enhanced variant: Pulse border effect when loading */}
      {!isSimple && isLoading && (
        <div className="absolute inset-0 rounded-full border-2 border-white/0 animate-pulse-border"></div>
      )}
    </button>
  )
}

