import type React from "react"
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

export const metadata = {
      generator: 'v0.dev'
    };
