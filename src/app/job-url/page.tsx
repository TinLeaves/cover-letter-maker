'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function JobUrlPage() {
  const [jobUrl, setJobUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [scrapeStatus, setScrapeStatus] = useState<'idle' | 'scraping' | 'success' | 'error'>('idle')
  const [scrapedContent, setScrapedContent] = useState('')
  const [scrapeError, setScrapeError] = useState('')
  const router = useRouter()

  const isValidUrl = (url: string) => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  const handleContinue = () => {
    if (!jobUrl.trim()) {
      alert('Please enter a job listing URL')
      return
    }

    if (!isValidUrl(jobUrl)) {
      alert('Please enter a valid URL')
      return
    }

    setIsLoading(true)

    try {
      // Store job URL and scraped content in localStorage
      localStorage.setItem('tempJobUrl', jobUrl)
      
      // Store scraped content if available
      if (scrapedContent) {
        localStorage.setItem('tempScrapedContent', scrapedContent)
      }
      
      // Navigate to resume upload page
      router.push('/upload-resume')
    } catch (error) {
      console.error('Error:', error)
      alert('Failed to process URL. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText()
      if (text && isValidUrl(text)) {
        setJobUrl(text)
        // Trigger scraping after pasting
        await scrapeJobUrl(text)
      } else {
        alert('No valid URL found in clipboard')
      }
    } catch (error) {
      console.error('Error reading clipboard:', error)
      alert('Unable to access clipboard. Please paste manually.')
    }
  }

  const scrapeJobUrl = async (url: string) => {
    setScrapeStatus('scraping')
    setScrapeError('')
    setScrapedContent('')

    try {
      const response = await fetch('/api/scrape-job', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ jobUrl: url }),
      })

      if (response.ok) {
        const data = await response.json()
        setScrapedContent(data.jobDescription)
        setScrapeStatus('success')
      } else {
        const errorData = await response.json()
        setScrapeError(errorData.error || 'Failed to scrape job listing')
        setScrapeStatus('error')
      }
    } catch (error) {
      console.error('Error scraping job:', error)
      setScrapeError('Failed to scrape job listing. Please check your connection and try again.')
      setScrapeStatus('error')
    }
  }

  // Auto-scrape when URL changes and is valid
  useEffect(() => {
    if (jobUrl && isValidUrl(jobUrl) && scrapeStatus === 'idle') {
      const timeoutId = setTimeout(() => {
        scrapeJobUrl(jobUrl)
      }, 1000) // Delay to avoid scraping while user is typing

      return () => clearTimeout(timeoutId)
    }
  }, [jobUrl, scrapeStatus])

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto">
        {/* Progress Indicator */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-semibold">
                1
              </div>
              <span className="ml-2 text-sm font-medium text-blue-600">Job URL</span>
            </div>
            <div className="w-12 h-px bg-gray-300"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center text-sm font-semibold">
                2
              </div>
              <span className="ml-2 text-sm text-gray-500">Upload Resume</span>
            </div>
            <div className="w-12 h-px bg-gray-300"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center text-sm font-semibold">
                3
              </div>
              <span className="ml-2 text-sm text-gray-500">Process</span>
            </div>
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Enter Job Listing URL
          </h1>
          <p className="text-gray-600">
            Paste the URL of the job you want to apply for so we can extract the job requirements
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-6">
            <label htmlFor="jobUrl" className="block text-sm font-medium text-gray-700 mb-2">
              Job Listing URL
            </label>
            <div className="relative">
              <input
                type="url"
                id="jobUrl"
                value={jobUrl}
                onChange={(e) => setJobUrl(e.target.value)}
                placeholder="https://example.com/job-posting"
                className="w-full px-4 py-3 pr-20 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
              <button
                onClick={handlePaste}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs rounded transition-colors"
              >
                Paste
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Supported sites: LinkedIn, Indeed, Glassdoor, company career pages, and more
            </p>
          </div>

          {/* URL Examples */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Examples of supported URLs:</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>https://www.linkedin.com/jobs/view/...</span>
              </div>
              <div className="flex items-start">
                <span className="text-green-500 mr-2">•</span>
                <span>https://indeed.com/viewjob?jk=...</span>
              </div>
              <div className="flex items-start">
                <span className="text-purple-500 mr-2">•</span>
                <span>https://company.com/careers/job-title</span>
              </div>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-amber-800">What we extract</h3>
                <div className="mt-2 text-sm text-amber-700">
                  <p>We&apos;ll automatically extract the job title, requirements, responsibilities, and company information from the job listing to create a targeted cover letter.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Scrape Preview */}
          {jobUrl && isValidUrl(jobUrl) && (
            <div className="mb-6">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-gray-700">Job Listing Preview</h3>
                  {scrapeStatus === 'scraping' && (
                    <div className="flex items-center text-blue-600">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                      <span className="text-xs">Scraping...</span>
                    </div>
                  )}
                  {scrapeStatus === 'success' && (
                    <span className="text-green-600 text-xs flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Scraped successfully
                    </span>
                  )}
                  {scrapeStatus === 'error' && (
                    <span className="text-red-600 text-xs flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Failed to scrape
                    </span>
                  )}
                </div>
                
                {scrapeStatus === 'success' && scrapedContent && (
                  <div className="bg-white border border-gray-200 rounded p-3 max-h-40 overflow-y-auto">
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{scrapedContent.slice(0, 500)}{scrapedContent.length > 500 ? '...' : ''}</p>
                  </div>
                )}
                
                {scrapeStatus === 'error' && (
                  <div className="bg-red-50 border border-red-200 rounded p-3">
                    <p className="text-sm text-red-700">{scrapeError}</p>
                    <button
                      onClick={() => scrapeJobUrl(jobUrl)}
                      className="mt-2 px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 text-xs rounded transition-colors"
                    >
                      Try Again
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="flex justify-between">
            <Link
              href="/"
              className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-colors duration-200"
            >
              ← Back to Home
            </Link>

            <button
              onClick={handleContinue}
              disabled={isLoading || !jobUrl.trim() || !isValidUrl(jobUrl) || scrapeStatus === 'scraping'}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors duration-200"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Processing...
                </div>
              ) : (
                'Continue to Resume Upload'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}