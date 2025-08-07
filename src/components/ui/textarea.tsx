'use client'

import * as React from "react"
import { cn } from "@/lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean
  helperText?: string
  label?: string
  required?: boolean
  maxLength?: number
  showCharCount?: boolean
  autoExpand?: boolean
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ 
    className, 
    error, 
    helperText, 
    label, 
    required, 
    maxLength,
    showCharCount,
    autoExpand = false,
    id,
    value,
    onChange,
    ...props 
  }, ref) => {
    const generatedId = React.useId()
    const textareaId = id || generatedId
    const [charCount, setCharCount] = React.useState(0)
    const textareaRef = React.useRef<HTMLTextAreaElement>(null)

    React.useImperativeHandle(ref, () => textareaRef.current!)

    React.useEffect(() => {
      if (value) {
        setCharCount(value.toString().length)
      }
    }, [value])

    React.useEffect(() => {
      if (autoExpand && textareaRef.current) {
        const textarea = textareaRef.current
        textarea.style.height = 'auto'
        textarea.style.height = `${textarea.scrollHeight}px`
      }
    }, [value, autoExpand])

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setCharCount(e.target.value.length)
      
      if (autoExpand) {
        e.target.style.height = 'auto'
        e.target.style.height = `${e.target.scrollHeight}px`
      }
      
      onChange?.(e)
    }

    return (
      <div className="form-field">
        {label && (
          <label 
            htmlFor={textareaId}
            className={cn(
              "form-label",
              required && "after:content-['*'] after:text-error-500 after:ml-1"
            )}
          >
            {label}
          </label>
        )}
        
        <textarea
          id={textareaId}
          className={cn(
            "textarea",
            error && "input-error",
            autoExpand && "resize-none overflow-hidden",
            className
          )}
          ref={textareaRef}
          maxLength={maxLength}
          value={value}
          onChange={handleChange}
          aria-invalid={error}
          aria-describedby={helperText ? `${textareaId}-helper` : undefined}
          {...props}
        />
        
        <div className="flex justify-between items-start">
          {helperText && (
            <p 
              id={`${textareaId}-helper`}
              className={cn(
                "form-description",
                error && "form-error"
              )}
            >
              {helperText}
            </p>
          )}
          
          {(showCharCount || maxLength) && (
            <span className={cn(
              "text-xs",
              maxLength && charCount > maxLength * 0.9 ? "text-warning-600" : "text-neutral-400",
              maxLength && charCount >= maxLength && "text-error-600"
            )}>
              {charCount}{maxLength && `/${maxLength}`}
            </span>
          )}
        </div>
      </div>
    )
  }
)

Textarea.displayName = "Textarea"

export { Textarea }