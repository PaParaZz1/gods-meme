"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronsDown, ChevronsUp } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import ErrorToast from "./error-toast"

// Define types to solve index signature problems
type TabKey = "sentiment" | "intention" | "style";
type SentimentKey = "happiness" | "love" | "anger" | "sorrow" | "fear" | "hate";
type IntentionKey = "humor" | "sarcasm" | "rant" | "encourage" | "self-mockery" | "expressive";
type StyleKey = "motivational" | "funny" | "wholesome" | "dark" | "romantic" | "sarcastic";
type ItemKey = SentimentKey | IntentionKey | StyleKey;

export default function MemeGenerator() {
  const router = useRouter()
  const [selectedTab, setSelectedTab] = useState("sentiment")
  const [waterLevels, setWaterLevels] = useState<{
    sentiment: Record<SentimentKey, number>;
    intention: Record<IntentionKey, number>;
    style: Record<StyleKey, number>;
  }>({
    sentiment: { happiness: 3, love: 3, anger: 3, sorrow: 3, fear: 3, hate: 3 },
    intention: { humor: 3, sarcasm: 3, rant: 3, encourage: 3, "self-mockery": 3, expressive: 3 },
    style: { motivational: 3, funny: 3, wholesome: 3, dark: 3, romantic: 3, sarcastic: 3 }
  })
  const [draggedItem, setDraggedItem] = useState<string | null>(null)
  const godAreaRef = useRef<HTMLDivElement>(null)
  const [isInputFocused, setIsInputFocused] = useState(false)
  const [isBlending, setIsBlending] = useState(false)
  const [isTouchActive, setIsTouchActive] = useState(false)
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const dragItemRef = useRef<HTMLDivElement>(null)
  const initialTouchRef = useRef({ x: 0, y: 0 })
  const initialElementPosRef = useRef({ x: 0, y: 0 })
  const [isSmallMobile, setIsSmallMobile] = useState(false)

  // New states for advanced gallery transition
  const [galleryPosition, setGalleryPosition] = useState<'closed' | 'partial' | 'full'>('closed')
  const [scrollY, setScrollY] = useState(0)
  const galleryRef = useRef<HTMLDivElement>(null)
  const scrollThreshold = 100 // Threshold in pixels for showing header in full screen mode
  const [dragConstraints, setDragConstraints] = useState<{ top: number; bottom: number }>({ top: 0, bottom: 0 })
  const [isDraggingGallery, setIsDraggingGallery] = useState(false)
  const [lastGalleryPosition, setLastGalleryPosition] = useState<'partial' | 'full'>('partial')
  
  // 添加滑动触摸相关的状态
  const [touchStartY, setTouchStartY] = useState(0)
  const [touchEndY, setTouchEndY] = useState(0)
  const mainAreaRef = useRef<HTMLDivElement>(null)
  const [isSwipeAction, setIsSwipeAction] = useState(false)

  // Calculate drag constraints when gallery position changes
  useEffect(() => {
    if (galleryPosition === 'partial' || galleryPosition === 'full') {
      // Only allow dragging down to close the gallery since both states are full screen
      setDragConstraints({ top: 0, bottom: window.innerHeight / 2 })
    }
  }, [galleryPosition])

  useEffect(() => {
    const checkSmallMobile = () => {
      setIsSmallMobile(window.innerWidth <= 375)
    }
    checkSmallMobile()
  }, [])

  // New state for character animations
  const [showAddAnimation, setShowAddAnimation] = useState(false)
  const [showRemoveAnimation, setShowRemoveAnimation] = useState(false)
  // New state to track if any animation is currently playing
  const [isAnimationPlaying, setIsAnimationPlaying] = useState(false)

  // Add a timestamp ref to track touch/click duration
  const touchStartTimeRef = useRef<number>(0)
  const isDragOperationRef = useRef<boolean>(false)

  // Add this state at the top of your component
  const [isUpdatingWaterLevel, setIsUpdatingWaterLevel] = useState(false)
  
  // Add state for input keywords
  const [inputValue, setInputValue] = useState("")

  const [showBlendAnimation, setShowBlendAnimation] = useState(false)

  // Add water level state for the god bowl, initial 0, max 8
  const [godWaterLevel, setGodWaterLevel] = useState(0)

  // Add state for error toast notification
  const [showErrorToast, setShowErrorToast] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  // Button touch states for error toast
  const [isErrorButtonTouchActive, setIsErrorButtonTouchActive] = useState(false);
  
  const handleErrorButtonTouchStart = () => {
    setIsErrorButtonTouchActive(true);
  };
  
  const handleErrorButtonTouchEnd = () => {
    setTimeout(() => {
      setIsErrorButtonTouchActive(false);
    }, 300);
    handleCloseErrorToast();
  };

  // Utility function to show error toast
  const showError = (message: string) => {
    setShowErrorToast(false);
    
    setErrorMessage(message);
    
    setTimeout(() => {
      setShowErrorToast(true);
    }, 50);
    
    setIsBlending(false);
    setShowBlendAnimation(false);
    setIsAnimationPlaying(false);
  };

  // Function to handle error toast closing
  const handleCloseErrorToast = () => {
    setShowErrorToast(false);
    setErrorMessage("");
    
    setIsBlending(false);
    setShowBlendAnimation(false);
    setIsAnimationPlaying(false);
  };

  const tabContent = {
    sentiment: {
      title: "Sentiment",
      items: ["happiness", "love", "anger", "sorrow", "fear", "hate"]
    },
    intention: {
      title: "Intention",
      items: ["humor", "sarcasm", "rant", "encourage", "self-mockery", "expressive"]
    },
    style: {
      title: "Style",
      items: ["motivational", "funny", "wholesome", "dark", "romantic", "sarcastic"]
    }
  }

  const currentTabContent = tabContent[selectedTab as keyof typeof tabContent]

  const getWaterLevel = (item: string) => {
    const tab = selectedTab as TabKey;
    const itemKey = item as ItemKey;
    
    // Fix: Use type assertion to ensure correct key type matching
    if (tab === "sentiment") {
      return waterLevels[tab][itemKey as SentimentKey] || 0;
    } else if (tab === "intention") {
      return waterLevels[tab][itemKey as IntentionKey] || 0;
    } else {
      return waterLevels[tab][itemKey as StyleKey] || 0;
    }
  };

  const handleDragStart = (item: string) => {
    setDraggedItem(item)
  }

  // handle drag end event for desktop/pc devices
  const handleDragEnd = (e: React.DragEvent) => {
    if (!draggedItem || !godAreaRef.current || isAnimationPlaying) {
      setDraggedItem(null)
      return;
    }
    
    const godRect = godAreaRef.current.getBoundingClientRect()
    
    if (
      e.clientX >= godRect.left &&
      e.clientX <= godRect.right &&
      e.clientY >= godRect.top &&
      e.clientY <= godRect.bottom
    ) {
      // Dragged to god area, decrease water level
      setWaterLevels(prev => {
        const tab = selectedTab as TabKey;
        const item = draggedItem as ItemKey;
        
        // Fix: Use type assertion to ensure correct key type matching
        let currentLevel = 0;
        if (tab === "sentiment") {
          currentLevel = prev[tab][item as SentimentKey];
        } else if (tab === "intention") {
          currentLevel = prev[tab][item as IntentionKey];
        } else {
          currentLevel = prev[tab][item as StyleKey];
        }
        
        if (currentLevel > 0) {
          // Show add animation
          setShowAddAnimation(true);
          setShowRemoveAnimation(false);
          // Set animation playing state
          setIsAnimationPlaying(true);
          
          setGodWaterLevel(prevLevel => Math.min(prevLevel + 1, 16));
          
          setTimeout(() => {
            setShowAddAnimation(false);
            setIsAnimationPlaying(false);
          }, 1500); // Animation duration
          
          // When updating water level, also need to use correct type assertion
          return {
            ...prev,
            [tab]: {
              ...prev[tab],
              [item]: currentLevel - 1
            }
          };
        }
        return prev;
      });
    }
    
    setDraggedItem(null)
  }

  // Prevent page scrolling when dragging
  const preventScroll = (e: TouchEvent) => {
    if (isDragging) {
      e.preventDefault();
    }
  }

  // Modified handleItemTouchStart to always record start time
  const handleItemTouchStart = (e: React.TouchEvent, item: string) => {
    // If animation is playing, do not start new drag
    if (isAnimationPlaying) return;
    
    // Always record the start time of the touch, regardless of water level
    touchStartTimeRef.current = Date.now();
    isDragOperationRef.current = false;
    
    // Only proceed with drag setup if there's water to drag
    if (getWaterLevel(item) === 0) return;
    
    // Set dragging state immediately
    setIsDragging(true);
    
    const touch = e.touches[0];
    initialTouchRef.current = { x: touch.clientX, y: touch.clientY };
    
    if (dragItemRef.current) {
      const rect = dragItemRef.current.getBoundingClientRect();
      initialElementPosRef.current = { x: rect.left, y: rect.top };
    }
    
    setDraggedItem(item);
  };

  // Modified handleItemTouchMove to set drag operation flag
  const handleItemTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !draggedItem) return;
    
    // If dragging water glass, prohibit swipe operation
    setIsSwipeAction(false);
    
    // If the user has moved their finger, it's a drag operation
    isDragOperationRef.current = true
    
    const touch = e.touches[0]
    
    // Use current touch position directly
    setDragPosition({
      x: touch.clientX,
      y: touch.clientY
    })
    
  }

  const handleItemTouchEnd = (e: React.TouchEvent) => {
    if (!isDragging || !draggedItem || !godAreaRef.current || isAnimationPlaying) {
      setIsDragging(false)
      setDraggedItem(null)
      return;
    }
    
    // Reset swipe state after drag is complete
    setIsSwipeAction(false);
    
    const godRect = godAreaRef.current.getBoundingClientRect()
    const touch = e.changedTouches[0]
    
    if (
      touch.clientX >= godRect.left &&
      touch.clientX <= godRect.right &&
      touch.clientY >= godRect.top &&
      touch.clientY <= godRect.bottom
    ) {
      // Dragged to god area, decrease water level
      setWaterLevels(prev => {
        const tab = selectedTab as TabKey;
        const item = draggedItem as ItemKey;
        
        // Fix: Use type assertion to ensure correct key type matching
        let currentLevel = 0;
        if (tab === "sentiment") {
          currentLevel = prev[tab][item as SentimentKey];
        } else if (tab === "intention") {
          currentLevel = prev[tab][item as IntentionKey];
        } else {
          currentLevel = prev[tab][item as StyleKey];
        }
        
        if (currentLevel > 0) {
          // Ensure add animation is triggered
          setShowAddAnimation(true);
          setShowRemoveAnimation(false); // Ensure remove animation is not triggered simultaneously
          setIsAnimationPlaying(true);
          
          setGodWaterLevel(prevLevel => Math.min(prevLevel + 1, 16));
          
          setTimeout(() => {
            setShowAddAnimation(false);
            setIsAnimationPlaying(false);
          }, 1500); // Animation duration
          
          const updatedWaterLevels = {
            ...prev,
            [tab]: {
              ...prev[tab],
              [item]: currentLevel - 1
            }
          };
          
          setTimeout(() => {
            const hasSelectedSentiment = Object.values(updatedWaterLevels.sentiment).some(level => level < 3);
            const hasSelectedIntention = Object.values(updatedWaterLevels.intention).some(level => level < 3);
            const hasSelectedStyle = Object.values(updatedWaterLevels.style).some(level => level < 3);
            
            setHighlightCategories(prev => ({
              sentiment: !hasSelectedSentiment && prev.sentiment,
              intention: !hasSelectedIntention && prev.intention,
              style: !hasSelectedStyle && prev.style
            }));
          }, 100);
          
          return updatedWaterLevels;
        }
        return prev;
      });
    }
    
    setIsDragging(false)
    setDraggedItem(null)
  }

  // Find the handleWaterGlassClick function and optimize it
  const handleWaterGlassClick = (item: ItemKey) => {
    // Prevent multiple rapid clicks from causing issues
    if (isUpdatingWaterLevel) return;
    
    setIsUpdatingWaterLevel(true);
    
    setWaterLevels(prev => {
      const tab = selectedTab as TabKey;
      
      // Use type assertion to ensure correct key type matching
      let currentLevel = 0;
      if (tab === "sentiment") {
        currentLevel = prev[tab][item as SentimentKey];
      } else if (tab === "intention") {
        currentLevel = prev[tab][item as IntentionKey];
      } else {
        currentLevel = prev[tab][item as StyleKey];
      }
      
      // only increase the level if it's not already at the max
      if (currentLevel === 3) {
        return prev;
      }
      
      // Add animation trigger logic
      setShowRemoveAnimation(true);
      setShowAddAnimation(false);
      setIsAnimationPlaying(true);
      
      // When clicking the water glass to increase water level, the bowl's water should decrease
      setGodWaterLevel(prevLevel => Math.max(prevLevel - 1, 0));
      
      setTimeout(() => {
        setShowRemoveAnimation(false);
        setIsAnimationPlaying(false);
      }, 1500);
      
      // When updating water level, also need to use correct type assertion
      return {
        ...prev,
        [tab]: {
          ...prev[tab],
          [item]: currentLevel + 1
        }
      };
    });
    
    // Reset the flag after a short delay
    setTimeout(() => {
      setIsUpdatingWaterLevel(false);
      
      const hasSelectedSentiment = Object.values(waterLevels.sentiment).some(level => level < 3);
      const hasSelectedIntention = Object.values(waterLevels.intention).some(level => level < 3);
      const hasSelectedStyle = Object.values(waterLevels.style).some(level => level < 3);
      
      setHighlightCategories(prev => ({
        sentiment: !hasSelectedSentiment && prev.sentiment,
        intention: !hasSelectedIntention && prev.intention,
        style: !hasSelectedStyle && prev.style
      }));
    }, 100);
  };

  const [highlightCategories, setHighlightCategories] = useState<{
    sentiment: boolean;
    intention: boolean;
    style: boolean;
  }>({
    sentiment: false,
    intention: false,
    style: false
  });

  const handleBlendClick = async () => {
    if (inputValue.trim() === '') {
      showError('Please enter at least one keyword');
      return;
    }
    
    const hasSelectedSentiment = Object.values(waterLevels.sentiment).some(level => level < 3);
    const hasSelectedIntention = Object.values(waterLevels.intention).some(level => level < 3);
    const hasSelectedStyle = Object.values(waterLevels.style).some(level => level < 3);
    
    setHighlightCategories({
      sentiment: !hasSelectedSentiment,
      intention: !hasSelectedIntention,
      style: !hasSelectedStyle
    });
    
    if (!hasSelectedSentiment || !hasSelectedIntention || !hasSelectedStyle) {
      showError('Please select at least one tag from each category');
      return;
    }

    setHighlightCategories({
      sentiment: false,
      intention: false,
      style: false
    });

    setIsBlending(true)
    // Add logic to play blend animation
    setShowBlendAnimation(true)
    setShowAddAnimation(false)
    setShowRemoveAnimation(false)
    setIsAnimationPlaying(true)
    
    try {
      // Process the keywords from the input field
      let keywordsList: string[] = [];
      if (inputValue.trim()) {
        // Split input value by commas or spaces
        keywordsList = inputValue
          .split(/,|\s+/)
          .map(word => word.trim())
          .filter(word => word.length > 0);
      }
      
      // Prepare the tags data with water levels in the required format
      const number2degree = (value: number) => {
        if (value === 0) return "very";
        if (value === 1) return "moderate";
        if (value === 2) return "slightly";
      }
      const tagsData = {
        "Emotion Category": 
          Object.entries(waterLevels.sentiment)
            .filter(([_, value]) => value < 3)  // Only include items with water level < 3
            .map(([key, value]) => ({
              "content": key, 
              "degree": number2degree(value)
            })),
        "Intention Category": 
          Object.entries(waterLevels.intention)
            .filter(([_, value]) => value < 3)  // Only include items with water level < 3
            .map(([key, value]) => ({
              "content": key, 
              "degree": number2degree(value)
            })),
        "Style Preference": 
          Object.entries(waterLevels.style)
            .filter(([_, value]) => value < 3)  // Only include items with water level < 3
            .map(([key, value]) => ({
              "content": key, 
              "degree": number2degree(value)
            })),
        "Scene or Theme": []
      };
      
      console.log('Processing data:', { keywords: keywordsList, tags: tagsData });
      
      // Make a single API call with both keywords and tags data
      const response = await fetch('/api/process_keywords', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: localStorage.getItem('user_uid'),
          keywords: keywordsList,
          tags: tagsData
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.log(`Failed to process data: ${errorData.error_msg || 'Unknown error'}`);
        
        // Show error toast with the error message
        showError(errorData.error_msg || 'Something went wrong. Please try again.');
        return;
      }
    } catch (error) {
      console.error('Error processing data:', error);
      
      // Show error toast
      showError('Network error. Please check your connection and try again.');
      
      return;
    }
    
    // Simulate processing time, reset state after animation completes
    setTimeout(() => {
      setIsBlending(false)
      setShowBlendAnimation(false)
      setIsAnimationPlaying(false)
      // Reset god's bowl water level
      setGodWaterLevel(0)
      saveWaterLevel()
      router.push("/template-selection")
    }, 1500)
  }

  const handleButtonTouchStart = () => {
    setIsTouchActive(true)
  }

  const handleButtonTouchEnd = () => {
    // Short delay to reset state, allowing user to see the effect
    setTimeout(() => {
      setIsTouchActive(false)
    }, 300)
  }

  // New state for gallery
  const [showGallery, setShowGallery] = useState(false)
  const [galleryImages, setGalleryImages] = useState([
    { id: 1, src: "/template1.jpg", likes: 120, height: 320 },
    { id: 2, src: "/template2.jpg", likes: 85, height: 280 },
    { id: 3, src: "/template3.jpg", likes: 230, height: 350 },
    { id: 4, src: "/template4.jpg", likes: 67, height: 300 },
    { id: 5, src: "/template5.jpg", likes: 192, height: 270 },
    { id: 6, src: "/template1.jpg", likes: 145, height: 330 },
    { id: 7, src: "/template2.jpg", likes: 78, height: 290 },
    { id: 8, src: "/template3.jpg", likes: 210, height: 310 },
    { id: 9, src: "/template5.jpg", likes: 142, height: 280 },
    { id: 10, src: "/template1.jpg", likes: 245, height: 340 },
    { id: 11, src: "/template2.jpg", likes: 178, height: 270 },
    { id: 12, src: "/template3.jpg", likes: 110, height: 330 },
  ])
  const [likedImages, setLikedImages] = useState<number[]>([])

  // New function to handle like
  const handleLikeImage = (id: number) => {
    if (likedImages.includes(id)) {
      // Cancel like
      setLikedImages(prev => prev.filter(imageId => imageId !== id))
      setGalleryImages(prev => 
        prev.map(img => img.id === id ? {...img, likes: img.likes - 1} : img)
      )
    } else {
      // Add like
      setLikedImages(prev => [...prev, id])
      setGalleryImages(prev => 
        prev.map(img => img.id === id ? {...img, likes: img.likes + 1} : img)
      )
    }
  }

  // New function to toggle gallery with partial expansion
  const toggleGallery = () => {
    if (galleryPosition === 'closed') {
      // Restore the last position when reopening
      setGalleryPosition(lastGalleryPosition)
      setShowGallery(true)
    } else {
      // Remember the current position before closing
      if (galleryPosition === 'partial' || galleryPosition === 'full') {
        setLastGalleryPosition(galleryPosition)
      }
      
      // Ensure closed state is set immediately
      setGalleryPosition('closed')
      
      // Reduce delay time to make closing more immediate
      setTimeout(() => {
        setShowGallery(false)
      }, 250) // Consistent delay time with other places
    }
  }

  // Function to handle main page swipe gestures
  const handleMainTouchStart = (e: React.TouchEvent) => {
    setTouchStartY(e.touches[0].clientY)
    setIsSwipeAction(false)
  }
  
  const handleMainTouchMove = (e: React.TouchEvent) => {
    if (isDragging) return; // Avoid conflict with water glass dragging
    
    setTouchEndY(e.touches[0].clientY)
    
    // Detect if it's a clear vertical swipe
    if (Math.abs(e.touches[0].clientY - touchStartY) > 10) {
      setIsSwipeAction(true)
    }
  }
  
  const handleMainTouchEnd = () => {
    if (!isSwipeAction) {
      // Reset states even if not a valid swipe
      setTouchStartY(0)
      setTouchEndY(0)
      setIsSwipeAction(false)
      return;
    }
    
    // If swiping up more than 50px and Gallery is currently closed, open Gallery
    if (galleryPosition === 'closed' && touchStartY - touchEndY > 50) {
      setGalleryPosition(lastGalleryPosition)
      setShowGallery(true)
    }
    
    // Ensure states are reset in any case
    setTouchStartY(0)
    setTouchEndY(0)
    setIsSwipeAction(false)
  }

  // New function to handle gallery scroll
  const handleGalleryScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollPosition = e.currentTarget.scrollTop
    setScrollY(scrollPosition)
    
    // Don't change modes while dragging
    if (isDraggingGallery) return
    
    // Switch from partial to full based on scroll
    if (galleryPosition === 'partial' && scrollPosition > 150) {
      setGalleryPosition('full')
    } 
    // Switch from full to partial when scrolling back up to threshold
    else if (galleryPosition === 'full' && scrollPosition < 50) {
      setGalleryPosition('partial')
    }
  }

  // Handle drag end for the gallery
  const handleGalleryDragEnd = (info: any) => {
    setIsDraggingGallery(false)
    
    // Support handling Gallery state changes through drag and swipe gestures
    
    // If user dragged up in partial mode (header visible)
    if (galleryPosition === 'partial' && info.offset && info.offset.y < -100) {
      setGalleryPosition('full') // Switch to header hidden
      setLastGalleryPosition('full')
    } 
    // If user dragged down in full mode (header hidden)
    else if (galleryPosition === 'full' && info.offset && info.offset.y > 100) {
      setGalleryPosition('full') // Switch to header visible
      setLastGalleryPosition('full')
    }
    // If user dragged down significantly, close the gallery - lower close threshold
    else if (info.offset && info.offset.y > 100) {
      // Remember the position before closing
      setLastGalleryPosition('full')
      
      // Ensure closed state is set immediately
      setGalleryPosition('closed')
      
      // Reduce delay time to make closing more immediate
      setTimeout(() => {
        setShowGallery(false)
      }, 250)
    }
  }

  // Handle Gallery area touch swipe gestures
  const handleGalleryTouchStart = (e: React.TouchEvent) => {
    setTouchStartY(e.touches[0].clientY)
    setIsSwipeAction(false)
  }
  
  const handleGalleryTouchMove = (e: React.TouchEvent) => {
    if (isDraggingGallery) return;
    
    setTouchEndY(e.touches[0].clientY)
    
    // Detect if it's a clear vertical swipe - lower detection threshold, increase sensitivity
    if (Math.abs(e.touches[0].clientY - touchStartY) > 5) {
      setIsSwipeAction(true)
    }
  }
  
  const handleGalleryTouchEnd = () => {
    if (!isSwipeAction) {
      // Reset states even if not a valid swipe
      setTouchStartY(0)
      setTouchEndY(0)
      setIsSwipeAction(false)
      return;
    }
    
    // In Gallery area, swiping down more than 30px closes Gallery - lower close threshold
    if (touchEndY - touchStartY > 30) {
      // Remember the position before closing
      setLastGalleryPosition('full')
      
      // Ensure closed state is set immediately
      setGalleryPosition('closed')
      
      // Reduce delay time to make closing more immediate
      setTimeout(() => {
        setShowGallery(false)
      }, 250)
    }
    
    // Ensure states are reset in any case
    setTouchStartY(0)
    setTouchEndY(0)
    setIsSwipeAction(false)
  }

  // Add this to your component's useEffect
  useEffect(() => {
    // Retrieve the saved water level from localStorage
    const savedWaterLevel = localStorage.getItem('waterLevel')
    
    if (savedWaterLevel) {
      // Parse the saved values
      const values = savedWaterLevel.split(',').map(val => parseInt(val, 10))
      
      // Only update if we have valid values
      if (values.length === 18 && !values.some(isNaN)) {
        setWaterLevels(prev => ({
          ...prev,
          sentiment: {
            ...prev.sentiment,
            happiness: values[0],
            love: values[1],
            anger: values[2],
            sorrow: values[3],
            fear: values[4],
            hate: values[5]
          },
          intention: {
            ...prev.intention,
            humor: values[6],
            sarcasm: values[7],
            rant: values[8],
            encourage: values[9],
            "self-mockery": values[10],
            expressive: values[11]
          },
          style: {
            ...prev.style,
            motivational: values[12],
            funny: values[13],
            wholesome: values[14],
            dark: values[15],
            romantic: values[16],
            sarcastic: values[17]
          }
        }))
      }
    }
    // If no saved water level or invalid data, the default values from useState will be used
  }, [])

  // When water level changes, save it to localStorage
  const saveWaterLevel = () => {
    // Flatten the nested object into an array of values
    const values = [
      // Sentiment values
      waterLevels.sentiment.happiness,
      waterLevels.sentiment.love,
      waterLevels.sentiment.anger,
      waterLevels.sentiment.sorrow,
      waterLevels.sentiment.fear,
      waterLevels.sentiment.hate,
      // Intention values
      waterLevels.intention.humor,
      waterLevels.intention.sarcasm,
      waterLevels.intention.rant,
      waterLevels.intention.encourage,
      waterLevels.intention["self-mockery"],
      waterLevels.intention.expressive,
      // Style values
      waterLevels.style.motivational,
      waterLevels.style.funny,
      waterLevels.style.wholesome,
      waterLevels.style.dark,
      waterLevels.style.romantic,
      waterLevels.style.sarcastic
    ]
    
    // Save the current water level to localStorage whenever it changes
    localStorage.setItem('waterLevel', values.join(','))
  }

  // Clean up touch states to prevent state residue
  useEffect(() => {
    const resetTouchStates = () => {
      setTouchStartY(0)
      setTouchEndY(0)
      setIsSwipeAction(false)
    };

    // Listen for touch end
    document.addEventListener('touchend', resetTouchStates);
    
    // Also reset when gallery state changes
    if (galleryPosition === 'closed') {
      resetTouchStates();
    }
    
    return () => {
      document.removeEventListener('touchend', resetTouchStates);
    };
  }, [galleryPosition]);

  // Prevent body scrolling when error toast is shown
  useEffect(() => {
    if (showErrorToast) {
      // Disable scrolling on body
      document.body.style.overflow = 'hidden';
      
      // Add passive: false to override default browser behavior
      document.addEventListener('touchmove', preventScroll, { passive: false });
    } else {
      // Re-enable scrolling when toast is hidden
      document.body.style.overflow = 'auto';
      document.removeEventListener('touchmove', preventScroll);
    }
    
    return () => {
      document.body.style.overflow = 'auto';
      document.removeEventListener('touchmove', preventScroll);
    };
  }, [showErrorToast]);

  return (
    <div 
      className="flex flex-col items-center max-w-md mx-auto min-h-screen overscroll-none"
      onTouchMove={handleItemTouchMove}
      onTouchEnd={handleItemTouchEnd}
      ref={mainAreaRef}
      onTouchStart={handleMainTouchStart}
    >
      {/* Header */}
      <div className="w-full flex flex-col items-center relative px-6 pt-8 xs:pt-4">
        {/* Question mark button positioned absolutely to the right */}
        <div className="absolute right-6 top-10">
          <button className="w-6 h-6 bg-[#333333] rounded-full flex items-center justify-center text-white text-xl">
            ?
          </button>
        </div>
        
        {/* Centered logo and title */}
        <div className="flex flex-col items-center">
          <div className="bg-[#333333] rounded-full w-16 h-16 flex items-center justify-center mb-2">
            <Image src="/logo_head.png" alt="God's Meme Logo" width={96} height={96} />
          </div>
          <h1 className="text-3xl xs:text-2xl font-inika text-[#333333]">GOD'S MEME</h1>
        </div>
      </div>

        {/* Search Input with curved lines */}
        <div className="w-full mt-4 xs:mt-2 relative">
          <div className="relative px-8">
            <input
              type="text"
              placeholder="Enter your keywords (e.g. cat, funny)"
              className={`w-full px-6 py-3 rounded-full border-2 border-[#333333] text-left font-lexend transition-colors duration-300 focus:outline-none ${
                isInputFocused 
                  ? "bg-[#333333] text-white placeholder-white/70" 
                  : "bg-white text-[#333333] placeholder-[#666666]"
              }`}
              style={{ textAlign: 'left' }}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onFocus={() => setIsInputFocused(true)}
              onBlur={() => setIsInputFocused(false)}
            />
          </div>
          
          {/* Left curved line - flatter curve from edge to padding */}
          <div className="absolute left-0 top-1/4 -translate-y-1/2 pointer-events-none">
            <svg width="32" height="20" viewBox="0 0 32 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 5 Q10 15, 32 20" stroke="#333333" strokeWidth="2" />
            </svg>
          </div>
          
          {/* Right curved line - flatter curve from padding to edge */}
          <div className="absolute right-0 top-1/4 -translate-y-1/2 pointer-events-none">
            <svg width="32" height="20" viewBox="0 0 32 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M32 5 Q22 15, 0 20" stroke="#333333" strokeWidth="2" />
            </svg>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="w-full px-16 mt-6 xs:mt-2 mb-2 xs:mb-1">
          <div className="flex space-x-2 items-center justify-center">
            <button
              className={`flex items-center rounded-full relative overflow-hidden transform transition-all duration-300 ease-in-out active:scale-95 ${
                selectedTab === "sentiment" 
                  ? `pr-3 bg-[#EEEEEE] shadow-inner ${highlightCategories.sentiment ? 'bg-[#FFE4E4] text-[#B72E2E]' : ''}` 
                  : `hover:bg-gray-50 hover:shadow-sm ${highlightCategories.sentiment ? 'bg-[#FFE4E4] text-[#B72E2E]' : 'bg-white'}`
              }`}
              onClick={() => setSelectedTab("sentiment")}
            >
              <div className={`relative z-10 transition-transform duration-300 ${selectedTab === "sentiment" ? "scale-100" : ""}`}>
                <Image src={highlightCategories.sentiment ? "/unfinished.png" : "/sentiment.png"} alt="Sentiment" width={49} height={49} className="mr-1" />
              </div>
              {selectedTab === "sentiment" && (
                <span className="font-inika text-sm relative z-10 animate-fadeIn">
                  Sentiment
                </span>
              )}
              {selectedTab === "sentiment" && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
              )}
            </button>
            <button
              className={`flex items-center rounded-full relative overflow-hidden transform transition-all duration-300 ease-in-out active:scale-95 ${
                selectedTab === "intention" 
                  ? `pr-3 bg-[#EEEEEE] shadow-inner ${highlightCategories.intention ? 'bg-[#FFE4E4] text-[#B72E2E]' : ''}` 
                  : `hover:bg-gray-50 hover:shadow-sm ${highlightCategories.intention ? 'bg-[#FFE4E4] text-[#B72E2E]' : 'bg-white'}`
              }`}
              onClick={() => setSelectedTab("intention")}
            >
              <div className={`relative z-10 transition-transform duration-300 ${selectedTab === "intention" ? "scale-100" : ""}`}>
                <Image src={highlightCategories.intention ? "/unfinished.png" : "/intention.png"} alt="Intention" width={49} height={49} className="mr-1" />
              </div>
              {selectedTab === "intention" && (
                <span className="font-inika text-sm relative z-10 animate-fadeIn">
                  Intention
                </span>
              )}
              {selectedTab === "intention" && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
              )}
            </button>
            <button
              className={`flex items-center rounded-full relative overflow-hidden transform transition-all duration-300 ease-in-out active:scale-95 ${
                selectedTab === "style" 
                  ? `pr-3 bg-[#EEEEEE] shadow-inner ${highlightCategories.style ? 'bg-[#FFE4E4] text-[#B72E2E]' : ''}` 
                  : `hover:bg-gray-50 hover:shadow-sm ${highlightCategories.style ? 'bg-[#FFE4E4] text-[#B72E2E]' : 'bg-white'}`
              }`}
              onClick={() => setSelectedTab("style")}
            >
              <div className={`relative z-10 transition-transform duration-300 ${selectedTab === "style" ? "scale-100" : ""}`}>
                <Image src={highlightCategories.style ? "/unfinished.png" : "/style.png"} alt="Style" width={49} height={49} className="mr-1" />
              </div>
              {selectedTab === "style" && (
                <span className="font-inika text-sm relative z-10 animate-fadeIn">
                  Style
                </span>
              )}
              {selectedTab === "style" && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
              )}
            </button>
          </div>
        </div>
        
        {/* Arrow indicator that points to the selected tab */}
        <div className="w-full relative h-4 xs:h-2">
          <motion.div 
            className="absolute w-6 h-6 transform -translate-x-1/2"
            animate={{ left: selectedTab === "sentiment" ? "33.3%" : selectedTab === "intention" ? "50%" : "66.7%" }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <svg width="24" height="18" viewBox="0 0 24 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 0L24 18H0L12 0Z" fill="#EEEEEE" />
            </svg>
          </motion.div>
        </div>
        
      {/* Dynamic Content Grid based on selected tab */}
        <div className="w-full px-2">
          <div className="bg-[#EEEEEE] rounded-lg p-4 xs:p-2 mx-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedTab}
                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -15, scale: 0.95 }}
                transition={{ 
                  duration: 0.0,
                  type: "spring",
                  stiffness: 400,
                  damping: 25
                }}
                className="grid grid-cols-6 gap-2"
              >
                {currentTabContent.items.map((item, index) => (
                  <motion.div
                    key={item} 
                    className="flex flex-col items-center cursor-pointer relative"
                    // Add a larger invisible click area
                    style={{ 
                      touchAction: "manipulation" // Improves touch response
                    }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.2,
                      delay: index * 0.03,
                      type: "spring",
                      stiffness: 400,
                      damping: 20
                    }}
                    whileHover={{ 
                      scale: isAnimationPlaying ? 1.0 : 1.1,  // 动画播放时禁用悬停效果
                      transition: { duration: 0.15 }
                    }}
                    whileTap={{ scale: isAnimationPlaying ? 1.0 : 0.95 }}  // 动画播放时禁用点击效果
                  >
                    {/* Add an invisible larger click area */}
                    <div className="absolute inset-0 z-10" />
                    
                    <div 
                      ref={draggedItem === item ? dragItemRef : null}
                      className={`h-[78px] flex items-center justify-center relative ${
                        getWaterLevel(item) > 0 && !isAnimationPlaying 
                          ? 'cursor-grab active:cursor-grabbing' 
                          : isAnimationPlaying && getWaterLevel(item) > 0 
                            ? 'cursor-not-allowed' 
                            : ''
                      }`}
                      draggable={getWaterLevel(item) > 0 && !isAnimationPlaying}
                      onDragStart={() => !isAnimationPlaying && handleDragStart(item)}
                      onDragEnd={handleDragEnd}
                    >
                      <Image 
                        src={`/glass_base.png`} 
                        alt={item} 
                        width={isSmallMobile ? 32 : 48} 
                        height={isSmallMobile ? 48 : 72} 
                        className={`object-contain relative z-10 ${
                          draggedItem === item && isDragging 
                            ? 'opacity-30' 
                            : draggedItem === item 
                              ? 'opacity-50' 
                              : isAnimationPlaying 
                                ? 'opacity-50 filter grayscale'
                                : ''
                        }`}
                        onTouchStart={(e) => !isAnimationPlaying && handleItemTouchStart(e, item)}
                        onClick={(e) => {
                          // Stop event propagation to prevent affecting adjacent cups
                          e.stopPropagation();
                          if (!isAnimationPlaying) {
                            handleWaterGlassClick(item as ItemKey);
                          }
                        }}
                      />
                      
                      {getWaterLevel(item) > 0 && (
                        <div className="absolute inset-0 scale-220 bottom-5 left-[calc(-4px)] flex items-center justify-center z-0">
                          <Image 
                            src={`/water_level${getWaterLevel(item)}.png`}
                            alt={`Water level ${getWaterLevel(item)}`}
                            width={isSmallMobile ? 32 : 48}
                            height={isSmallMobile ? 48 : 72}
                            className={`object-contain transition-all duration-300 ease-out ${
                              draggedItem === item && isDragging 
                                ? 'opacity-30' 
                                : draggedItem === item 
                                  ? 'opacity-50' 
                                  : isAnimationPlaying 
                                    ? 'opacity-50 filter grayscale'
                                    : ''
                            }`}
                          />
                        </div>
                      )}
                      
                    </div>
                    <span className={`text-xs font-inika text-center mt-1 ${isAnimationPlaying ? 'opacity-50' : ''}`}>{item}</span>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Character Display with fixed animations */}
        <div 
          ref={godAreaRef}
          className={"w-full flex justify-center mt-4 relative"}
        >
          <div className="relative w-[390px] h-[230px] xs:w-[280px] xs:h-[160px]">
            {/* Static image (always visible as base) */}
            <div className="absolute inset-0">
              <Image 
                src="/meme_god_static.png" 
                alt="Meme God" 
                width={isSmallMobile ? 280 : 390} 
                height={isSmallMobile ? 160 : 230} 
                className={`${showAddAnimation || showRemoveAnimation || showBlendAnimation ? 'opacity-0' : 'opacity-100'} transition-opacity duration-0`}
              />
            </div>
            
            {/* God's bowl water level - 显示在静态图像上 */}
            {godWaterLevel > 0 && !showAddAnimation && !showRemoveAnimation && !showBlendAnimation && (
              <div className="absolute inset-0">
                <Image 
                  src={`/water_level_${godWaterLevel / 2}.png`}
                  alt={`God's bowl water level ${godWaterLevel / 2}`}
                  width={isSmallMobile ? 280 : 390} 
                  height={isSmallMobile ? 160 : 230}
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
                  width={isSmallMobile ? 280 : 390} 
                  height={isSmallMobile ? 160 : 230} 
                  priority 
                />
              </div>
            )}
            
            {/* 在动画播放时也显示碗里的水 */}
            {godWaterLevel > 0 && (showAddAnimation || showRemoveAnimation) && (
              <div className="absolute inset-0 pointer-events-none">
                <Image 
                  src={`/water_level_${godWaterLevel / 2}.png`}
                  alt={`God's bowl water level ${godWaterLevel / 2}`}
                  width={isSmallMobile ? 280 : 390} 
                  height={isSmallMobile ? 160 : 230}
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
                  width={isSmallMobile ? 280 : 390} 
                  height={isSmallMobile ? 160 : 230} 
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
                  width={isSmallMobile ? 280 : 390} 
                  height={isSmallMobile ? 160 : 230} 
                  priority 
                />
              </div>
            )}
            
            {/* Highlight area when dragging */}
            {/*
            <div className="absolute inset-0 rounded-xl border-2 border-dashed border-[#333333]/30 bg-[#EEEEEE]/50 pointer-events-none z-10" />*
            {draggedItem && (
              <div className="absolute inset-0 rounded-xl bg-[#EEEEEE]/50 pointer-events-none z-10" />
            )}
            */}
          </div>
        </div>

        {/* Blend Button */}
        <div className="w-full px-6 mt-6 mb-4 xs:mt-5 xs:mb-3">
          <button 
            onClick={handleBlendClick}
            disabled={isBlending}
            onTouchStart={handleButtonTouchStart}
            onTouchEnd={handleButtonTouchEnd}
            className={`w-full bg-[#333333] text-white py-4 xs:py-2 rounded-full font-phudu text-2xl
              transform transition-all duration-300 relative overflow-hidden group
              ${isBlending ? 'scale-[0.98] shadow-inner' : 'hover:shadow-lg active:scale-[0.98]'}`}
          >
            {/* Button text that disappears when loading */}
            <span className={`relative z-10 xs:text-md transition-all duration-300 ${isBlending ? 'opacity-0' : 'opacity-100 group-hover:tracking-wider'}`}>
              BLEND IT
            </span>
            
            {/* Loading dots that appear in place of text */}
            {isBlending && (
              <div className="absolute inset-0 flex items-center justify-center z-20">
                <div className="flex space-x-2">
                  <div className="w-2.5 h-2.5 bg-white rounded-full animate-pulse-dot1"></div>
                  <div className="w-2.5 h-2.5 bg-white rounded-full animate-pulse-dot2"></div>
                  <div className="w-2.5 h-2.5 bg-white rounded-full animate-pulse-dot3"></div>
                </div>
              </div>
            )}
            
            {/* Hover background effect */}
            <div className={`absolute inset-0 bg-gradient-to-r from-[#333333] via-[#444444] to-[#333333] transition-opacity duration-300 ${isTouchActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}></div>
            
            {/* Hover particle effects */}
            <div className={`absolute inset-0 overflow-hidden transition-opacity duration-300 ${isTouchActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
              <div className="absolute h-1 w-1 bg-white/40 rounded-full top-[20%] left-[15%] animate-float-particle1"></div>
              <div className="absolute h-1.5 w-1.5 bg-white/30 rounded-full top-[60%] left-[25%] animate-float-particle2"></div>
              <div className="absolute h-1 w-1 bg-white/40 rounded-full top-[30%] left-[60%] animate-float-particle3"></div>
              <div className="absolute h-2 w-2 bg-white/20 rounded-full top-[70%] left-[80%] animate-float-particle4"></div>
              <div className="absolute h-1.5 w-1.5 bg-white/30 rounded-full top-[40%] left-[40%] animate-float-particle5"></div>
            </div>
            
            {isBlending && (
              <>
                {/* Pulse border effect */}
                <div className="absolute inset-0 rounded-full border-2 border-white/0 animate-pulse-border"></div>
              </>
            )}
          </button>
        </div>

        {/* Scroll Indicator - 更新显示为滑动手势提示 */}
        <div 
          className="flex flex-col items-center cursor-pointer" 
          onClick={toggleGallery}
          onTouchStart={handleMainTouchStart}
          onTouchMove={handleMainTouchMove}
          onTouchEnd={handleMainTouchEnd}
        >
          <ChevronsDown className="w-4 h-4" />
          <span className="text-xs text-[#666666]">Swipe up to view gallery</span>
        </div>

        {/* Gallery Section - Full screen in both states, with header visibility toggling on scroll */}
        <AnimatePresence>
          {showGallery && (
            <motion.div 
              ref={galleryRef}
              className="fixed inset-0 bg-[#333333] z-50 overflow-auto shadow-lg"
              initial={{ y: "100%" }}
              animate={{ 
                y: galleryPosition === 'partial' ? '0%' : galleryPosition === 'full' ? '0%' : '100%'
              }}
              exit={{ y: "100%" }}
              transition={{ 
                type: "tween", 
                ease: "easeOut", 
                duration: 0.3 
              }}
              onScroll={handleGalleryScroll}
              drag="y"
              dragConstraints={dragConstraints}
              dragElastic={0.2}
              onDragStart={() => setIsDraggingGallery(true)}
              onDragEnd={handleGalleryDragEnd}
              onTouchStart={handleGalleryTouchStart}
              onTouchMove={handleGalleryTouchMove}
              onTouchEnd={handleGalleryTouchEnd}
              style={{ overflow: isDraggingGallery ? 'hidden' : 'auto' }}
            >
              {/* Drag indicator */}
              <div className="absolute top-0 left-0 right-0 flex justify-center pt-2">
                <div className="w-10 h-1 bg-white/30 rounded-full"></div>
              </div>
              {/* Gallery Header */}
              <motion.div 
                className="sticky top-0 bg-[#333333] shadow-sm z-10 p-4 mt-6 flex flex-col items-center"
                animate={{ 
                  opacity: galleryPosition === 'full' && scrollY > scrollThreshold ? 0 : 1,
                  height: galleryPosition === 'full' && scrollY > scrollThreshold ? 0 : 'auto'
                }}
                transition={{ duration: 0.3 }}
              >
                <div 
                  className="flex flex-col items-center cursor-pointer" 
                  onClick={toggleGallery}
                >
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    <ChevronsUp className="w-4 h-4" color="#808080"/>
                  </motion.div>
                  <span className="text-sm text-[#808080]">Swipe down to the home</span>
                </div>

              </motion.div>
              
              {/* Scroll to top button - only visible in full mode when scrolled down */}
              {galleryPosition === 'full' && scrollY > scrollThreshold && (
                <motion.div 
                  className="fixed top-4 inset-x-0 mx-auto w-fit z-20 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg cursor-pointer flex items-center justify-center"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => {
                    if (galleryRef.current) {
                      galleryRef.current.scrollTo({ top: 0, behavior: 'smooth' })
                    }
                  }}
                >
                  <ChevronsUp className="w-4 h-4" color="white" />
                </motion.div>
              )}
              
              {/* Gallery Grid with dark background */}
              <div className="p-4 bg-[#f8f8f8] min-h-screen rounded-t-[30px]">
                <div className="flex justify-center mb-6">
                  <h2 className="text-xl font-inika text-[#333333] mt-2 bg-[#f5f5f5] px-6 py-1 rounded-full">MEME GALLERY</h2>
                </div>
                <div className="columns-2 gap-5 mx-2">
                  {galleryImages.map((image) => (
                    <div 
                      key={image.id} 
                      className="mb-4 break-inside-avoid relative group"
                      style={{ 
                        height: `${image.height}px`,
                        borderRadius: "12px",
                        overflow: "hidden"
                      }}
                    >
                      {/* 使用真实图片替换占位符 */}
                      <div className="absolute inset-0">
                        <Image 
                          src={image.src} 
                          alt={`Meme template ${image.id}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                      
                      {/* Like Button */}
                      <div className="absolute bottom-2 right-2">
                        <button 
                          onClick={() => handleLikeImage(image.id)}
                          className={`flex items-center space-x-1 px-2 py-1 rounded-full ${
                            likedImages.includes(image.id) 
                              ? 'bg-[#333333] text-white' 
                              : 'bg-white/80 text-gray-700 hover:bg-gray-100'
                          } transition-colors duration-200 shadow-md`}
                        >
                          <svg 
                            width="16" 
                            height="16" 
                            viewBox="0 0 24 24" 
                            fill={likedImages.includes(image.id) ? "white" : "none"} 
                            stroke={likedImages.includes(image.id) ? "white" : "currentColor"} 
                            strokeWidth="2"
                          >
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                          </svg>
                          <span className="text-xs">{image.likes}</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating drag element */}
        {isDragging && draggedItem && (
          <div 
            className="fixed pointer-events-none z-50"
            style={{ 
              left: `${dragPosition.x}px`, 
              top: `${dragPosition.y}px`,
              transform: 'translate(-50%, -50%)' // Center the element
            }}
          >
            <div className="relative">
              <Image 
                src={`/glass_base.png`} 
                alt={draggedItem} 
                width={48} 
                height={72} 
                className="object-contain relative z-10 opacity-80"
              />
              
              {getWaterLevel(draggedItem) > 0 && (
                <div className="absolute inset-0 scale-220 bottom-5 left-[calc(-4px)] flex items-center justify-center z-0">
                  <Image 
                    src={`/water_level${getWaterLevel(draggedItem)}.png`}
                    alt={`Water level ${getWaterLevel(draggedItem)}`}
                    width={48}
                    height={72}
                    className="object-contain"
                  />
                </div>
              )}
              
            </div>
          </div>
        )}

        {/* Error Toast Notification */}
        <AnimatePresence>
          {showErrorToast && (
            <ErrorToast 
              message={errorMessage}
              isVisible={showErrorToast}
              onClose={handleCloseErrorToast}
              autoHideDuration={5000}
            />
          )}
        </AnimatePresence>
    </div>
  )
}