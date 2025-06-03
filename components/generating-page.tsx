"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"

export default function GeneratingPage() {
  const router = useRouter()
  const [progress, setProgress] = useState(0)
  const [showMeme, setShowMeme] = useState(false)
  const [imageIndex, setImageIndex] = useState(0)
  const [isApiComplete, setIsApiComplete] = useState(false)
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  
  // Array of image paths for the animation sequence
  const animationImages = [
    "/template1.jpg",
    "/template2.jpg",
    "/template3.jpg",
    "/template4.jpg",
    "/template5.jpg",
  ]
  
  // Call the API when component mounts
  useEffect(() => {
    const callGenerationAPI = async () => {
      try {
        // Check if this is a regeneration
        const regenerationParams = localStorage.getItem('regeneration_params');
        
        if (regenerationParams) {
          // This is a regeneration request
          localStorage.removeItem('regeneration_params'); // Clean up
          const params = JSON.parse(regenerationParams);
          
          console.log('Starting regeneration with params:', params);
          
          // Call regenerate API (which will handle polling internally)
          const response = await fetch('/api/regenerate', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(params),
          });
          
          const result = await response.json();
          
          if (response.ok && result.success) {
            setGeneratedImage(result.generated_image);
            setIsApiComplete(true);
            
            // Store the generated image for the next page
            localStorage.setItem('generated_image', result.generated_image);
          } else {
            console.error('Regeneration failed:', result.error);
            setError(result.error || 'Regeneration failed');
          }
        } else {
          // This is initial generation
          const params = localStorage.getItem('generation_params');
          if (!params) {
            setError('Generation parameters not found');
            return;
          }
          
          const parsedParams = JSON.parse(params);
          const { user_id, template_image } = parsedParams;
          
          // Generate a user ID if not present
          let uid = user_id;
          if (!uid) {
            uid = 'user_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now().toString(36);
            localStorage.setItem('user_uid', uid);
            
            // Update the generation params with the new user ID
            parsedParams.user_id = uid;
            localStorage.setItem('generation_params', JSON.stringify(parsedParams));
          }
          
          // Call get_result API
          const response = await fetch('/api/get_result', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              user_id: uid,
              template_image: template_image || ""
            }),
          });
          
          const result = await response.json();
          
          if (response.ok && result.success) {
            setGeneratedImage(result.generated_image);
            setIsApiComplete(true);
            
            // Store the generated image for the next page
            localStorage.setItem('generated_image', result.generated_image);
          } else {
            console.error('Generation failed:', result.error);
            setError(result.error || 'Generation failed');
          }
        }
      } catch (error) {
        console.error('Error calling generation API:', error);
        setError('An error occurred while generating the meme');
      }
    };
    
    callGenerationAPI();
  }, []);
  
  // Cycle through animation images
  useEffect(() => {
    if (showMeme) return; // Stop animation when meme is ready
    
    const imageInterval = setInterval(() => {
      setImageIndex(prev => (prev + 1) % animationImages.length);
    }, 800);
    
    return () => clearInterval(imageInterval);
  }, [showMeme, animationImages.length]);
  
  // Simulate progress bar growth and handle completion
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        let newProgress = prev;
        
        // If API is complete, accelerate to 100%
        if (isApiComplete && prev < 95) {
          newProgress = Math.min(95 + Math.random() * 5, 100);
        } else if (prev < 90) {
          // Normal progress increase, but slow down near the end if API isn't complete
          newProgress = prev + Math.random() * 2 + 0.5;
        } else if (isApiComplete) {
          // API is complete and we're near the end, finish up
          newProgress = prev + Math.random() * 3 + 2;
        } else {
          // API not complete yet, slow progress near the end
          newProgress = prev + Math.random() * 0.5 + 0.2;
        }
        
        newProgress = Math.min(newProgress, 100);
        
        // When progress reaches 100% and API is complete
        if (newProgress >= 100 && isApiComplete) {
          clearInterval(interval);
          setShowMeme(true);
          
          // Navigate to results page after a short delay
          setTimeout(() => {
            router.push("/generation-result");
          }, 1000);
        }
        
        return newProgress;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isApiComplete, router]);
  
  // Handle errors
  useEffect(() => {
    if (error) {
      // Show error and redirect back
      setTimeout(() => {
        alert(`Error: ${error}`);
        router.push("/template-selection");
      }, 2000);
    }
  }, [error, router]);

  return (
    <div className="flex flex-col items-center min-h-screen bg-white">
      {/* Question mark button in top right corner */}
      <div className="w-full flex justify-end p-8 pr-6">
        <button className="w-6 h-6 bg-[#333333] rounded-full flex items-center justify-center text-white text-xl">
          ?
        </button>
      </div>
      
      {/* Main content - centered vertically and horizontally */}
      <div className="flex-1 flex flex-col items-center justify-center w-[75%] -mt-16">
        <div className="w-full max-w-md flex flex-col items-center">
          {/* Title */}
          <h1 className="font-inika text-2xl text-center mb-8 italic">
            {error ? "Something went wrong..." :
             progress >= 100 ? "Your meme is ready!" : 
             "God is creating your meme..."}
          </h1>
          
          {/* Character animation using image sequence - larger and centered */}
          <div className="relative w-64 h-64 mb-8 flex items-center justify-center">
            {/* Show current animation frame */}
            <Image 
              src={animationImages[imageIndex]} 
              alt={"Template preview"} 
              width={256} 
              height={256} 
              className="rounded-lg shadow-md object-cover transition-opacity duration-300"
              priority
            />
          </div>
          
          {/* Progress bar container with relative positioning */}
          <div className="w-full relative mb-8 mt-6">
            {/* Cat animation that moves with progress - adjusted position */}
            <div 
              className="absolute bottom-full transition-all duration-300 ease-out"
              style={{ 
                left: `calc(${progress}% - 20px)`, 
              }}
            >
              <div className="relative h-10 w-10">
                <Image
                  src="/generating_cat.gif"
                  alt="Loading cat"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>
            
            {/* Progress bar without percentage inside */}
            <div className="w-full bg-gray-200 rounded-sm h-2 overflow-hidden">
              <div 
                className="bg-[#333333] h-2 rounded-sm transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              >
              </div>
            </div>
            
            {/* Percentage display that moves with progress */}
            <div 
              className="absolute transition-all duration-300 ease-out mt-1"
              style={{ 
                left: `calc(${progress}% - 12px)`, 
                top: '100%'
              }}
            >
              <span className="text-[#333333] font-bold text-phudu">{Math.round(progress)}%</span>
            </div>
          </div>
          
          {/* Loading text prompts */}
          <div className={`text-center transition-opacity duration-300 ${showMeme || error ? 'opacity-0' : 'opacity-100'}`}>
            <p className="text-gray-600 font-phudu text-sm">
              {error ? "Please wait..." :
               progress < 30 ? "Gathering divine inspiration..." : 
               progress < 60 ? "Infusing with heavenly humor..." : 
               progress < 90 ? "Adding the final blessed touches..." : 
               "Your meme is almost ready!"}
            </p>
          </div>
        </div>
      </div>
      
      {/* Add some fun background elements */}
      <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
        <div className="absolute h-20 w-20 bg-blue-100 rounded-full top-[10%] left-[15%] animate-float-particle1 opacity-30"></div>
        <div className="absolute h-16 w-16 bg-yellow-100 rounded-full top-[60%] left-[80%] animate-float-particle2 opacity-30"></div>
        <div className="absolute h-24 w-24 bg-purple-100 rounded-full top-[80%] left-[30%] animate-float-particle3 opacity-30"></div>
      </div>
    </div>
  )
} 