'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

interface ParseProgress {
  step: 'idle' | 'scraping' | 'parsing' | 'complete' | 'error'
  message: string
  progress: number
}

function ParsingContent() {
  const [progress, setProgress] = useState<ParseProgress>({
    step: 'idle',
    message: 'Preparing to parse data...',
    progress: 0
  })
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const jobUrl = searchParams.get('jobUrl')
    const resumeFileName = searchParams.get('resumeFileName')

    if (!jobUrl || !resumeFileName) {
      router.push('/generate')
      return
    }

    // Get the file from localStorage (we'll store it there temporarily)
    const storedFileData = localStorage.getItem('tempResumeFile')
    if (!storedFileData) {
      router.push('/generate')
      return
    }

    const parseData = async () => {
      try {
        // Step 1: Start parsing
        setProgress({
          step: 'scraping',
          message: 'Extracting information from job listing...',
          progress: 25
        })

        // Create FormData from stored file data
        const fileData = JSON.parse(storedFileData)
        const byteArray = new Uint8Array(fileData.data)
        const blob = new Blob([byteArray], { type: fileData.type })
        const file = new File([blob], fileData.name, { type: fileData.type })

        const formData = new FormData()
        formData.append('jobUrl', jobUrl)
        formData.append('resume', file)
        
        // Check for pre-scraped content
        const preScrapeContent = localStorage.getItem('tempScrapedContent')
        if (preScrapeContent) {
          formData.append('preScrapeContent', preScrapeContent)
          localStorage.removeItem('tempScrapedContent') // Clean up
        }

        // Simulate progress updates
        setTimeout(() => {
          setProgress({
            step: 'parsing',
            message: 'Parsing your resume...',
            progress: 75
          })
        }, 1000)

        const response = await fetch('/api/parse-data', {
          method: 'POST',
          body: formData,
        })

        if (!response.ok) {
          throw new Error('Failed to parse data')
        }

        const data = await response.json()

        // Step 3: Complete
        setProgress({
          step: 'complete',
          message: 'Parsing complete! Redirecting to review...',
          progress: 100
        })

        // Store parsed data and redirect
        localStorage.setItem('parsedData', JSON.stringify(data))
        localStorage.removeItem('tempResumeFile') // Clean up

        setTimeout(() => {
          router.push('/review')
        }, 1000)

      } catch (error) {
        console.error('Parsing error:', error)
        setProgress({
          step: 'error',
          message: 'Failed to parse data. Please try again.',
          progress: 0
        })
      }
    }

    // Start parsing after a short delay
    setTimeout(parseData, 500)
  }, [router, searchParams])

  const handleRetry = () => {
    router.push('/generate')
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Processing Your Data
          </h1>
          <p className="text-gray-600">
            We&apos;re extracting information from your job listing and resume
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          {/* Progress Steps */}
          <div className="flex justify-center space-x-4 mb-8">
            <div className={`flex flex-col items-center ${
              ['scraping', 'parsing', 'complete'].includes(progress.step) ? 'text-blue-600' : 'text-gray-400'
            }`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                ['scraping', 'parsing', 'complete'].includes(progress.step) 
                  ? 'border-blue-600 bg-blue-100' 
                  : 'border-gray-300'
              }`}>
                {progress.step === 'complete' ? '✓' : '1'}
              </div>
              <span className="text-sm mt-2">Job Listing</span>
            </div>
            
            <div className={`w-16 h-px border-t-2 mt-5 ${
              ['parsing', 'complete'].includes(progress.step) ? 'border-blue-600' : 'border-gray-300'
            }`}></div>
            
            <div className={`flex flex-col items-center ${
              ['parsing', 'complete'].includes(progress.step) ? 'text-blue-600' : 'text-gray-400'
            }`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                ['parsing', 'complete'].includes(progress.step) 
                  ? 'border-blue-600 bg-blue-100' 
                  : 'border-gray-300'
              }`}>
                {progress.step === 'complete' ? '✓' : '2'}
              </div>
              <span className="text-sm mt-2">Resume</span>
            </div>
            
            <div className={`w-16 h-px border-t-2 mt-5 ${
              progress.step === 'complete' ? 'border-blue-600' : 'border-gray-300'
            }`}></div>
            
            <div className={`flex flex-col items-center ${
              progress.step === 'complete' ? 'text-green-600' : 'text-gray-400'
            }`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                progress.step === 'complete' 
                  ? 'border-green-600 bg-green-100' 
                  : 'border-gray-300'
              }`}>
                {progress.step === 'complete' ? '✓' : '3'}
              </div>
              <span className="text-sm mt-2">Ready</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">{progress.message}</span>
              <span className="text-sm text-gray-600">{progress.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${progress.progress}%` }}
              ></div>
            </div>
          </div>

          {/* Loading Spinner or Error */}
          {progress.step === 'error' ? (
            <div className="text-center">
              <div className="text-red-600 mb-4">
                <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <button
                onClick={handleRetry}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : progress.step !== 'complete' ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="text-center">
              <div className="text-green-600 mb-4">
                <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-gray-600">Redirecting to review page...</p>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="text-sm text-gray-500">
          <p>This may take a few moments while we extract information from the web page and process your resume.</p>
        </div>
      </div>
    </div>
  )
}

export default function ParsingPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    }>
      <ParsingContent />
    </Suspense>
  )
}