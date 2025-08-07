import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Cover Letter Maker - AI-Powered Professional Cover Letters',
  description: 'Generate personalized, professional cover letters in seconds using advanced AI. Upload your resume, paste a job description, and get a tailored cover letter that highlights your relevant experience and skills.',
  keywords: 'cover letter, AI, resume, job application, professional, personalized',
  authors: [{ name: 'Cover Letter Maker' }],
  openGraph: {
    title: 'Cover Letter Maker - AI-Powered Professional Cover Letters',
    description: 'Generate personalized, professional cover letters in seconds using advanced AI.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cover Letter Maker - AI-Powered Professional Cover Letters',
    description: 'Generate personalized, professional cover letters in seconds using advanced AI.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="font-mono antialiased">
        {children}
      </body>
    </html>
  )
}