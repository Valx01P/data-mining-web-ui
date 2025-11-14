import type { Metadata } from "next"
import Nav from "./components/Nav"
import "./globals.css"

export const metadata: Metadata = {
  title: "Grubmart",
  description: "An e-commerce marketplace",
}

export default function RootLayout(
  { children }:
  Readonly<{ children: React.ReactNode }>
) {
  return (
    <html lang="en">
      <body className="antialiased bg-[#111111] text-white px-8">
        <Nav/>
        {children}
      </body>
    </html>
  )
}
