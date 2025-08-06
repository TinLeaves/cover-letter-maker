'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function ResultPage() {
  const [coverLetter, setCoverLetter] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [editedLetter, setEditedLetter] = useState('')
  const router = useRouter()

  useEffect(() => {
    const storedLetter = localStorage.getItem('coverLetter')
    if (storedLetter) {
      setCoverLetter(storedLetter)
      setEditedLetter(storedLetter)
    } else {
      router.push('/generate')
    }
  }, [router])

  const handleSaveEdit = () => {
    setCoverLetter(editedLetter)
    localStorage.setItem('coverLetter', editedLetter)
    setIsEditing(false)
  }

  const handleCancelEdit = () => {
    setEditedLetter(coverLetter)
    setIsEditing(false)
  }

  const handleDownload = () => {
    const element = document.createElement('a')
    const file = new Blob([coverLetter], { type: 'text/plain' })
    element.href = URL.createObjectURL(file)
    element.download = 'cover-letter.txt'
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(coverLetter)
    alert('Cover letter copied to clipboard!')
  }

  const handleRegenerate = () => {
    router.push('/generate')
  }

  if (!coverLetter) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading your cover letter...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Your Cover Letter
          </h1>
          <p className="text-gray-600">
            Review your personalized cover letter below
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">Cover Letter</h2>
            <div className="flex space-x-2">
              {!isEditing ? (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={handleCopy}
                    className="px-3 py-1 text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 rounded transition-colors"
                  >
                    Copy
                  </button>
                  <button
                    onClick={handleDownload}
                    className="px-3 py-1 text-sm bg-green-100 hover:bg-green-200 text-green-700 rounded transition-colors"
                  >
                    Download
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleSaveEdit}
                    className="px-3 py-1 text-sm bg-green-600 hover:bg-green-700 text-white rounded transition-colors"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="px-3 py-1 text-sm bg-gray-400 hover:bg-gray-500 text-white rounded transition-colors"
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="p-6">
            {isEditing ? (
              <textarea
                value={editedLetter}
                onChange={(e) => setEditedLetter(e.target.value)}
                className="w-full h-96 p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                style={{ fontFamily: 'monospace' }}
              />
            ) : (
              <div 
                className="prose max-w-none text-gray-800 leading-relaxed"
                style={{ whiteSpace: 'pre-wrap' }}
              >
                {coverLetter}
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 flex justify-center space-x-4">
          <button
            onClick={handleRegenerate}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200"
          >
            Generate New Letter
          </button>
          <Link 
            href="/" 
            className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-colors duration-200"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}