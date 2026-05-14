import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'LoL Intelligence Dashboard',
  description: 'Advanced analytics and insights for League of Legends',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
}