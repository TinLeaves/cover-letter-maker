'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function GeneratePage() {
  const [jobUrl, setJobUrl] = useState('')
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      setResumeFile(file)
    } else {
      alert('Please upload a DOCX file (PDF support coming soon)')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!jobUrl || !resumeFile) {
      alert('Please provide both job URL and resume file')
      return
    }

    setIsLoading(true)

    try {
      // Store resume file temporarily in localStorage as base64
      const arrayBuffer = await resumeFile.arrayBuffer()
      const uint8Array = new Uint8Array(arrayBuffer)
      const fileData = {
        data: Array.from(uint8Array),
        type: resumeFile.type,
        name: resumeFile.name
      }
      
      localStorage.setItem('tempResumeFile', JSON.stringify(fileData))
      
      // Navigate to parsing page with parameters
      const params = new URLSearchParams({
        jobUrl: jobUrl,
        resumeFileName: resumeFile.name
      })
      
      router.push(`/parsing?${params.toString()}`)
    } catch (error) {
      console.error('Error:', error)
      alert('Failed to prepare data. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Generate Your Cover Letter
          </h1>
          <p className="text-gray-600">
            Fill out the form below to create your personalized cover letter
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="jobUrl" className="block text-sm font-medium text-gray-700 mb-2">
                Job Listing URL
              </label>
              <input
                type="url"
                id="jobUrl"
                value={jobUrl}
                onChange={(e) => setJobUrl(e.target.value)}
                placeholder="https://example.com/job-posting"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                Paste the URL of the job you want to apply for (LinkedIn, Indeed, company website, etc.)
              </p>
            </div>

            <div>
              <label htmlFor="resume" className="block text-sm font-medium text-gray-700 mb-2">
                Upload Resume
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                <input
                  type="file"
                  id="resume"
                  onChange={handleFileChange}
                  accept=".docx"
                  className="hidden"
                  required
                />
                <label 
                  htmlFor="resume" 
                  className="cursor-pointer flex flex-col items-center"
                >
                  <div className="text-gray-400 mb-2">
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  {resumeFile ? (
                    <div className="text-sm text-gray-600">
                      <span className="font-medium text-green-600">Selected: </span>
                      {resumeFile.name}
                    </div>
                  ) : (
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Click to upload</span> your resume
                      <div className="text-xs text-gray-400 mt-1">DOCX format (PDF coming soon)</div>
                    </div>
                  )}
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !jobUrl || !resumeFile}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Preparing Data...
                </div>
              ) : (
                'Start Processing'
              )}
            </button>
          </form>
        </div>

        <div className="text-center mt-8">
          <Link 
            href="/" 
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}