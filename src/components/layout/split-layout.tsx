'use client'

import React, { useState } from 'react'
import { cn } from '@/lib/utils'

interface SplitLayoutProps {
  leftPanel: React.ReactNode
  rightPanel: React.ReactNode
  className?: string
  leftClassName?: string
  rightClassName?: string
  defaultCollapsed?: boolean
  collapsible?: boolean
  minLeftWidth?: number
  maxLeftWidth?: number
}

export function SplitLayout({
  leftPanel,
  rightPanel,
  className,
  leftClassName,
  rightClassName,
  defaultCollapsed = false,
  collapsible = true,
  minLeftWidth = 320,
  maxLeftWidth = 600
}: SplitLayoutProps) {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed)
  const [leftWidth, setLeftWidth] = useState(450)
  const [isDragging, setIsDragging] = useState(false)

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!collapsible) return
    setIsDragging(true)
    e.preventDefault()
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !collapsible) return
    
    const containerRect = document.querySelector('[data-split-container]')?.getBoundingClientRect()
    if (!containerRect) return
    
    const newWidth = e.clientX - containerRect.left
    const clampedWidth = Math.min(Math.max(newWidth, minLeftWidth), maxLeftWidth)
    setLeftWidth(clampedWidth)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  // Add global mouse event listeners when dragging
  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = 'col-resize'
      document.body.style.userSelect = 'none'
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
        document.body.style.cursor = ''
        document.body.style.userSelect = ''
      }
    }
  }, [isDragging])

  return (
    <div 
      className={cn("flex h-full overflow-hidden", className)}
      data-split-container
    >
      {/* Left Panel */}
      <div 
        className={cn(
          "flex flex-col bg-white border-r border-neutral-200 transition-all duration-300",
          isCollapsed ? "w-0 opacity-0" : "opacity-100",
          leftClassName
        )}
        style={{ 
          width: isCollapsed ? 0 : `${leftWidth}px`,
          minWidth: isCollapsed ? 0 : `${minLeftWidth}px`,
          maxWidth: isCollapsed ? 0 : `${maxLeftWidth}px`
        }}
      >
        {!isCollapsed && (
          <div className="flex-1 overflow-hidden">
            {leftPanel}
          </div>
        )}
      </div>

      {/* Resizer */}
      {collapsible && (
        <div
          className={cn(
            "group relative flex items-center justify-center w-1 bg-neutral-200 hover:bg-neutral-300 cursor-col-resize transition-colors",
            isDragging && "bg-primary-500"
          )}
          onMouseDown={handleMouseDown}
        >
          {/* Resize handle indicator */}
          <div className="absolute inset-y-0 -left-1 -right-1 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="w-1 h-8 bg-neutral-400 rounded-full" />
          </div>
        </div>
      )}

      {/* Right Panel */}
      <div 
        className={cn(
          "flex-1 flex flex-col bg-neutral-50 min-w-0 transition-all duration-300",
          rightClassName
        )}
      >
        {/* Toggle button for mobile */}
        <div className="lg:hidden flex items-center justify-between p-4 bg-white border-b border-neutral-200">
          <h2 className="text-lg font-semibold">Preview</h2>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="btn btn-ghost btn-sm"
          >
            {isCollapsed ? 'Show Form' : 'Hide Form'}
          </button>
        </div>

        <div className="flex-1 overflow-hidden">
          {rightPanel}
        </div>
      </div>

      {/* Collapse/Expand button for desktop */}
      {collapsible && (
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={cn(
            "hidden lg:flex absolute top-1/2 -translate-y-1/2 z-10 w-6 h-12 bg-white border border-neutral-200 rounded-r-lg items-center justify-center hover:bg-neutral-50 transition-colors shadow-sm",
            isCollapsed ? "left-0" : `left-[${leftWidth}px]`
          )}
          style={{ left: isCollapsed ? '0px' : `${leftWidth}px` }}
        >
          <svg 
            className={cn(
              "w-3 h-3 transition-transform",
              isCollapsed ? "rotate-0" : "rotate-180"
            )} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M9 5l7 7-7 7" 
            />
          </svg>
        </button>
      )}
    </div>
  )
}