import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'EcoQuiz — AI Test Platformasi',
  description: "Faylingizdan AI avtomatik test tuzadi va tahlil qiladi. O'zbek tili uchun maxsus yaratilgan premium quiz platformasi.",
  keywords: 'quiz, test, ai, iqtisod, english, o\'zbek',
  openGraph: {
    title: 'EcoQuiz — AI Test Platformasi',
    description: 'Faylingizdan AI avtomatik test tuzadi',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="uz" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
