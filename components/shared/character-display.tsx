"use client"

import Image from "next/image"
import { forwardRef } from "react"

interface CharacterDisplayProps {
  godWaterLevel: number
  showAddAnimation?: boolean
  showRemoveAnimation?: boolean
  showBlendAnimation?: boolean
  isSmallMobile?: boolean
  variant?: "default" | "qa"
  className?: string
}

const CharacterDisplay = forwardRef<HTMLDivElement, CharacterDisplayProps>(
  ({ 
    godWaterLevel, 
    showAddAnimation = false,
    showRemoveAnimation = false,
    showBlendAnimation = false,
    isSmallMobile = false,
    variant = "default",
    className = ""
  }, ref) => {
    const width = isSmallMobile ? 280 : 390
    const height = isSmallMobile ? 160 : 230
    const staticImage = variant === "qa" ? "/meme_god_static_qa.png" : "/meme_god_static.png"
    const waterLevelOffset = variant === "qa" ? "translateY(18px)" : ""

    return (
      <div 
        ref={ref}
        className={`w-full flex justify-center relative ${className}`}
      >
        <div className={`relative ${isSmallMobile ? 'w-[280px] h-[160px]' : 'w-[390px] h-[230px]'}`}>
          {/* Static image (always visible as base) */}
          <div className="absolute inset-0">
            <Image 
              src={staticImage}
              alt="Meme God" 
              width={width}
              height={height}
              className={`${showAddAnimation || showRemoveAnimation || showBlendAnimation ? 'opacity-0' : 'opacity-100'} transition-opacity duration-0`}
            />
          </div>
          
          {/* God's bowl water level - Display on static image */}
          {godWaterLevel > 0 && !showAddAnimation && !showRemoveAnimation && !showBlendAnimation && (
            <div className="absolute inset-0" style={{ transform: waterLevelOffset }}>
              <Image 
                src={`/water_level_${Math.min(godWaterLevel, 8)}.png`}
                alt={`God's bowl water level ${Math.min(godWaterLevel, 8)}`}
                width={width}
                height={height}
                className="object-contain"
              />
            </div>
          )}
          
          {/* Add animation */}
          {showAddAnimation && (
            <div className="absolute inset-0">
              <Image 
                src="/god_add_elem.gif" 
                alt="Adding Element" 
                width={width}
                height={height}
                priority 
              />
            </div>
          )}
          
          {/* Display water in bowl during animation */}
          {godWaterLevel > 0 && (showAddAnimation || showRemoveAnimation) && (
            <div className="absolute inset-0 pointer-events-none">
              <Image 
                src={`/water_level_${Math.min(godWaterLevel, 8)}.png`}
                alt={`God's bowl water level ${Math.min(godWaterLevel, 8)}`}
                width={width}
                height={height}
                className="object-contain opacity-70"
              />
            </div>
          )}
          
          {/* Remove animation */}
          {showRemoveAnimation && (
            <div className="absolute inset-0">
              <Image 
                src="/god_remove_elem.gif" 
                alt="Removing Element" 
                width={width}
                height={height}
                priority 
              />
            </div>
          )}
          
          {/* Blend animation */}
          {showBlendAnimation && (
            <div className="absolute inset-0">
              <Image 
                src="/blend.gif" 
                alt="Blending Elements" 
                width={width}
                height={height}
                priority 
              />
            </div>
          )}
        </div>
      </div>
    )
  }
)

CharacterDisplay.displayName = "CharacterDisplay"

export default CharacterDisplay

