import type { Metadata } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import "../styles/globals.css"

const inter = Inter({ subsets: ["latin"] })
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
})

export const metadata: Metadata = {
  title: "MathCat - Purr-fect Your Math Skills!",
  description:
    "Interactive math learning for elementary students - multiplication, division, and more!",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={jetbrainsMono.variable}>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
