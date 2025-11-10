"use client"

interface InputWithDecorationProps {
  value?: string
  placeholder?: string
  onChange?: (value: string) => void
  onFocus?: () => void
  onBlur?: () => void
  isFocused?: boolean
  readOnly?: boolean
  className?: string
}

export default function InputWithDecoration({
  value = "",
  placeholder = "",
  onChange,
  onFocus,
  onBlur,
  isFocused = false,
  readOnly = false,
  className = ""
}: InputWithDecorationProps) {
  return (
    <div className={`w-full relative ${className}`}>
      <div className="relative px-8">
        {readOnly ? (
          <div className="bg-[#333333] text-white px-6 py-3 rounded-full text-center font-lexend text-lg">
            {value || placeholder}
          </div>
        ) : (
          <input
            type="text"
            placeholder={placeholder}
            className={`w-full px-6 py-3 rounded-full border-2 border-[#333333] text-left font-lexend transition-colors duration-300 focus:outline-none ${
              isFocused 
                ? "bg-[#333333] text-white placeholder-white/70 text-lg" 
                : "bg-white text-[#333333] placeholder-[#666666]"
            }`}
            style={{ textAlign: 'left' }}
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            onFocus={onFocus}
            onBlur={onBlur}
          />
        )}
      </div>
      
      {/* Left curved line */}
      <div className="absolute left-0 top-1/4 -translate-y-1/2 pointer-events-none">
        <svg width="32" height="20" viewBox="0 0 32 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 5 Q10 15, 32 20" stroke="#333333" strokeWidth="2" />
        </svg>
      </div>
      
      {/* Right curved line */}
      <div className="absolute right-0 top-1/4 -translate-y-1/2 pointer-events-none">
        <svg width="32" height="20" viewBox="0 0 32 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M32 5 Q22 15, 0 20" stroke="#333333" strokeWidth="2" />
        </svg>
      </div>
    </div>
  )
}

