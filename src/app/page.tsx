'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AppLayout } from '@/components/layout'
import { Button, Input, Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui'
import { HiOutlineDocumentText, HiOutlineLink, HiOutlineCheckCircle, HiArrowRight, HiOutlineCloudUpload, HiOutlineQuestionMarkCircle, HiX } from 'react-icons/hi'

type InputMode = 'url' | 'text'

export default function Home() {
  const [inputMode, setInputMode] = useState<InputMode>('text')
  const [jobUrl, setJobUrl] = useState('')
  const [jobDescription, setJobDescription] = useState('')
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const router = useRouter()

  const isValidUrl = (url: string) => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  const validateAndSetFile = (file: File) => {
    if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      setResumeFile(file)
    } else {
      alert('Please upload a DOCX file')
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      validateAndSetFile(file)
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

  const handleGenerate = async () => {
    // Validation
    if (inputMode === 'url') {
      if (!jobUrl.trim() || !isValidUrl(jobUrl)) {
        alert('Please enter a valid job URL')
        return
      }
    } else {
      if (!jobDescription.trim() || jobDescription.trim().length < 50) {
        alert('Please enter a job description (minimum 50 characters)')
        return
      }
    }

    if (!resumeFile) {
      alert('Please upload your resume')
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
      
      // Store job information
      if (inputMode === 'url') {
        localStorage.setItem('tempJobUrl', jobUrl)
        localStorage.removeItem('tempScrapedContent')
      } else {
        localStorage.setItem('tempScrapedContent', jobDescription)
        localStorage.removeItem('tempJobUrl')
      }
      
      // Navigate to parsing page
      const params = new URLSearchParams({
        resumeFileName: resumeFile.name
      })
      
      if (inputMode === 'url') {
        params.set('jobUrl', jobUrl)
      }
      
      router.push(`/parsing?${params.toString()}`)
    } catch (error) {
      console.error('Error:', error)
      alert('Failed to process data. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const removeFile = () => {
    setResumeFile(null)
  }

  return (
    <AppLayout>
      {/* Main Section with same background */}
      <section className="relative overflow-hidden bg-gradient-to-br from-white via-neutral-50 to-primary-50 min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="absolute inset-0 opacity-40" style={{
          backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fillRule=\"evenodd\"%3E%3Cg fill=\"%239C92AC\" fillOpacity=\"0.05\"%3E%3Ccircle cx=\"30\" cy=\"30\" r=\"2\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')"
        }} />
        
        <div className="relative container mx-auto px-4 py-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-5 gap-8 lg:gap-12 items-start">
              {/* Left Column - Header */}
              <div className="lg:col-span-2 lg:sticky lg:top-20">
                <div className="text-left lg:text-left text-center">
                  <h1 className="text-2xl lg:text-4xl font-bold text-neutral-900 mb-4 leading-tight">
                    Create Your Cover Letter
                  </h1>
                  <p className="text-lg lg:text-xl text-neutral-600 leading-relaxed">
                    Generate a professional cover letter in seconds with AI
                  </p>
                  
                  {/* Trust Indicators - moved here */}
                  <div className="flex flex-wrap justify-center lg:justify-start items-center gap-6 text-neutral-500 text-sm mt-8 lg:mt-12">
                    <div className="flex items-center">
                      <HiOutlineCheckCircle className="w-5 h-5 text-success-500 mr-2" />
                      Free to Use
                    </div>
                    <div className="flex items-center">
                      <HiOutlineCheckCircle className="w-5 h-5 text-success-500 mr-2" />
                      No Registration Required
                    </div>
                    <div className="flex items-center">
                      <HiOutlineCheckCircle className="w-5 h-5 text-success-500 mr-2" />
                      Powered by Google Gemini 2.5 Pro
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Form */}
              <div className="lg:col-span-3">
                <Card>
              
              <CardContent className="space-y-6 pt-6">
                {/* Job Information Section */}
                <div className="space-y-4 relative">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-semibold text-neutral-900">Job Information</h3>
                    
                    {/* Help Tooltip - Aligned with Job Information */}
                    <div className="relative group">
                      <HiOutlineQuestionMarkCircle className="w-5 h-5 text-neutral-400 hover:text-neutral-600 cursor-help" />
                      
                      {/* Tooltip */}
                      <div className="absolute top-full right-0 mt-2 px-4 py-3 bg-neutral-800 text-white text-sm rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none w-80 text-left z-50">
                        We&apos;ll analyze your job details and resume to create a personalized cover letter that highlights your relevant experience and skills.
                        <div className="absolute bottom-full right-2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-neutral-800"></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Input Mode Toggle */}
                  <div className="flex items-center justify-center bg-neutral-100 p-1 rounded-xl">
                    <button
                      onClick={() => setInputMode('text')}
                      className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                        inputMode === 'text'
                          ? 'bg-white text-neutral-900 shadow-sm'
                          : 'text-neutral-600 hover:text-neutral-900'
                      }`}
                    >
                      <HiOutlineDocumentText className="w-4 h-4 mr-2 inline" />
                      Job Description
                    </button>
                    <button
                      onClick={() => setInputMode('url')}
                      className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                        inputMode === 'url'
                          ? 'bg-white text-neutral-900 shadow-sm'
                          : 'text-neutral-600 hover:text-neutral-900'
                      }`}
                    >
                      <HiOutlineLink className="w-4 h-4 mr-2 inline" />
                      Job URL
                    </button>
                  </div>

                  {/* Job Input */}
                  {inputMode === 'text' ? (
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Job Description
                      </label>
                      <textarea
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                        placeholder="Paste the complete job description here, including:
- Job title and company name
- Job responsibilities and duties
- Required qualifications and skills
- Preferred experience"
                        className="w-full h-28 p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none text-sm"
                        rows={5}
                      />
                      <p className="text-xs text-neutral-500 mt-2">
                        {jobDescription.length} characters • Minimum 50 characters recommended
                      </p>
                    </div>
                  ) : (
                    <div>
                      <Input
                        type="url"
                        value={jobUrl}
                        onChange={(e) => setJobUrl(e.target.value)}
                        placeholder="https://example.com/job-posting"
                        label="Job URL"
                        helperText="Paste the full URL of the job listing you want to apply for"
                      />
                    </div>
                  )}
                </div>

                {/* Resume Upload Section */}
                <div className="space-y-4">
                  <h3 className="text-base font-semibold text-neutral-900">Resume Upload</h3>
                  
                  <div 
                    className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
                      dragActive 
                        ? 'border-primary-500 bg-primary-50' 
                        : 'border-neutral-300 hover:border-neutral-400'
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
                      <div className="space-y-2">
                        <div className="text-success-600">
                          <HiOutlineCheckCircle className="w-10 h-10 mx-auto mb-2" />
                        </div>
                        <div>
                          <p className="font-medium text-neutral-900 mb-1 text-sm">
                            {resumeFile.name}
                          </p>
                          <p className="text-xs text-neutral-500 mb-2">
                            {(resumeFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                          <button
                            onClick={removeFile}
                            className="text-error-600 hover:text-error-700 text-xs font-medium cursor-pointer"
                          >
                            Remove file
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="text-neutral-400">
                          <HiOutlineCloudUpload className="w-10 h-10 mx-auto mb-2" />
                        </div>
                        <div>
                          <label 
                            htmlFor="resume" 
                            className="cursor-pointer"
                          >
                            <span className="font-medium text-neutral-900 text-sm">
                              Drag and drop your resume here
                            </span>
                            <br />
                            <span className="text-neutral-500 text-xs">
                              or{' '}
                              <span className="text-primary-600 hover:text-primary-700 font-medium">
                                click to browse
                              </span>
                            </span>
                          </label>
                        </div>
                        <div className="text-xs text-neutral-400">
                          DOCX format only • Max 10MB
                        </div>
                      </div>
                    )}
                  </div>
                </div>

              </CardContent>

              <CardFooter className="flex justify-center pt-4">
                <Button
                  onClick={handleGenerate}
                  disabled={
                    isLoading || 
                    !resumeFile ||
                    (inputMode === 'url' && (!jobUrl.trim() || !isValidUrl(jobUrl))) ||
                    (inputMode === 'text' && (!jobDescription.trim() || jobDescription.trim().length < 50))
                  }
                  loading={isLoading}
                  size="lg"
                  className="px-8 py-3"
                >
                  {isLoading ? 'Processing...' : 'Generate Cover Letter'}
                  <HiArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardFooter>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>
    </AppLayout>
  )
}