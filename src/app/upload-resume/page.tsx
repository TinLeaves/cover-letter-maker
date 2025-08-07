'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function UploadResumePage() {
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const router = useRouter()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      validateAndSetFile(file)
    }
  }

  const validateAndSetFile = (file: File) => {
    if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      setResumeFile(file)
    } else {
      alert('Please upload a DOCX file (PDF support coming soon)')
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0])
    }
  }

  const handleContinue = async () => {
    if (!resumeFile) {
      alert('Please upload your resume first')
      return
    }

    // Check if we have job information from the previous step
    const jobUrl = localStorage.getItem('tempJobUrl')
    const jobDescription = localStorage.getItem('tempScrapedContent')
    
    if (!jobUrl && !jobDescription) {
      alert('Job information not found. Please go back and enter the job details.')
      router.push('/job-url')
      return
    }

    setIsLoading(true)

    try {
      // Store resume file temporarily in localStorage
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
        resumeFileName: resumeFile.name
      })
      
      // Add jobUrl only if it exists (when using URL mode)
      if (jobUrl) {
        params.set('jobUrl', jobUrl)
      }
      
      router.push(`/parsing?${params.toString()}`)
    } catch (error) {
      console.error('Error:', error)
      alert('Failed to process resume. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const removeFile = () => {
    setResumeFile(null)
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto">
        {/* Progress Indicator */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center text-sm font-semibold">
                ✓
              </div>
              <span className="ml-2 text-sm font-medium text-green-600">Job URL</span>
            </div>
            <div className="w-12 h-px bg-green-300"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-semibold">
                2
              </div>
              <span className="ml-2 text-sm font-medium text-blue-600">Upload Resume</span>
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
            Upload Your Resume
          </h1>
          <p className="text-gray-600">
            Upload your resume so we can extract your experience and skills for the cover letter
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Resume File (DOCX format)
            </label>
            
            <div 
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                type="file"
                id="resume"
                onChange={handleFileChange}
                accept=".docx"
                className="hidden"
              />
              
              {resumeFile ? (
                <div className="space-y-4">
                  <div className="text-green-600">
                    <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-lg font-medium text-gray-900 mb-2">
                      {resumeFile.name}
                    </p>
                    <p className="text-sm text-gray-500 mb-4">
                      {(resumeFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                    <button
                      onClick={removeFile}
                      className="text-red-600 hover:text-red-700 text-sm font-medium"
                    >
                      Remove file
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="text-gray-400">
                    <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  <div>
                    <label 
                      htmlFor="resume" 
                      className="cursor-pointer"
                    >
                      <span className="text-lg font-medium text-gray-900">
                        Drag and drop your resume here
                      </span>
                      <br />
                      <span className="text-gray-500">
                        or{' '}
                        <span className="text-blue-600 hover:text-blue-700 font-medium">
                          click to browse
                        </span>
                      </span>
                    </label>
                  </div>
                  <div className="text-xs text-gray-400">
                    DOCX format only • Max 10MB
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">Why we need your resume</h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p>We&apos;ll extract your work experience, skills, and achievements to create a personalized cover letter that highlights your relevant qualifications for the job.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between">
            <Link
              href="/job-url"
              className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-colors duration-200"
            >
              ← Back to Job URL
            </Link>

            <button
              onClick={handleContinue}
              disabled={isLoading || !resumeFile}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors duration-200"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Processing...
                </div>
              ) : (
                'Start Processing'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}