"use client"

import Image from "next/image"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export default function FinalResult() {
  const router = useRouter()
  const [keywords, setKeywords] = useState("FUNNY, HUMOROUS, JOKE")
  const [tags, setTags] = useState("happiness, love")
  
  // Animation states
  const [showMeme, setShowMeme] = useState(false)
  const [showLink1, setShowLink1] = useState(false)
  const [showKeywords, setShowKeywords] = useState(false)
  const [showLink2, setShowLink2] = useState(false)
  const [showTags, setShowTags] = useState(false)
  
  // Load meme data and trigger animations
  useEffect(() => {
    // Load meme data from localStorage
    try {
      const memeData = localStorage.getItem('meme_data');
      if (memeData) {
        const parsed = JSON.parse(memeData);
        
        // Set keywords from array to comma-separated string
        if (parsed.keywords && parsed.keywords.length > 0) {
          setKeywords(parsed.keywords.join(', ').toUpperCase());
        }
        
        // Set tags from object to readable string
        if (parsed.tags) {
          const tagStrings: string[] = [];
          Object.entries(parsed.tags).forEach(([category, items]: [string, any]) => {
            if (Array.isArray(items) && items.length > 0) {
              items.forEach((item: any) => {
                tagStrings.push(`${item.content}`);
              });
            }
          });
          if (tagStrings.length > 0) {
            setTags(tagStrings.join(', '));
          }
        }
      }
    } catch (error) {
      console.error('Error loading meme data:', error);
    }
    
    // Start meme animation immediately
    setShowMeme(true)
    
    // Sequence the animations with delays
    const link1Timer = setTimeout(() => setShowLink1(true), 400)
    const keywordsTimer = setTimeout(() => setShowKeywords(true), 800)
    const link2Timer = setTimeout(() => setShowLink2(true), 1200)
    const tagsTimer = setTimeout(() => setShowTags(true), 1600)
    
    // Cleanup timers
    return () => {
      clearTimeout(link1Timer)
      clearTimeout(keywordsTimer)
      clearTimeout(link2Timer)
      clearTimeout(tagsTimer)
    }
  }, [])
  
  const handleFinishCreation = () => {
    // Clear all localStorage items
    localStorage.clear()
    // Navigate to meme-generator page when finished
    router.push("/meme-generator")
  }

  // Add function to download meme image
  const handleDownloadMeme = () => {
    // create a link element
    const link = document.createElement('a')
    // set the download image path
    link.href = localStorage.getItem('generated_image') || '/template1.jpg'
    // set the download file name
    link.download = 'my-meme.jpg'
    // add the link to the document
    document.body.appendChild(link)
    // simulate a click on the link
    link.click()
    // remove the link from the document
    document.body.removeChild(link)
  }

  return (
    <div className="flex flex-col min-h-screen opacity-100">
      {/* Header with title and help button */}
      <div className="flex items-center justify-between p-8 px-6 pb-12 xs:p-6 xs:px-4 xs:pb-4">
        <div className="flex-1"></div>
        <h1 className="text-xl font-inika font-bold flex-1 text-center whitespace-nowrap">MEME Creation</h1>
        <div className="flex-1 flex justify-end">
          <button className="w-6 h-6 bg-[#333333] rounded-full flex items-center justify-center text-white text-xl">
            ?
          </button>
        </div>
      </div>

      {/* Dark background container for image and buttons with shadow */}
      <div 
        className={`bg-[#333333] mx-2 rounded-xl p-2 mb-8 xs:mb-6 shadow-[0_8px_30px_rgb(0,0,0,0.3)] transition-all duration-500 ease-out transform ${
          showMeme ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'
        }`}
      >
        {/* Meme Display */}
        <div className="w-full bg-[#FFFFFF] rounded-xl shadow-md mb-4 overflow-hidden border border-[#333333]">
          <div className="relative w-full aspect-[4/3] bg-[#FFFFFF] max-h-[220px] xs:max-h-[180px]">
            <Image
              src={localStorage.getItem('generated_image') || '/template1.jpg'}
              alt="Meme"
              fill
              className="object-contain"
            />
          </div>
        </div>

        {/* Action Buttons - two on left, two on right */}
        <div className="flex justify-between w-full pb-2 px-4">
          {/* Left buttons group */}
          <div className="flex space-x-6">
            <button 
              className="flex flex-col items-center"
              onClick={handleDownloadMeme}
            >
              <div className="w-10 h-10 bg-[#FFFFFF] rounded-md shadow-md flex items-center justify-center">
                <Image 
                  src="/final_result_save.png" 
                  alt="Save" 
                  width={40} 
                  height={40} 
                />
              </div>
              <span className="text-xs mt-1 text-white">Save</span>
            </button>
            
            <button className="flex flex-col items-center">
              <div className="w-10 h-10 bg-[#FFFFFF] rounded-md shadow-md flex items-center justify-center">
                <Image 
                  src="/final_result_edit.png" 
                  alt="Edit" 
                  width={40} 
                  height={40} 
                />
              </div>
              <span className="text-xs mt-1 text-white">Edit</span>
            </button>
          </div>
          
          {/* Right buttons group */}
          <div className="flex space-x-6">
            <button className="flex flex-col items-center">
                <div className="w-10 h-10 bg-[#FFFFFF] rounded-md shadow-md flex items-center justify-center">
                <Image 
                  src="/final_result_upload.png" 
                  alt="Upload" 
                  width={40} 
                  height={40} 
                />
              </div>
              <span className="text-xs mt-1 text-white">Upload</span>
            </button>
            
            <button className="flex flex-col items-center">
              <div className="w-10 h-10 bg-[#FFFFFF] rounded-md shadow-md flex items-center justify-center">
                <Image 
                  src="/final_result_share.png" 
                  alt="Share" 
                  width={40} 
                  height={40} 
                />
              </div>
              <span className="text-xs mt-1 text-white">Share</span>
            </button>
          </div>
        </div>
      </div>

      {/* Link between meme and keywords - positioned on top of the keywords section */}
      <div 
        className={`flex justify-center -mb-8 -mt-16 z-10 relative transition-all duration-500 ease-out ${
          showLink1 ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
        }`}
      >
        <Image 
          src="/final_result_link1.png" 
          alt="Link between sections" 
          width={13} 
          height={85} 
          className="h-24 w-auto"
        />
      </div>

      {/* Scrollable area for Keywords and Tags */}
      <div className="w-full flex-1 overflow-auto mb-0 px-4">
        {/* Keywords with image */}
        <div 
          className={`w-full mb-6 xs:mb-4 relative transition-all duration-500 ease-out transform ${
            showKeywords ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'
          }`}
        >
          <Image 
            src="/final_result_rect1.png" 
            alt="Keywords background" 
            width={400} 
            height={100} 
            className="w-full h-auto rounded-xl"
          />
          <div className="absolute inset-0 p-4 text-white">
            <h2 className="font-bold mb-2 text-md">Key Words</h2>
            <p className="text-sm">{keywords}</p>
          </div>
        </div>

        {/* Link between keywords and tags - positioned on top of the tags section */}
        <div 
          className={`flex justify-center -mb-8 -mt-16 z-10 relative transition-all duration-500 ease-out ${
            showLink2 ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
          }`}
        >
          <div className="flex justify-end w-4/5">
            <Image 
              src="/final_result_link2.png" 
              alt="Link between keywords and tags" 
              width={13} 
              height={85} 
              className="h-24 w-auto"
            />
          </div>
        </div>
        
        {/* Tags with image */}
        <div 
          className={`w-full mb-4 relative transition-all duration-500 ease-out transform ${
            showTags ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'
          }`}
        >
          <Image 
            src="/final_result_rect2.png" 
            alt="Tags background" 
            width={400} 
            height={100} 
            className="w-full h-auto rounded-xl"
          />
          <div className="absolute inset-0 p-4 text-white">
            <h2 className="font-bold mb-2 text-md">Tags</h2>
            <p className="text-sm">{tags}</p>
          </div>
        </div>
      </div>

      {/* Finish Button - thinner with whitespace on sides */}
      <div className="px-6 mb-16 xs:mb-12 xs:px-8">
        <button 
          onClick={handleFinishCreation}
          className="w-full bg-[#333333] text-white py-4 px-8 rounded-full text-2xl xs:text-xl font-phudu hover:bg-[#444444] transition-colors duration-300 transform hover:scale-[0.98] active:scale-[0.95] shadow-md"
        >
          FINISH CREATION
        </button>
      </div>
    </div>
  )
} 