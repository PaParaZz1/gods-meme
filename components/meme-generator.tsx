"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronsDown, ChevronsUp } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import ErrorToast from "./error-toast"
import PageHeader from "./shared/page-header"
import InputWithDecoration from "./shared/input-with-decoration"
import CharacterDisplay from "./shared/character-display"
import ActionButton from "./shared/action-button"
import ScrollHint from "./shared/scroll-hint"
import MemeGallery from "./shared/meme-gallery"

// Define types to solve index signature problems
type TabKey = "emotion" | "intention" | "style";
type EmotionKey = "happiness" | "love" | "anger" | "sorrow" | "fear" | "hate" | "surprise";
type IntentionKey = "humor" | "sarcasm" | "rant" | "encourage" | "self-mockery" | "interactive" | "entertaining" | "expression of surprise" | "expression of love" | "expression of dissatisfaction";
type StyleKey = "motivational" | "funny" | "wholesome" | "dark" | "romantic" | "sarcastic";
type ItemKey = EmotionKey | IntentionKey | StyleKey;

export default function MemeGenerator() {
  const router = useRouter()
  
  // Add registration states
  const [isRegistering, setIsRegistering] = useState(true)
  const [registrationError, setRegistrationError] = useState("")
  const [registrationStep, setRegistrationStep] = useState("Generating your divine ID...")
  
  // Existing states
  const [selectedTab, setSelectedTab] = useState("emotion")
  const [waterLevels, setWaterLevels] = useState<{
    emotion: Record<EmotionKey, number>;
    intention: Record<IntentionKey, number>;
    style: Record<StyleKey, number>;
  }>({
    emotion: { happiness: 3, love: 3, anger: 3, sorrow: 3, fear: 3, hate: 3, surprise: 3 },
    intention: { humor: 3, sarcasm: 3, rant: 3, encourage: 3, "self-mockery": 3, interactive: 3, entertaining: 3, "expression of surprise": 3, "expression of love": 3, "expression of dissatisfaction": 3 },
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
  const [galleryPosition, setGalleryPosition] = useState<'closed' | 'full'>('closed')
  const [scrollY, setScrollY] = useState(0)
  const galleryRef = useRef<HTMLDivElement>(null)
  const scrollThreshold = 100 // Threshold in pixels for showing header in full screen mode
  const [dragConstraints, setDragConstraints] = useState<{ top: number; bottom: number }>({ top: 0, bottom: 0 })
  const [isDraggingGallery, setIsDraggingGallery] = useState(false)
  const [lastGalleryPosition, setLastGalleryPosition] = useState<'full'>('full')
  
  // Add swipe touch related states
  const [touchStartY, setTouchStartY] = useState(0)
  const [touchEndY, setTouchEndY] = useState(0)
  const mainAreaRef = useRef<HTMLDivElement>(null)
  const [isSwipeAction, setIsSwipeAction] = useState(false)

  // Calculate drag constraints when gallery position changes
  useEffect(() => {
    if (galleryPosition === 'full') {
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

  // Add state for QA page
  const [showQAPage, setShowQAPage] = useState(false)
  const [selectedQAOption, setSelectedQAOption] = useState<string>("")
  const [qaOptions, setQaOptions] = useState<string[]>([])
  const [qaQuestion, setQaQuestion] = useState<string>("")
  
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
    emotion: {
      title: "Emotion",
      items: ["happiness", "love", "anger", "sorrow", "fear", "hate", "surprise"]
    },
    intention: {
      title: "Intention",
      items: ["humor", "sarcasm", "rant", "encourage", "self-mockery", "interactive", "entertaining", "expression of surprise", "expression of love", "expression of dissatisfaction"]
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
    if (tab === "emotion") {
      return waterLevels[tab][itemKey as EmotionKey] || 0;
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
        if (tab === "emotion") {
          currentLevel = prev[tab][item as EmotionKey];
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
        if (tab === "emotion") {
          currentLevel = prev[tab][item as EmotionKey];
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
            const hasSelectedEmotion = Object.values(updatedWaterLevels.emotion).some(level => level < 3);
            const hasSelectedIntention = Object.values(updatedWaterLevels.intention).some(level => level < 3);
            const hasSelectedStyle = Object.values(updatedWaterLevels.style).some(level => level < 3);
            
            setHighlightCategories(prev => ({
              emotion: !hasSelectedEmotion && prev.emotion,
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
      if (tab === "emotion") {
        currentLevel = prev[tab][item as EmotionKey];
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
      
      const hasSelectedEmotion = Object.values(waterLevels.emotion).some(level => level < 3);
      const hasSelectedIntention = Object.values(waterLevels.intention).some(level => level < 3);
      const hasSelectedStyle = Object.values(waterLevels.style).some(level => level < 3);
      
      setHighlightCategories(prev => ({
        emotion: !hasSelectedEmotion && prev.emotion,
        intention: !hasSelectedIntention && prev.intention,
        style: !hasSelectedStyle && prev.style
      }));
    }, 100);
  };

  const [highlightCategories, setHighlightCategories] = useState<{
    emotion: boolean;
    intention: boolean;
    style: boolean;
  }>({
    emotion: false,
    intention: false,
    style: false
  });

  const handleBlendClick = async () => {
    if (inputValue.trim() === '') {
      showError('Please enter at least one keyword');
      return;
    }
    
    const hasSelectedEmotion = Object.values(waterLevels.emotion).some(level => level < 3);
    const hasSelectedIntention = Object.values(waterLevels.intention).some(level => level < 3);
    const hasSelectedStyle = Object.values(waterLevels.style).some(level => level < 3);
    
    setHighlightCategories({
      emotion: !hasSelectedEmotion,
      intention: !hasSelectedIntention,
      style: !hasSelectedStyle
    });
    
    if (!hasSelectedEmotion || !hasSelectedIntention || !hasSelectedStyle) {
      showError('Please select at least one tag from each category');
      return;
    }

    setHighlightCategories({
      emotion: false,
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
          Object.entries(waterLevels.emotion)
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
      
      // Save meme data to localStorage for later use
      const memeData = {
        keywords: keywordsList,
        inputValue: inputValue.trim(), // Save original input value
        tags: tagsData,
      };
      localStorage.setItem('meme_data', JSON.stringify(memeData));
      
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
    setTimeout(async () => {
      setIsBlending(false)
      setShowBlendAnimation(false)
      setIsAnimationPlaying(false)
      // Don't reset god's bowl water level yet - keep it for QA page display
      // It will be reset when user clicks "BLEND IT" on QA page
      saveWaterLevel()
      
      try {
        // Fetch question and options from backend
        const questionResponse = await fetch('/api/get_question', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: localStorage.getItem('user_uid')
          }),
        });

        if (!questionResponse.ok) {
          const errorData = await questionResponse.json();
          console.error('Failed to fetch question:', errorData.error_msg);
          
          // Show error and don't proceed to QA page
          showError(errorData.error_msg || 'Failed to load questions. Please try again.');
          return;
        }

        const questionData = await questionResponse.json();
        
        if (questionData.code === 0 && questionData.ret) {
          // Extract question, options and tag from the response
          const { question, option, tag } = questionData.ret;
          
          // Save the tag to localStorage for later use when submitting answer
          const currentMemeData = localStorage.getItem('meme_data')
          if (currentMemeData) {
            const data = JSON.parse(currentMemeData)
            data.qaTag = tag || 'general'
            localStorage.setItem('meme_data', JSON.stringify(data))
          }
          
          // Only show QA page if there are options
          if (option && option.length > 0) {
            setQaQuestion(question || "Who is the target object of this sarcasm?")
            setQaOptions(option)
            setShowQAPage(true)
          } else {
            // Skip QA page and go directly to template selection
            // Reset water level before navigating
            setGodWaterLevel(0)
            router.push("/template-selection")
          }
        } else {
          // If API returns error code, show error
          showError(questionData.error_msg || 'Failed to load questions. Please try again.');
        }
      } catch (error) {
        console.error('Error fetching question:', error);
        showError('Network error. Please check your connection and try again.');
      }
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

  // Handle QA option selection
  const handleQAOptionClick = (option: string) => {
    setSelectedQAOption(option)
  }

  // Handle QA page next button
  const handleQANext = async () => {
    if (!selectedQAOption) {
      return
    }

    // Save the selected option to localStorage
    const memeData = localStorage.getItem('meme_data')
    if (memeData) {
      const data = JSON.parse(memeData)
      data.target = selectedQAOption
      localStorage.setItem('meme_data', JSON.stringify(data))
    }

      try {
        // Send the selected answer to backend
        const response = await fetch('/api/post_answer', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: localStorage.getItem('user_uid'),
            answer_data: {
              question: qaQuestion,
              answer: selectedQAOption,
            }
          }),
        })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('Failed to post answer:', errorData.error_msg)
        // Show error but still allow navigation (optional: you can choose to block navigation)
        showError(errorData.error_msg || 'Failed to submit answer. Please try again.')
        return
      }

      const result = await response.json()
      console.log('Answer posted successfully:', result)
    } catch (error) {
      console.error('Error posting answer:', error)
      // Show error but still allow navigation (optional: you can choose to block navigation)
      showError('Network error. Please check your connection.')
      return
    }

    // Reset god's bowl water level after QA page
    setGodWaterLevel(0)
    saveWaterLevel()

    // Navigate to template selection
    router.push("/template-selection")
  }

  // New state for gallery
  const [showGallery, setShowGallery] = useState(false)

  // New function to toggle gallery with partial expansion
  const toggleGallery = () => {
    if (galleryPosition === 'closed') {
      // Always open to full when reopening
      setGalleryPosition('full')
      setShowGallery(true)
    } else {
      // Close the gallery
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
    
    // If swiping up more than 50px and Gallery is currently closed, open Gallery to full
    if (galleryPosition === 'closed' && touchStartY - touchEndY > 50) {
      setGalleryPosition('full')
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
    
    // Don't change modes while dragging - but allow normal scrolling
    // No state switching needed since we only have full mode when open
  }

  // Handle drag end for the gallery
  const handleGalleryDragEnd = (info: any) => {
    setIsDraggingGallery(false)
    
    // If user dragged down significantly, close the gallery (increased threshold)
    if (info.offset && info.offset.y > 150) {
      // Close the gallery
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
    
    // Only set swipe action for significant movements to avoid interfering with scrolling
    if (Math.abs(e.touches[0].clientY - touchStartY) > 20) {
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
    
    // In Gallery area, swiping down more than 80px closes Gallery (increased threshold)
    if (touchEndY - touchStartY > 80) {
      // Close the gallery
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
      
      // Support both old format (23 values) and new format (24 values with godWaterLevel)
      if ((values.length === 23 || values.length === 24) && !values.some(isNaN)) {
        setWaterLevels(prev => ({
          ...prev,
          emotion: {
            ...prev.emotion,
            happiness: values[0],
            love: values[1],
            anger: values[2],
            sorrow: values[3],
            fear: values[4],
            hate: values[5],
            surprise: values[6]
          },
          intention: {
            ...prev.intention,
            humor: values[7],
            sarcasm: values[8],
            rant: values[9],
            encourage: values[10],
            "self-mockery": values[11],
            interactive: values[12],
            entertaining: values[13],
            "expression of surprise": values[14],
            "expression of love": values[15],
            "expression of dissatisfaction": values[16]
          },
          style: {
            ...prev.style,
            motivational: values[17],
            funny: values[18],
            wholesome: values[19],
            dark: values[20],
            romantic: values[21],
            sarcastic: values[22]
          }
        }))
        
        // Restore god's bowl water level if available (new format with 24 values)
        if (values.length === 24) {
          setGodWaterLevel(values[23])
        }
      }
    }
    
    // Retrieve the saved input value from localStorage
    const savedMemeData = localStorage.getItem('meme_data')
    if (savedMemeData) {
      try {
        const memeData = JSON.parse(savedMemeData)
        if (memeData.inputValue) {
          setInputValue(memeData.inputValue)
        }
      } catch (error) {
        console.error('Error parsing meme_data from localStorage:', error)
      }
    }
    
    // If no saved water level or invalid data, the default values from useState will be used
  }, [])

  // When water level changes, save it to localStorage
  const saveWaterLevel = () => {
    // Flatten the nested object into an array of values
    const values = [
      // Sentiment values
      waterLevels.emotion.happiness,
      waterLevels.emotion.love,
      waterLevels.emotion.anger,
      waterLevels.emotion.sorrow,
      waterLevels.emotion.fear,
      waterLevels.emotion.hate,
      waterLevels.emotion.surprise,
      // Intention values
      waterLevels.intention.humor,
      waterLevels.intention.sarcasm,
      waterLevels.intention.rant,
      waterLevels.intention.encourage,
      waterLevels.intention["self-mockery"],
      waterLevels.intention.interactive,
      waterLevels.intention.entertaining,
      waterLevels.intention["expression of surprise"],
      waterLevels.intention["expression of love"],
      waterLevels.intention["expression of dissatisfaction"],
      // Style values
      waterLevels.style.motivational,
      waterLevels.style.funny,
      waterLevels.style.wholesome,
      waterLevels.style.dark,
      waterLevels.style.romantic,
      waterLevels.style.sarcastic,
      // God's bowl water level
      godWaterLevel
    ]
    
    // Save the current water level to localStorage whenever it changes
    localStorage.setItem('waterLevel', values.join(','))
  }

  // Auto-save when godWaterLevel changes
  useEffect(() => {
    // Only save if not initial render (godWaterLevel has been set from localStorage)
    const savedWaterLevel = localStorage.getItem('waterLevel')
    if (savedWaterLevel) {
      saveWaterLevel()
    }
  }, [godWaterLevel])

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

  // Add registration useEffect at the beginning
  useEffect(() => {
    const performRegistration = async () => {
      try {
        // Check if user already has a UID
        const existingUID = localStorage.getItem('user_uid')
        if (existingUID) {
          console.log('User already registered with UID:', existingUID)
          setIsRegistering(false)
          return
        }

        setRegistrationStep("Generating your divine ID...")
        
        // Generate new UID
        const newUID = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        
        setRegistrationStep("Registering with the divine realm...")
        
        // Call registration API
        const response = await fetch('/api/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            uid: newUID
          }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Registration failed')
        }

        const data = await response.json()
        // Store UID in localStorage
        localStorage.setItem('user_uid', newUID)
        
        setRegistrationStep("Welcome to God's Meme!")
        
        // Short delay to show success message
        setTimeout(() => {
          setIsRegistering(false)
        }, 1000)

      } catch (error) {
        console.error('Registration error:', error)
        setRegistrationError(error instanceof Error ? error.message : 'Registration failed')
        
        // Retry after 3 seconds
        setTimeout(() => {
          setRegistrationError("")
          performRegistration()
        }, 3000)
      }
    }

    performRegistration()
  }, [])

  // Add registration loading component
  const RegistrationLoading = () => (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white px-6">
      {/* Logo */}
      <div className="mb-8">
        <div className="bg-[#333333] rounded-full w-20 h-20 flex items-center justify-center mb-4">
          <Image src="/logo_head.png" alt="God's Meme Logo" width={120} height={120} />
        </div>
        <h1 className="text-4xl font-inika text-[#333333] text-center">GOD'S MEME</h1>
      </div>

      {/* Loading animation */}
      <div className="mb-6">
        <div className="flex space-x-2">
          <div className="w-3 h-3 bg-[#333333] rounded-full animate-pulse-dot1"></div>
          <div className="w-3 h-3 bg-[#333333] rounded-full animate-pulse-dot2"></div>
          <div className="w-3 h-3 bg-[#333333] rounded-full animate-pulse-dot3"></div>
        </div>
      </div>

      {/* Status message */}
      <div className="text-center">
        <p className="text-lg font-lexend text-[#333333] mb-2">
          {registrationStep}
        </p>
        
        {registrationError && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm mb-2">{registrationError}</p>
            <p className="text-red-500 text-xs">Retrying in 3 seconds...</p>
          </div>
        )}
      </div>

      {/* Floating animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] left-[10%] w-2 h-2 bg-[#333333]/20 rounded-full animate-float-particle1"></div>
        <div className="absolute top-[60%] right-[15%] w-3 h-3 bg-[#333333]/15 rounded-full animate-float-particle2"></div>
        <div className="absolute bottom-[30%] left-[20%] w-1.5 h-1.5 bg-[#333333]/25 rounded-full animate-float-particle3"></div>
        <div className="absolute top-[40%] right-[30%] w-2.5 h-2.5 bg-[#333333]/10 rounded-full animate-float-particle4"></div>
      </div>
    </div>
  )

  // Render QA page if showQAPage is true
  if (showQAPage) {
    return (
      <div 
        className="flex flex-col items-center max-w-md mx-auto min-h-screen bg-white py-8"
        ref={mainAreaRef}
        onTouchStart={handleMainTouchStart}
        onTouchMove={handleMainTouchMove}
        onTouchEnd={handleMainTouchEnd}
      >
        {/* Header */}
        <PageHeader showLogo={true} logoSize={96} className="mb-6" />

        {/* Keywords display */}
        <InputWithDecoration 
          value={inputValue || "Your keywords"}
          readOnly={true}
          className="mb-4"
        />

        {/* Question bubble with cloud background */}
        <div className="w-[90%] relative">
          {/* Cloud background image */}
          <div className="relative">
            <Image 
              src="/cloud_qa.png" 
              alt="Cloud background" 
              width={400} 
              height={200} 
              className="w-full h-auto"
            />
            
            {/* Content overlay on cloud */}
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
              <p className="text-center text-lg font-lexend text-[#333333] mb-1">
                {qaQuestion || "Who is the target object of this sarcasm?"}
              </p>
              
              {/* Options - dynamically generated */}
              <div className="flex justify-center gap-4 flex-wrap">
                {qaOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleQAOptionClick(option)}
                    className={`px-4 py-2 rounded-full font-lexend text-xs transition-all duration-200 ${
                      selectedQAOption === option
                        ? "bg-[#333333] text-white"
                        : "bg-[#EEEEEE] text-[#333333] hover:bg-[#DDDDDD]"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Character Display - same as main page */}
        <CharacterDisplay 
          godWaterLevel={godWaterLevel}
          isSmallMobile={isSmallMobile}
          variant="qa"
          className="mb-12"
        />

        {/* Next button */}
        <div className="w-full mb-6 px-6">
          <ActionButton 
            text="BLEND IT"
            onClick={handleQANext}
            disabled={!selectedQAOption}
            variant="enhanced"
          />
        </div>

        {/* Scroll hint */}
        <ScrollHint onClick={toggleGallery} />

        {/* Gallery Section - Same as main page */}
        <MemeGallery 
          showGallery={showGallery}
          galleryPosition={galleryPosition}
          scrollY={scrollY}
          scrollThreshold={scrollThreshold}
          dragConstraints={dragConstraints}
          isDraggingGallery={isDraggingGallery}
          onScroll={handleGalleryScroll}
          onDragStart={() => setIsDraggingGallery(true)}
          onDragEnd={handleGalleryDragEnd}
          onTouchStart={handleGalleryTouchStart}
          onTouchMove={handleGalleryTouchMove}
          onTouchEnd={handleGalleryTouchEnd}
          onToggleGallery={toggleGallery}
        />
      </div>
    )
  }

  return (
    <div 
      className="flex flex-col items-center max-w-md mx-auto min-h-screen overscroll-none"
      onTouchMove={handleItemTouchMove}
      onTouchEnd={handleItemTouchEnd}
      ref={mainAreaRef}
      onTouchStart={handleMainTouchStart}
    >
      {/* Header */}
      <PageHeader showLogo={true} logoSize={96} className="pt-8 xs:pt-4" />

      {/* Search Input with curved lines */}
      <InputWithDecoration 
        value={inputValue}
        placeholder="Enter your keywords (e.g. cat, funny)"
        onChange={setInputValue}
        onFocus={() => setIsInputFocused(true)}
        onBlur={() => setIsInputFocused(false)}
        isFocused={isInputFocused}
        className="mt-4 xs:mt-2"
      />

      {/* Category Tabs */}
      <div className="w-full px-16 mt-6 xs:mt-2 mb-2 xs:mb-1">
        <div className="flex space-x-2 items-center justify-center">
          <button
            className={`flex items-center rounded-full relative overflow-hidden transform transition-all duration-300 ease-in-out active:scale-95 ${
              selectedTab === "emotion" 
                ? `pr-3 bg-[#EEEEEE] shadow-inner ${highlightCategories.emotion ? 'bg-[#FFE4E4] text-[#B72E2E]' : ''}` 
                : `hover:bg-gray-50 hover:shadow-sm ${highlightCategories.emotion ? 'bg-[#FFE4E4] text-[#B72E2E]' : 'bg-white'}`
            }`}
            onClick={() => setSelectedTab("emotion")}
          >
            <div className={`relative z-10 transition-transform duration-300 ${selectedTab === "emotion" ? "scale-100" : ""}`}>
              <Image src={highlightCategories.emotion ? "/unfinished.png" : "/emotion.png"} alt="Emotion" width={49} height={49} className="mr-1" />
            </div>
            {selectedTab === "emotion" && (
              <span className="font-inika text-sm relative z-10 animate-fadeIn">
                Emotion
              </span>
            )}
            {selectedTab === "emotion" && (
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
          animate={{ left: selectedTab === "emotion" ? "33.3%" : selectedTab === "intention" ? "50%" : "66.7%" }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          <svg width="24" height="18" viewBox="0 0 24 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 0L24 18H0L12 0Z" fill="#EEEEEE" />
          </svg>
        </motion.div>
      </div>
      
    {/* Dynamic Content Grid based on selected tab */}
      <div className="w-full px-2 flex justify-center">
        <div className="bg-[#EEEEEE] rounded-lg py-4 px-2 xs:p-2 max-w-[356px]">
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
              className="overflow-x-auto scrollbar-hide max-w-[300px] mx-2"
              style={{ 
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
              }}
            >
              <div className="flex gap-2 pb-1">
                {currentTabContent.items.map((item, index) => (
                  <motion.div
                    key={item} 
                    className="flex flex-col items-center cursor-pointer relative flex-shrink-0"
                    // Add a larger invisible click area
                    style={{ 
                      touchAction: "manipulation", // Improves touch response
                      width: isSmallMobile ? '40px' : '52px' // Fixed width to show approximately 5 items
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
                      scale: isAnimationPlaying ? 1.0 : 1.1,  // Disable hover effect when animation is playing
                      transition: { duration: 0.15 }
                    }}
                    whileTap={{ scale: isAnimationPlaying ? 1.0 : 0.95 }}  // Disable tap effect when animation is playing
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
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Character Display with fixed animations */}
      <CharacterDisplay 
        ref={godAreaRef}
        godWaterLevel={godWaterLevel}
        showAddAnimation={showAddAnimation}
        showRemoveAnimation={showRemoveAnimation}
        showBlendAnimation={showBlendAnimation}
        isSmallMobile={isSmallMobile}
        variant="default"
        className="mt-4"
      />

      {/* Blend Button */}
      <div className="w-full px-6 mt-6 mb-4 xs:mt-5 xs:mb-3">
        <ActionButton 
          text="NEXT"
          onClick={handleBlendClick}
          disabled={isBlending}
          isLoading={isBlending}
          isTouchActive={isTouchActive}
          onTouchStart={handleButtonTouchStart}
          onTouchEnd={handleButtonTouchEnd}
          variant="enhanced"
        />
      </div>

      {/* Scroll Indicator - Updated to show swipe gesture hint */}
      <ScrollHint 
        onClick={toggleGallery}
        onTouchStart={handleMainTouchStart}
        onTouchMove={handleMainTouchMove}
        onTouchEnd={handleMainTouchEnd}
      />

      {/* Gallery Section - Full screen in both states, with header visibility toggling on scroll */}
      <MemeGallery 
        showGallery={showGallery}
        galleryPosition={galleryPosition}
        scrollY={scrollY}
        scrollThreshold={scrollThreshold}
        dragConstraints={dragConstraints}
        isDraggingGallery={isDraggingGallery}
        onScroll={handleGalleryScroll}
        onDragStart={() => setIsDraggingGallery(true)}
        onDragEnd={handleGalleryDragEnd}
        onTouchStart={handleGalleryTouchStart}
        onTouchMove={handleGalleryTouchMove}
        onTouchEnd={handleGalleryTouchEnd}
        onToggleGallery={toggleGallery}
      />

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