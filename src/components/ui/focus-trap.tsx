'use client'

import * as React from 'react'

interface FocusTrapProps {
  children: React.ReactNode
  active?: boolean
  className?: string
}

export function FocusTrap({ children, active = true, className }: FocusTrapProps) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const startRef = React.useRef<HTMLDivElement>(null)
  const endRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (!active) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return

      const container = containerRef.current
      if (!container) return

      const focusableElements = container.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      
      const firstElement = focusableElements[0] as HTMLElement
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault()
          lastElement?.focus()
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault()
          firstElement?.focus()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [active])

  if (!active) {
    return <div className={className}>{children}</div>
  }

  return (
    <div ref={containerRef} className={className}>
      <div
        ref={startRef}
        tabIndex={0}
        style={{ position: 'absolute', left: '-9999px' }}
        onFocus={(e) => {
          const container = containerRef.current
          if (!container) return
          const firstFocusable = container.querySelector(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          ) as HTMLElement
          firstFocusable?.focus()
        }}
      />
      {children}
      <div
        ref={endRef}
        tabIndex={0}
        style={{ position: 'absolute', left: '-9999px' }}
        onFocus={(e) => {
          const container = containerRef.current
          if (!container) return
          const focusableElements = container.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          )
          const lastFocusable = focusableElements[focusableElements.length - 1] as HTMLElement
          lastFocusable?.focus()
        }}
      />
    </div>
  )
}