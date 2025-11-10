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
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/site.webmanifest',
  themeColor: '#333333',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
}

