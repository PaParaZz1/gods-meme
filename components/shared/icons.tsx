export function SentimentIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M6 8C6 8 6 12 6 14C6 16 8 18 12 18C16 18 18 16 18 14C18 12 18 8 18 8"
        stroke="black"
        strokeWidth="1"
        fill="none"
      />
      <path
        d="M8 6C8 6 8 8 8 9C8 10 9 10 10 10C11 10 12 10 12 9C12 8 12 6 12 6"
        stroke="black"
        strokeWidth="1"
        fill="none"
      />
    </svg>
  )
}

export function Character1Icon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="10" r="6" stroke="black" strokeWidth="1" fill="none" />
      <circle cx="10" cy="8" r="1" fill="black" />
      <circle cx="14" cy="8" r="1" fill="black" />
      <path d="M9 12C9 12 10 14 12 14C14 14 15 12 15 12" stroke="black" strokeWidth="1" fill="none" />
    </svg>
  )
}

export function Character2Icon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M6 10C6 7 8 6 12 6C16 6 18 7 18 10C18 13 16 14 12 14C8 14 6 13 6 10Z"
        stroke="black"
        strokeWidth="1"
        fill="none"
      />
      <path d="M8 8C8 8 10 10 12 10C14 10 16 8 16 8" stroke="black" strokeWidth="1" fill="none" />
      <rect x="9" y="12" width="6" height="1" fill="black" />
    </svg>
  )
}

export function GlassIcon() {
  return (
    <svg width="24" height="32" viewBox="0 0 24 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5 4H19V24C19 26 17 28 12 28C7 28 5 26 5 24V4Z" stroke="black" strokeWidth="1" fill="none" />
      <rect x="5" y="10" width="14" height="14" fill="#666666" />
    </svg>
  )
}

export function DuckCharacter() {
  return (
    <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Head */}
      <ellipse cx="100" cy="80" rx="30" ry="30" stroke="black" strokeWidth="1" fill="none" />
      <circle cx="90" cy="70" r="3" fill="black" /> {/* Left eye */}
      <circle cx="110" cy="70" r="3" fill="black" /> {/* Right eye */}
      <path d="M90 95 Q100 90 110 95" stroke="black" strokeWidth="1" fill="none" /> {/* Frown */}
      {/* Hair */}
      <path d="M70 70 Q65 60 70 50 Q75 45 80 50 Q85 55 85 60" stroke="black" strokeWidth="1" fill="none" />
      <path d="M130 70 Q135 60 130 50 Q125 45 120 50 Q115 55 115 60" stroke="black" strokeWidth="1" fill="none" />
      {/* Body */}
      <path
        d="M80 110 Q70 130 80 150 Q90 170 100 170 Q110 170 120 150 Q130 130 120 110"
        stroke="black"
        strokeWidth="1"
        fill="none"
      />
      {/* Bowl */}
      <path d="M50 170 Q100 200 150 170" stroke="black" strokeWidth="1" fill="none" />
    </svg>
  )
}
