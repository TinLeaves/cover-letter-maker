'use client'

import { useState } from 'react'
import { Button } from '@/components/ui'

interface PreviewPanelProps {
  coverLetterContent?: string
  isLoading?: boolean
  onExport?: (format: 'pdf' | 'docx' | 'txt') => void
  className?: string
}

export function PreviewPanel({ 
  coverLetterContent, 
  isLoading = false,
  onExport,
  className = ""
}: PreviewPanelProps) {
  const [zoomLevel, setZoomLevel] = useState(100)
  const [exportFormat, setExportFormat] = useState<'pdf' | 'docx' | 'txt'>('pdf')

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 10, 200))
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 10, 50))
  const handleZoomReset = () => setZoomLevel(100)

  if (isLoading) {
    return (
      <div className={`bg-white border-l border-neutral-200 flex flex-col ${className}`}>
        <div className="flex items-center justify-between p-4 border-b border-neutral-200">
          <h2 className="text-lg font-semibold text-neutral-900">Cover Letter Preview</h2>
        </div>
        
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-neutral-600">Generating your cover letter...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!coverLetterContent) {
    return (
      <div className={`bg-white border-l border-neutral-200 flex flex-col ${className}`}>
        <div className="flex items-center justify-between p-4 border-b border-neutral-200">
          <h2 className="text-lg font-semibold text-neutral-900">Cover Letter Preview</h2>
        </div>
        
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center">
            <div className="w-24 h-24 bg-neutral-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-12 h-12 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-neutral-900 mb-2">Preview Ready</h3>
            <p className="text-neutral-600 max-w-sm">
              Complete the form to generate and preview your personalized cover letter
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-white border-l border-neutral-200 flex flex-col ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-neutral-200">
        <h2 className="text-lg font-semibold text-neutral-900">Cover Letter Preview</h2>
        
        <div className="flex items-center space-x-2">
          {/* Zoom Controls */}
          <div className="flex items-center space-x-1 bg-neutral-100 rounded-lg p-1">
            <button
              onClick={handleZoomOut}
              className="p-1 hover:bg-white rounded transition-colors"
              disabled={zoomLevel <= 50}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </button>
            
            <button
              onClick={handleZoomReset}
              className="px-2 py-1 text-xs font-medium hover:bg-white rounded transition-colors min-w-[3rem]"
            >
              {zoomLevel}%
            </button>
            
            <button
              onClick={handleZoomIn}
              className="p-1 hover:bg-white rounded transition-colors"
              disabled={zoomLevel >= 200}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Preview Content */}
      <div className="flex-1 overflow-auto bg-neutral-50 p-4">
        <div className="max-w-[210mm] mx-auto">
          <div
            className="bg-white shadow-lg min-h-[297mm] p-8 transition-transform origin-top"
            style={{ 
              transform: `scale(${zoomLevel / 100})`,
              marginBottom: zoomLevel !== 100 ? `${(zoomLevel - 100) * 2}px` : '0'
            }}
          >
            <div className="whitespace-pre-wrap text-neutral-900 leading-relaxed">
              {coverLetterContent}
            </div>
          </div>
        </div>
      </div>

      {/* Export Controls */}
      <div className="border-t border-neutral-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-neutral-600">Export as:</span>
            <select
              value={exportFormat}
              onChange={(e) => setExportFormat(e.target.value as 'pdf' | 'docx' | 'txt')}
              className="input h-8 py-1 px-2 text-sm min-w-[80px]"
            >
              <option value="pdf">PDF</option>
              <option value="docx">DOCX</option>
              <option value="txt">Text</option>
            </select>
          </div>

          <Button
            onClick={() => onExport?.(exportFormat)}
            className="text-sm"
            disabled={!coverLetterContent}
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Download
          </Button>
        </div>
      </div>
    </div>
  )
}