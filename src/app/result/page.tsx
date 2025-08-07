'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { AppLayout } from '@/components/layout'
import { Button } from '@/components/ui'
import { HiOutlineClipboard, HiOutlineDownload, HiOutlinePencil, HiOutlineCheck, HiOutlineX } from 'react-icons/hi'

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
      router.push('/')
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
    router.push('/')
  }

  if (!coverLetter) {
    return (
      <AppLayout>
        <section className="relative overflow-hidden bg-gradient-to-br from-white via-neutral-50 to-primary-50 min-h-[calc(100vh-4rem)] flex items-center justify-center">
          <div className="relative container mx-auto px-4 py-16">
            <div className="max-w-2xl mx-auto text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <p>Loading your cover letter...</p>
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
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-neutral-900 mb-4">
                Your Cover Letter
              </h1>
              <p className="text-neutral-600">
                Review your personalized cover letter below
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-soft border border-neutral-200 overflow-hidden">
              <div className="border-b border-neutral-200 px-6 py-4 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-neutral-900">Cover Letter</h2>
                <div className="flex space-x-2">
              {!isEditing ? (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="inline-flex items-center px-3 py-1.5 text-sm bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg transition-colors"
                  >
                    <HiOutlinePencil className="w-4 h-4 mr-1" />
                    Edit
                  </button>
                  <button
                    onClick={handleCopy}
                    className="inline-flex items-center px-3 py-1.5 text-sm bg-primary-100 hover:bg-primary-200 text-primary-700 rounded-lg transition-colors"
                  >
                    <HiOutlineClipboard className="w-4 h-4 mr-1" />
                    Copy
                  </button>
                  <button
                    onClick={handleDownload}
                    className="inline-flex items-center px-3 py-1.5 text-sm bg-success-100 hover:bg-success-200 text-success-700 rounded-lg transition-colors"
                  >
                    <HiOutlineDownload className="w-4 h-4 mr-1" />
                    Download
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleSaveEdit}
                    className="inline-flex items-center px-3 py-1.5 text-sm bg-success-600 hover:bg-success-700 text-white rounded-lg transition-colors"
                  >
                    <HiOutlineCheck className="w-4 h-4 mr-1" />
                    Save
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="inline-flex items-center px-3 py-1.5 text-sm bg-neutral-400 hover:bg-neutral-500 text-white rounded-lg transition-colors"
                  >
                    <HiOutlineX className="w-4 h-4 mr-1" />
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
                className="w-full h-96 p-4 border border-neutral-300 rounded-xl resize-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                style={{ fontFamily: 'monospace' }}
              />
            ) : (
              <div 
                className="prose max-w-none text-neutral-800 leading-relaxed"
                style={{ whiteSpace: 'pre-wrap' }}
              >
                {coverLetter}
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <Button onClick={handleRegenerate} size="lg">
            Generate New Letter
          </Button>
        </div>
          </div>
        </div>
      </section>
    </AppLayout>
  )
}