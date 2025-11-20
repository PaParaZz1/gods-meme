"use client"

import Image from "next/image"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export default function FinalResult() {
  const router = useRouter()
  const [keywords, setKeywords] = useState("FUNNY, HUMOROUS, JOKE")
  const [tags, setTags] = useState("happiness, love")
  
  // Add state for generated image
  const [generatedImage, setGeneratedImage] = useState('/template1.jpg')
  
  // Add state for success popup
  const [showSuccessPopup, setShowSuccessPopup] = useState(false)
  
  // Add state for share modal
  const [showShareModal, setShowShareModal] = useState(false)
  const [isShareModalClosing, setIsShareModalClosing] = useState(false)
  
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
      
      // Load generated image
      const storedImage = localStorage.getItem('generated_image');
      if (storedImage) {
        setGeneratedImage(storedImage);
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
    try {
      // create a link element
      const link = document.createElement('a')
      // set the download image path - use state instead of direct localStorage access
      link.href = generatedImage
      // set the download file name
      link.download = 'my-meme.jpg'
      // add the link to the document
      document.body.appendChild(link)
      // simulate a click on the link
      link.click()
      // remove the link from the document
      document.body.removeChild(link)
      
      // Show success popup
      setShowSuccessPopup(true)
      
      // Hide popup after 2 seconds
      setTimeout(() => {
        setShowSuccessPopup(false)
      }, 1500)
    } catch (error) {
      console.error('Error downloading meme:', error)
    }
  }

  // Handle share button click
  const handleShareClick = () => {
    setShowShareModal(true)
  }

  // Close share modal with animation
  const closeShareModal = () => {
    setIsShareModalClosing(true)
    setTimeout(() => {
      setShowShareModal(false)
      setIsShareModalClosing(false)
    }, 300)
  }

  // Share to different platforms
  const handleShareTo = (platform: string) => {
    // First, download the image
    try {
      const link = document.createElement('a')
      link.href = generatedImage
      link.download = `gods-meme-${Date.now()}.jpg`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error('Error downloading image:', error)
    }
    
    // Then open the social media platform
    const shareText = encodeURIComponent('Check out my meme! Created with God\'s MEME')
    let shareUrl = ''
    
    switch (platform) {
      case 'twitter':
        // Open Twitter compose page
        shareUrl = `https://twitter.com/intent/tweet?text=${shareText}`
        break
      case 'facebook':
        // Open Facebook - user can create post manually
        shareUrl = 'https://www.facebook.com/'
        break
      case 'instagram':
        // Instagram doesn't have web posting, just open Instagram
        alert('Image downloaded! Please open Instagram app and upload the image from your downloads.')
        closeShareModal()
        return
      case 'whatsapp':
        // Open WhatsApp web
        shareUrl = 'https://web.whatsapp.com/'
        break
      default:
        return
    }
    
    // Open social media platform
    window.open(shareUrl, '_blank', 'width=600,height=800')
    closeShareModal()
    
    // Show a helpful message
    setTimeout(() => {
      alert('Image downloaded! You can now upload it to ' + platform)
    }, 500)
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
              src={generatedImage}
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
            
            <button 
              className="flex flex-col items-center"
              onClick={handleShareClick}
            >
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

      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-2xl p-8 px-12 flex flex-col items-center space-y-4 mx-8 max-w-sm w-full animate-popup">
            {/* Success Icon */}
            <div className="w-16 h-16 flex items-center justify-center">
              <Image
                src="/save_success.png"
                alt="Success"
                width={64}
                height={64}
                className="object-contain"
              />
            </div>
            
            {/* Success Text */}
            <p className="text-gray-800 text-lg font-phudu text-center">
              Save Success!
            </p>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60"
            onClick={closeShareModal}
          ></div>
          
          {/* Modal Content Container */}
          <div className={`relative mx-6 max-w-md w-full ${isShareModalClosing ? 'animate-scaleOut' : 'animate-popup'}`}>
            {/* Close button - outside modal */}
            <button
              onClick={closeShareModal}
              className="absolute -top-12 -right-3 w-10 h-10 flex items-center justify-center rounded-full z-20 hover:scale-110 transition-transform"
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
            <div className="bg-white rounded-3xl p-6 relative z-10">
            
            {/* Top Section: Meme Card Display */}
            <div className="bg-[#333333] rounded-2xl p-4 mb-4">
              {/* Header with logo and title */}
              <div className="flex items-center mb-3 space-x-2">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                  <Image 
                    src="/logo_head_reverse_color.png" 
                    alt="God's Meme Logo" 
                    width={32} 
                    height={32}
                    className="object-contain"
                  />
                </div>
                <h3 className="text-white text-lg font-inika">GOD&apos;S MEME</h3>
              </div>
              
              {/* Meme Image with text overlay */}
              <div className="bg-white rounded-xl overflow-hidden mb-3 relative">
                
                {/* Meme Image */}
                <div className="relative w-full aspect-square">
                  <Image
                    src={generatedImage}
                    alt="Generated Meme"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
              
              {/* Description Text */}
              <p className="text-white text-md mb-3 text-left font-inika">
                &quot;Type in a keyword, and boom! God&apos;s MEME will spit out a meme so perfect.&quot;
              </p>
              
              {/* QR Code placeholder */}
              {/* <div className="flex justify-end">
                <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center">
                  <Image 
                    src="/placeholder-qrcode.png" 
                    alt="QR Code" 
                    width={56} 
                    height={56}
                    className="object-contain"
                  />
                </div>
              </div> */}
            </div>
            
            {/* Bottom Section: Share Options */}
            <div>
              <h2 className="ml-2 text-base font-phudu mb-2">SHARE TO</h2>
              
              {/* Social Media Icons Grid */}
              <div className="grid grid-cols-4 px-2">
                {/* Instagram */}
                <button
                  onClick={() => handleShareTo('instagram')}
                  className="flex flex-col items-center space-y-2 group"
                >
                  <div className="w-12 h-12 bg-[#333333] rounded-lg flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </div>
                </button>

                {/* Twitter/X */}
                <button
                  onClick={() => handleShareTo('twitter')}
                  className="flex flex-col items-center space-y-2 group"
                >
                  <div className="w-12 h-12 bg-[#333333] rounded-lg flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </div>
                </button>

                {/* WhatsApp */}
                <button
                  onClick={() => handleShareTo('whatsapp')}
                  className="flex flex-col items-center space-y-2 group"
                >
                  <div className="w-12 h-12 bg-[#333333] rounded-lg flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                  </div>
                </button>

                {/* Facebook */}
                <button
                  onClick={() => handleShareTo('facebook')}
                  className="flex flex-col items-center space-y-2 group"
                >
                  <div className="w-12 h-12 bg-[#333333] rounded-lg flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </div>
                </button>
              </div>
            </div>
          </div>
          </div>
        </div>
      )}

      {/* Add popup animation styles */}
      <style jsx global>{`
        @keyframes popup {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .animate-popup {
          animation: popup 0.3s ease-out forwards;
        }
        
        @keyframes scaleOut {
          from {
            opacity: 1;
            transform: scale(1);
          }
          to {
            opacity: 0;
            transform: scale(0.8);
          }
        }
        
        .animate-scaleOut {
          animation: scaleOut 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  )
} 