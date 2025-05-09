import type { Metadata } from "next"
import { Inika, Phudu, Lexend } from "next/font/google"
import "./globals.css"

const inika = Inika({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-inika",
})

const phudu = Phudu({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-phudu",
})

const lexend = Lexend({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-lexend",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inika.variable} ${phudu.variable}`}>{children}</body>
    </html>
  )
}

export const metadata: Metadata = {
  title: "God's Meme",
  description: "A meme generator that delivers memes so perfect, you'll question free will itself.",
}

