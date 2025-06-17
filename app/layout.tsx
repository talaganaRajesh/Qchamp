import type { Metadata } from 'next'
import './globals.css'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Qchamp- Earn using your knowledge and skills',
  description: 'Win money by competing with your friends in maths and quiz.',
  generator: 'Talagana Rajesh',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
      <Footer/>
    </html>
  )
}
