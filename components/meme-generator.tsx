"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import CatLogo from "./shared/cat-logo"
import { SentimentIcon, Character1Icon, Character2Icon, GlassIcon, DuckCharacter } from "./shared/icons"

export default function MemeGenerator() {
  const [selectedTab, setSelectedTab] = useState("sentiment")

  return (
    <div className="flex flex-col items-center max-w-md mx-auto min-h-screen">
      {/* Header */}
      <div className="w-full flex justify-between items-center px-6 py-4">
        <div className="flex items-center">
          <div className="bg-[#333333] rounded-full w-16 h-16 flex items-center justify-center mr-3">
            <CatLogo size="small" />
          </div>
          <h1 className="text-3xl font-inika font-bold text-[#333333]">GOD'S MEME</h1>
        </div>
        <button className="w-10 h-10 bg-[#333333] rounded-full flex items-center justify-center text-white text-xl font-bold">
          ?
        </button>
      </div>

      {/* Search Input */}
      <div className="w-full px-6 mt-4 relative">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full">
          <div className="border-b-2 border-[#333333] w-full absolute top-0"></div>
        </div>
        <input
          type="text"
          placeholder="Enter your keywords"
          className="w-full px-6 py-3 rounded-full border-2 border-[#333333] text-center relative z-10 bg-white"
        />
      </div>

      {/* Category Tabs */}
      <div className="w-full px-6 mt-6">
        <div className="flex space-x-2">
          <button
            className={`flex items-center rounded-full px-4 py-2 ${
              selectedTab === "sentiment" ? "bg-[#EEEEEE]" : "bg-white"
            }`}
            onClick={() => setSelectedTab("sentiment")}
          >
            <div className="w-10 h-10 rounded-full border-2 border-[#333333] flex items-center justify-center mr-2">
              <SentimentIcon />
            </div>
            <span className="font-inika">Sentiment</span>
          </button>
          <button
            className={`flex items-center rounded-full px-4 py-2 ${
              selectedTab === "character1" ? "bg-[#EEEEEE]" : "bg-white"
            }`}
            onClick={() => setSelectedTab("character1")}
          >
            <div className="w-10 h-10 rounded-full border-2 border-[#333333] flex items-center justify-center">
              <Character1Icon />
            </div>
          </button>
          <button
            className={`flex items-center rounded-full px-4 py-2 ${
              selectedTab === "character2" ? "bg-[#EEEEEE]" : "bg-white"
            }`}
            onClick={() => setSelectedTab("character2")}
          >
            <div className="w-10 h-10 rounded-full border-2 border-[#333333] flex items-center justify-center">
              <Character2Icon />
            </div>
          </button>
        </div>
      </div>

      {/* Emotions Grid */}
      <div className="w-full px-6 mt-4">
        <div className="bg-[#EEEEEE] rounded-lg p-4">
          <div className="grid grid-cols-6 gap-2">
            {["happiness", "love", "anger", "sorrow", "fear", "hate"].map((emotion) => (
              <div key={emotion} className="flex flex-col items-center">
                <div className="w-12 h-16 flex items-center justify-center">
                  <GlassIcon />
                </div>
                <span className="text-xs mt-1">{emotion}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Character Display */}
      <div className="w-full flex justify-center mt-8 relative">
        <div className="absolute bottom-0 w-full border-b-2 border-[#333333]"></div>
        <div className="relative">
          <DuckCharacter />
        </div>
      </div>

      {/* Blend Button */}
      <div className="w-full px-6 mt-16 mb-4">
        <button className="w-full bg-[#333333] text-white py-4 rounded-full font-phudu text-xl">BLEND IT</button>
      </div>

      {/* Scroll Indicator */}
      <div className="flex flex-col items-center mb-8">
        <ChevronDown className="w-6 h-6" />
        <span className="text-sm text-[#666666]">Scroll down to view gallery</span>
      </div>
    </div>
  )
}
