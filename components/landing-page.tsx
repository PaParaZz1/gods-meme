import Link from "next/link"
import Image from "next/image"
import LogoCat from "@/components/ui/logo-cat.svg"

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center w-full">
      {/* Top section with cat illustration - fixed at top */}
      <div className="w-full bg-[#333333] rounded-b-[50%] flex justify-center items-center fixed top-0 left-0 right-0 z-10">
        <div className="relative">
          {/* Cat logo */}
          <Image 
            src={LogoCat} 
            alt="God's Meme Cat Logo" 
            width={400} 
            height={320}
            priority
          />
        </div>
      </div>

      {/* Spacer to push content below fixed header */}
      <div className="h-[320px]"></div>

      {/* Text content */}
      <div className="text-center px-6 py-8 max-w-sm mx-auto">
        <h1 className="text-5xl font-inika text-[#333333] mb-6">GOD'S MEME</h1>
        <p className="text-[#333333] text-lg leading-relaxed font-lexend">
          Type in a keyword, and boom! God's MEME will spit out a meme so perfect, it'll make you question whether free
          will even exists. Because apparently, even the universe runs on memes.
        </p>
      </div>

      {/* Button */}
      <Link
        href="/meme-generator"
        className="bg-[#333333] text-white py-4 px-8 rounded-full text-2xl font-phudu w-[90%] max-w-xs mt-4 text-center"
      >
        LET THERE BE MEMES
      </Link>
    </div>
  )
}
