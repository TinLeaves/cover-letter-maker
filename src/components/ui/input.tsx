'use client'

import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
  helperText?: string
  label?: string
  required?: boolean
  icon?: React.ReactNode
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, helperText, label, required, icon, id, ...props }, ref) => {
    const generatedId = React.useId()
    const inputId = id || generatedId

    return (
      <div className="form-field">
        {label && (
          <label 
            htmlFor={inputId}
            className={cn(
              "form-label",
              required && "after:content-['*'] after:text-error-500 after:ml-1"
            )}
          >
            {label}
          </label>
        )}
        
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400">
              {icon}
            </div>
          )}
          
          <input
            type={type}
            id={inputId}
            className={cn(
              "input",
              error && "input-error",
              icon && "pl-10",
              className
            )}
            ref={ref}
            aria-invalid={error}
            aria-describedby={helperText ? `${inputId}-helper` : undefined}
            {...props}
          />
        </div>
        
        {helperText && (
          <p 
            id={`${inputId}-helper`}
            className={cn(
              "form-description",
              error && "form-error"
            )}
          >
            {helperText}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = "Input"

export { Input }