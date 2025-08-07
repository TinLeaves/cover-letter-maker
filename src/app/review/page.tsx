'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { AppLayout } from '@/components/layout'
import { Button } from '@/components/ui'

interface ParsedData {
  resumeText: string
  jobDescription: string
  jobUrl?: string
  jobHtml?: string
  resumeFileName: string
}

export default function ReviewPage() {
  const [parsedData, setParsedData] = useState<ParsedData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [editedJobDescription, setEditedJobDescription] = useState('')
  const [editedResumeText, setEditedResumeText] = useState('')
  const router = useRouter()

  useEffect(() => {
    const storedData = localStorage.getItem('parsedData')
    if (storedData) {
      const data = JSON.parse(storedData)
      setParsedData(data)
      setEditedJobDescription(data.jobDescription)
      setEditedResumeText(data.resumeText)
    } else {
      router.push('/generate')
    }
  }, [router])

  const handleGenerateLetter = async () => {
    if (!parsedData) return

    setIsLoading(true)
    try {
      const response = await fetch('/api/generate-letter-from-text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobDescription: editedJobDescription,
          resumeText: editedResumeText,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        localStorage.setItem('coverLetter', data.coverLetter)
        router.push('/result')
      } else {
        throw new Error('Failed to generate cover letter')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Failed to generate cover letter. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (!parsedData) {
    return (
      <AppLayout>
        <section className="relative overflow-hidden bg-gradient-to-br from-white via-neutral-50 to-primary-50 min-h-[calc(100vh-4rem)] flex items-center justify-center">
          <div className="relative container mx-auto px-4 py-16">
            <div className="max-w-2xl mx-auto text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <p>Loading parsed data...</p>
            </div>
          </div>
        </section>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <section className="relative overflow-hidden bg-gradient-to-br from-white via-neutral-50 to-primary-50 min-h-[calc(100vh-4rem)]">
        <div className="absolute inset-0 opacity-40" style={{
          backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fillRule=\"evenodd\"%3E%3Cg fill=\"%239C92AC\" fillOpacity=\"0.05\"%3E%3Ccircle cx=\"30\" cy=\"30\" r=\"2\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')"
        }} />
        
        <div className="relative container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-neutral-900 mb-4">
                Review Parsed Information
              </h1>
              {editedJobDescription.includes('Unable to access') ? (
                <div className="px-4 py-3 bg-secondary-50 border border-secondary-200 rounded-xl">
                  <p className="text-secondary-800 font-medium">
                    ⚠️ Job scraping was blocked. Please manually copy and paste the job description from the job listing page into the Job Listing box below.
                  </p>
                </div>
              ) : (
                <p className="text-neutral-600">
                  Please review the extracted information below. You can edit the text directly in the text areas if anything looks incorrect or incomplete before generating your cover letter.
                </p>
              )}
            </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Job Description Section */}
          <div className="bg-white rounded-2xl shadow-soft border border-neutral-200 overflow-hidden">
            <div className="bg-primary-50 px-6 py-4 border-b border-neutral-200">
              <h2 className="text-lg font-semibold text-neutral-900">Job Listing Information</h2>
              {parsedData.jobUrl ? (
                <p className="text-sm text-neutral-600 mt-1">From: <a href={parsedData.jobUrl} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">{parsedData.jobUrl}</a></p>
              ) : (
                <p className="text-sm text-neutral-600 mt-1">From: Job description provided directly</p>
              )}
            </div>
            <div className="p-6">
              <textarea
                value={editedJobDescription}
                onChange={(e) => setEditedJobDescription(e.target.value)}
                className="w-full h-48 p-4 border border-neutral-300 rounded-xl resize-y focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm transition-all duration-200"
                placeholder="Job description will appear here..."
              />
              <p className="text-xs text-neutral-500 mt-2">
                {editedJobDescription.length} characters
              </p>
            </div>
          </div>

          {/* Resume Section */}
          <div className="bg-white rounded-2xl shadow-soft border border-neutral-200 overflow-hidden">
            <div className="bg-secondary-50 px-6 py-4 border-b border-neutral-200">
              <h2 className="text-lg font-semibold text-neutral-900">Resume Content</h2>
              <p className="text-sm text-neutral-600 mt-1">From: {parsedData.resumeFileName}</p>
            </div>
            <div className="p-6">
              <textarea
                value={editedResumeText}
                onChange={(e) => setEditedResumeText(e.target.value)}
                className="w-full h-48 p-4 border border-neutral-300 rounded-xl resize-y focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500 text-sm transition-all duration-200"
                placeholder="Resume content will appear here..."
              />
              <p className="text-xs text-neutral-500 mt-2">
                {editedResumeText.length} characters
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-center space-x-4">
          <Button variant="ghost" asChild>
            <Link href="/">
              ← Back to Form
            </Link>
          </Button>
          
          <Button
            onClick={handleGenerateLetter}
            disabled={isLoading || !editedJobDescription.trim() || !editedResumeText.trim()}
            loading={isLoading}
            size="lg"
          >
            {isLoading ? 'Generating...' : 'Generate Cover Letter'}
          </Button>
        </div>

      </div>
        </div>
      </section>
    </AppLayout>
  )
}