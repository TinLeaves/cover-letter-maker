'use client'

import * as React from "react"
import { cn } from "@/lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'outline'
  size?: 'sm' | 'default' | 'lg'
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    const baseClasses = "inline-flex items-center rounded-full font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
    
    const variants = {
      default: "bg-neutral-100 text-neutral-900 hover:bg-neutral-200",
      primary: "bg-primary-100 text-primary-800 hover:bg-primary-200",
      secondary: "bg-secondary-100 text-secondary-800 hover:bg-secondary-200",
      success: "bg-success-100 text-success-800 hover:bg-success-200", 
      warning: "bg-warning-100 text-warning-800 hover:bg-warning-200",
      error: "bg-error-100 text-error-800 hover:bg-error-200",
      outline: "border border-neutral-200 text-neutral-600 hover:bg-neutral-50"
    }
    
    const sizes = {
      sm: "px-2 py-0.5 text-xs",
      default: "px-3 py-1 text-sm",
      lg: "px-4 py-1.5 text-base"
    }

    return (
      <div
        ref={ref}
        className={cn(
          baseClasses,
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    )
  }
)

Badge.displayName = "Badge"

export { Badge }