import type { Metadata } from 'next'
import Nav from './components/Nav'
import './globals.css'
import CartSidebar from './components/CartSidebar'

export const metadata: Metadata = {
  title: "Grubclub",
  description: "An e-commerce marketplace",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#111111] text-white px-8 antialiased">
        <Nav />
        <CartSidebar />
        {children}
      </body>
    </html>
  )
}
