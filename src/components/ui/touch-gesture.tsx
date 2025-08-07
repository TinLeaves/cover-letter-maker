'use client'

import * as React from 'react'

interface TouchGestureProps {
  children: React.ReactNode
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  onSwipeUp?: () => void
  onSwipeDown?: () => void
  onPinch?: (scale: number) => void
  onTap?: () => void
  onLongPress?: () => void
  threshold?: number
  longPressDelay?: number
  className?: string
}

export function TouchGesture({
  children,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  onPinch,
  onTap,
  onLongPress,
  threshold = 50,
  longPressDelay = 500,
  className
}: TouchGestureProps) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const touchStartRef = React.useRef<{ x: number; y: number; time: number } | null>(null)
  const longPressTimerRef = React.useRef<NodeJS.Timeout | null>(null)
  const lastTouchDistanceRef = React.useRef<number | null>(null)

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0]
    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now()
    }

    // Start long press timer
    if (onLongPress) {
      longPressTimerRef.current = setTimeout(() => {
        onLongPress()
      }, longPressDelay)
    }

    // Handle pinch start
    if (e.touches.length === 2 && onPinch) {
      const touch1 = e.touches[0]
      const touch2 = e.touches[1]
      const distance = Math.sqrt(
        Math.pow(touch2.clientX - touch1.clientX, 2) +
        Math.pow(touch2.clientY - touch1.clientY, 2)
      )
      lastTouchDistanceRef.current = distance
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    // Cancel long press on move
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current)
      longPressTimerRef.current = null
    }

    // Handle pinch
    if (e.touches.length === 2 && onPinch && lastTouchDistanceRef.current) {
      const touch1 = e.touches[0]
      const touch2 = e.touches[1]
      const distance = Math.sqrt(
        Math.pow(touch2.clientX - touch1.clientX, 2) +
        Math.pow(touch2.clientY - touch1.clientY, 2)
      )
      
      const scale = distance / lastTouchDistanceRef.current
      onPinch(scale)
      lastTouchDistanceRef.current = distance
    }
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    // Clear long press timer
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current)
      longPressTimerRef.current = null
    }

    if (!touchStartRef.current) return

    const touch = e.changedTouches[0]
    const deltaX = touch.clientX - touchStartRef.current.x
    const deltaY = touch.clientY - touchStartRef.current.y
    const deltaTime = Date.now() - touchStartRef.current.time

    const absDeltaX = Math.abs(deltaX)
    const absDeltaY = Math.abs(deltaY)

    // Handle tap (short press with minimal movement)
    if (absDeltaX < 10 && absDeltaY < 10 && deltaTime < 300) {
      if (onTap) {
        onTap()
      }
      return
    }

    // Handle swipe gestures
    if (absDeltaX > threshold || absDeltaY > threshold) {
      if (absDeltaX > absDeltaY) {
        // Horizontal swipe
        if (deltaX > 0 && onSwipeRight) {
          onSwipeRight()
        } else if (deltaX < 0 && onSwipeLeft) {
          onSwipeLeft()
        }
      } else {
        // Vertical swipe
        if (deltaY > 0 && onSwipeDown) {
          onSwipeDown()
        } else if (deltaY < 0 && onSwipeUp) {
          onSwipeUp()
        }
      }
    }

    // Reset refs
    touchStartRef.current = null
    lastTouchDistanceRef.current = null
  }

  return (
    <div
      ref={containerRef}
      className={className}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{ touchAction: onPinch ? 'none' : 'auto' }}
    >
      {children}
    </div>
  )
}