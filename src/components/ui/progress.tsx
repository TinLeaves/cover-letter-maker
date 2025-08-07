'use client'

import * as React from "react"
import { cn } from "@/lib/utils"

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number
  max?: number
  showLabel?: boolean
  size?: 'sm' | 'default' | 'lg'
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value = 0, max = 100, showLabel = false, size = 'default', ...props }, ref) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100)
    
    const sizes = {
      sm: 'h-1',
      default: 'h-2', 
      lg: 'h-3'
    }

    return (
      <div className="w-full space-y-2">
        {showLabel && (
          <div className="flex justify-between text-sm">
            <span className="text-neutral-600">Progress</span>
            <span className="text-neutral-900 font-medium">{Math.round(percentage)}%</span>
          </div>
        )}
        <div
          ref={ref}
          className={cn(
            "relative w-full overflow-hidden rounded-full bg-neutral-200",
            sizes[size],
            className
          )}
          {...props}
        >
          <div
            className="h-full bg-primary-600 transition-all duration-300 ease-in-out"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    )
  }
)

Progress.displayName = "Progress"

export { Progress }