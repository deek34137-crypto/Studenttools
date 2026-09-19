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
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://studenttools.cyou'),
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
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'StudentTools — Free Calculators for Indian Students & Professionals',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'StudentTools — Free Calculators for Students & Professionals',
    description:
      'Fast, mobile-first educational and everyday utility tools for Indian students and professionals.',
    images: ['/og-image.png'],
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GSC_VERIFICATION || undefined,
  },
  other: {
    ...(process.env.NEXT_PUBLIC_ADSENSE_ENABLED === 'true' &&
    process.env.NEXT_PUBLIC_ADSENSE_CLIENT &&
    /^(ca-)?pub-\d+$/.test(process.env.NEXT_PUBLIC_ADSENSE_CLIENT.trim())
      ? {
          'google-adsense-account': process.env.NEXT_PUBLIC_ADSENSE_CLIENT.trim().startsWith('ca-')
            ? process.env.NEXT_PUBLIC_ADSENSE_CLIENT.trim()
            : `ca-${process.env.NEXT_PUBLIC_ADSENSE_CLIENT.trim()}`,
        }
      : {}),
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const adsenseEnabled = process.env.NEXT_PUBLIC_ADSENSE_ENABLED === 'true'
  const rawClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT?.trim()
  const adsenseClient =
    rawClient && rawClient.startsWith('pub-') ? `ca-${rawClient}` : rawClient
  const shouldLoadAdsense =
    adsenseEnabled && Boolean(adsenseClient && /^ca-pub-\d+$/.test(adsenseClient))

  return (
    <html lang="en" className="h-full antialiased scroll-smooth">
      <head>
        {shouldLoadAdsense && (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClient}`}
            crossOrigin="anonymous"
          />
        )}
      </head>
      <body className={`${inter.className} min-h-screen flex flex-col bg-white text-slate-900`}>
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
