import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'

const inter = Inter({ subsets: ['latin'], display: 'swap' })

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#0284c7',
}

export const metadata: Metadata = {
  metadataBase: new URL('https://studenttools.cyou'),
  title: {
    default: 'StudentTools — Free Calculators for Students, Exams, Careers & Finance',
    template: '%s | StudentTools',
  },
  description:
    'Fast, accurate, mobile-first calculators and educational utilities for Indian students, competitive exam aspirants, and working professionals. 100% free with instant client-side calculation.',
  keywords: [
    'student tools',
    'jee percentile calculator',
    'cgpa to percentage',
    'attendance calculator',
    'ctc to in hand calculator',
    'emi calculator',
    'sip calculator',
    'gst calculator india',
    'free calculators india',
  ],
  authors: [{ name: 'StudentTools Engineering Team' }],
  creator: 'StudentTools',
  publisher: 'StudentTools',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://studenttools.cyou',
    siteName: 'StudentTools',
    title: 'StudentTools — Fast, Free Calculators for Students & Professionals',
    description:
      'Free educational utilities, JEE marks to percentile, CGPA conversion, attendance tracking, Indian salary take-home breakdown, and everyday calculators.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'StudentTools — Free Calculators for Students & Professionals',
    description:
      'Fast, mobile-first educational and everyday utility tools for Indian students and professionals.',
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GSC_VERIFICATION || undefined,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full antialiased scroll-smooth">
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1405060407756207"
          crossOrigin="anonymous"
        />
      </head>
      <body className={`${inter.className} min-h-screen flex flex-col bg-white text-slate-900`}>
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
