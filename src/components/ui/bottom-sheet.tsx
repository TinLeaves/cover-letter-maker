'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface BottomSheetProps {
  children: React.ReactNode
  isOpen: boolean
  onClose: () => void
  title?: string
  description?: string
  className?: string
  snapPoints?: number[] // Percentages of viewport height
  defaultSnapPoint?: number
}

export function BottomSheet({
  children,
  isOpen,
  onClose,
  title,
  description,
  className,
  snapPoints = [25, 50, 90],
  defaultSnapPoint = 1
}: BottomSheetProps) {
  const [currentSnapPoint, setCurrentSnapPoint] = React.useState(defaultSnapPoint)
  const [isDragging, setIsDragging] = React.useState(false)
  const [startY, setStartY] = React.useState(0)
  const [currentY, setCurrentY] = React.useState(0)
  const sheetRef = React.useRef<HTMLDivElement>(null)

  const currentHeight = snapPoints[currentSnapPoint]

  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true)
    setStartY(e.touches[0].clientY)
    setCurrentY(e.touches[0].clientY)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return
    
    setCurrentY(e.touches[0].clientY)
  }

  const handleTouchEnd = () => {
    if (!isDragging) return

    setIsDragging(false)
    
    const deltaY = currentY - startY
    const threshold = 50

    if (deltaY > threshold && currentSnapPoint < snapPoints.length - 1) {
      // Swipe down - go to next snap point (smaller)
      if (currentSnapPoint === 0) {
        onClose()
      } else {
        setCurrentSnapPoint(currentSnapPoint - 1)
      }
    } else if (deltaY < -threshold && currentSnapPoint < snapPoints.length - 1) {
      // Swipe up - go to previous snap point (larger)
      setCurrentSnapPoint(currentSnapPoint + 1)
    } else if (deltaY > threshold && currentSnapPoint === 0) {
      // Close if swiping down from smallest snap point
      onClose()
    }
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleBackdropClick}
      />
      
      {/* Sheet */}
      <div
        ref={sheetRef}
        className={cn(
          "absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl transition-transform duration-300 ease-out",
          isDragging && "transition-none",
          className
        )}
        style={{
          height: `${currentHeight}vh`,
          transform: isDragging ? `translateY(${Math.max(0, currentY - startY)}px)` : 'translateY(0)'
        }}
      >
        {/* Drag Handle */}
        <div className="flex items-center justify-center pt-4 pb-2">
          <div
            className="w-12 h-1 bg-neutral-300 rounded-full cursor-grab active:cursor-grabbing"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          />
        </div>

        {/* Header */}
        {(title || description) && (
          <div className="px-6 pb-4 border-b border-neutral-200">
            {title && (
              <h2 className="text-xl font-semibold text-neutral-900 mb-1">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-neutral-600 text-sm">
                {description}
              </p>
            )}
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>

        {/* Snap Point Indicators */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col space-y-2">
          {snapPoints.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSnapPoint(index)}
              className={cn(
                "w-2 h-2 rounded-full transition-colors",
                index === currentSnapPoint 
                  ? "bg-primary-600" 
                  : "bg-neutral-300 hover:bg-neutral-400"
              )}
            />
          ))}
        </div>
      </div>
    </div>
  )
}