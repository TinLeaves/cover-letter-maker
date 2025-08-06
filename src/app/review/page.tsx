'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface ParsedData {
  resumeText: string
  jobDescription: string
  jobUrl: string
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
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading parsed data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Review Parsed Information
          </h1>
          <p className="text-gray-600">
            Review the extracted information below and make any necessary edits before generating your cover letter
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Job Description Section */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-blue-50 px-6 py-4 border-b">
              <h2 className="text-lg font-semibold text-gray-900">Job Listing Information</h2>
              <p className="text-sm text-gray-600 mt-1">From: <a href={parsedData.jobUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{parsedData.jobUrl}</a></p>
            </div>
            <div className="p-6">
              <textarea
                value={editedJobDescription}
                onChange={(e) => setEditedJobDescription(e.target.value)}
                className="w-full h-80 p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                placeholder="Job description will appear here..."
              />
              <p className="text-xs text-gray-500 mt-2">
                {editedJobDescription.length} characters
              </p>
            </div>
          </div>

          {/* Resume Section */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-green-50 px-6 py-4 border-b">
              <h2 className="text-lg font-semibold text-gray-900">Resume Content</h2>
              <p className="text-sm text-gray-600 mt-1">From: {parsedData.resumeFileName}</p>
            </div>
            <div className="p-6">
              <textarea
                value={editedResumeText}
                onChange={(e) => setEditedResumeText(e.target.value)}
                className="w-full h-80 p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                placeholder="Resume content will appear here..."
              />
              <p className="text-xs text-gray-500 mt-2">
                {editedResumeText.length} characters
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-center space-x-4">
          <Link
            href="/generate"
            className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-colors duration-200"
          >
            ← Back to Form
          </Link>
          
          <button
            onClick={handleGenerateLetter}
            disabled={isLoading || !editedJobDescription.trim() || !editedResumeText.trim()}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors duration-200"
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Generating...
              </div>
            ) : (
              'Generate Cover Letter'
            )}
          </button>
        </div>

        {/* Info Box */}
        <div className="mt-8 bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-amber-800">Review and Edit</h3>
              <div className="mt-2 text-sm text-amber-700">
                <p>Please review the extracted information above. You can edit the text directly in the text areas if anything looks incorrect or incomplete before generating your cover letter.</p>
                {editedJobDescription.includes('Unable to access') && (
                  <p className="mt-2 font-medium text-red-700">
                    ⚠️ Job scraping was blocked. Please manually copy and paste the job description from the job listing page into the Job Listing box above.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}