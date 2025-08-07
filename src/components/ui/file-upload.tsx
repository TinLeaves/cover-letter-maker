'use client'

import * as React from "react"
import { cn } from "@/lib/utils"

export interface FileUploadProps extends React.HTMLAttributes<HTMLDivElement> {
  onFileSelect: (file: File) => void
  accept?: string
  maxSize?: number // in bytes
  multiple?: boolean
  disabled?: boolean
  label?: string
  helperText?: string
  error?: string
  value?: File | null
}

const FileUpload = React.forwardRef<HTMLDivElement, FileUploadProps>(
  ({ 
    className, 
    onFileSelect, 
    accept = "*/*", 
    maxSize = 10 * 1024 * 1024, // 10MB default
    multiple = false,
    disabled = false,
    label,
    helperText,
    error,
    value,
    ...props 
  }, ref) => {
    const [dragActive, setDragActive] = React.useState(false)
    const inputRef = React.useRef<HTMLInputElement>(null)
    const dropZoneRef = React.useRef<HTMLDivElement>(null)

    const validateFile = (file: File): string | null => {
      if (maxSize && file.size > maxSize) {
        const sizeMB = Math.round(maxSize / (1024 * 1024))
        return `File size must be less than ${sizeMB}MB`
      }
      return null
    }

    const handleFiles = (files: FileList) => {
      const file = files[0]
      if (!file) return

      const validationError = validateFile(file)
      if (validationError) {
        // You could pass this up to parent component for error handling
        console.error(validationError)
        return
      }

      onFileSelect(file)
    }

    const handleDrag = (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      
      if (disabled) return

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

      if (disabled || !e.dataTransfer.files) return

      handleFiles(e.dataTransfer.files)
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault()
      if (disabled || !e.target.files) return

      handleFiles(e.target.files)
    }

    const openFileDialog = () => {
      if (disabled) return
      inputRef.current?.click()
    }

    const removeFile = () => {
      if (disabled) return
      if (inputRef.current) {
        inputRef.current.value = ''
      }
      // Create empty file list and call onFileSelect with a mock empty file
      // In practice, you'd want to modify the interface to handle null/undefined
    }

    const formatFileSize = (bytes: number): string => {
      if (bytes === 0) return '0 Bytes'
      const k = 1024
      const sizes = ['Bytes', 'KB', 'MB', 'GB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
    }

    return (
      <div className="form-field">
        {label && (
          <label className="form-label">
            {label}
          </label>
        )}
        
        <div
          ref={ref}
          className={cn(
            "relative border-2 border-dashed rounded-xl transition-all duration-200 cursor-pointer",
            dragActive && !disabled
              ? "border-primary-400 bg-primary-50"
              : error
              ? "border-error-300 bg-error-50"
              : "border-neutral-300 bg-white hover:border-neutral-400 hover:bg-neutral-50",
            disabled && "opacity-50 cursor-not-allowed",
            className
          )}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={openFileDialog}
          {...props}
        >
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            multiple={multiple}
            onChange={handleChange}
            className="hidden"
            disabled={disabled}
          />

          {!value ? (
            <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-neutral-900 mb-2">
                Upload your file
              </h3>
              <p className="text-sm text-neutral-600 mb-4">
                Drag and drop your file here, or click to browse
              </p>
              <div className="flex items-center space-x-1 text-xs text-neutral-500">
                <span>Max size: {formatFileSize(maxSize)}</span>
                {accept !== "*/*" && (
                  <>
                    <span>•</span>
                    <span>{accept.replace(/\./g, '').toUpperCase()}</span>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-success-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-neutral-900">{value.name}</p>
                  <p className="text-xs text-neutral-600">{formatFileSize(value.size)}</p>
                </div>
              </div>
              
              {!disabled && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    removeFile()
                  }}
                  className="p-1 text-neutral-400 hover:text-neutral-600 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          )}
        </div>

        {helperText && !error && (
          <p className="form-description">{helperText}</p>
        )}
        
        {error && (
          <p className="form-error">{error}</p>
        )}
      </div>
    )
  }
)

FileUpload.displayName = "FileUpload"

export { FileUpload }