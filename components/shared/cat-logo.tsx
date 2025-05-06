export default function CatLogo({ size = "normal" }: { size?: "small" | "normal" | "large" }) {
  const dimensions = {
    small: { width: 40, height: 40 },
    normal: { width: 60, height: 60 },
    large: { width: 120, height: 140 },
  }[size]

  return (
    <svg
      width={dimensions.width}
      height={dimensions.height}
      viewBox="0 0 120 140"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Halo */}
      {size === "large" && (
        <ellipse cx="60" cy="10" rx="58" ry="8" stroke="white" strokeWidth="2" strokeDasharray="4 2" />
      )}
      {size === "normal" && (
        <ellipse cx="60" cy="10" rx="30" ry="5" stroke="white" strokeWidth="2" strokeDasharray="4 2" />
      )}
      {size === "small" && (
        <ellipse cx="20" cy="5" rx="12" ry="2" stroke="white" strokeWidth="1" strokeDasharray="2 1" />
      )}
      {/* Cat body */}
      <path d="M60 20 L40 40 L40 90 L80 90 L80 40 L60 20" fill="white" stroke="white" strokeWidth="2" />
      {/* Cat ears */}
      <path d="M40 40 L30 25 L40 40" fill="white" stroke="white" strokeWidth="2" />
      <path d="M80 40 L90 25 L80 40" fill="white" stroke="white" strokeWidth="2" />
      {/* Cat face */}
      <circle cx="50" cy="55" r="4" fill="black" /> {/* Left eye */}
      <circle cx="70" cy="55" r="4" fill="black" /> {/* Right eye */}
      <path d="M50 70 Q60 75 70 70" stroke="black" strokeWidth="2" fill="none" /> {/* Mouth */}
      {/* Cat X mark */}
      <path d="M60 80 L60 80" stroke="black" strokeWidth="2">
        <animate
          attributeName="d"
          values="M60 80 L60 80;M58 78 L62 82;M60 80 L60 80"
          dur="5s"
          repeatCount="indefinite"
        />
      </path>
      <path d="M60 80 L60 80" stroke="black" strokeWidth="2">
        <animate
          attributeName="d"
          values="M60 80 L60 80;M58 82 L62 78;M60 80 L60 80"
          dur="5s"
          repeatCount="indefinite"
        />
      </path>
      {/* Cat tail */}
      <path d="M60 90 Q60 110 60 120" stroke="white" strokeWidth="6" fill="none" />
      {/* Cat wings */}
      <path d="M40 70 Q30 65 25 75 Q20 85 30 80" stroke="white" strokeWidth="2" fill="none" />
      <path d="M80 70 Q90 65 95 75 Q100 85 90 80" stroke="white" strokeWidth="2" fill="none" />
    </svg>
  )
}
