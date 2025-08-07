import { useState, useEffect } from 'react'

// Haptic feedback utilities for mobile devices
export const haptics = {
  // Light impact feedback (for subtle interactions like button taps)
  light: () => {
    if ('vibrate' in navigator && 'ontouchstart' in window) {
      navigator.vibrate(10)
    }
  },

  // Medium impact feedback (for confirmations)
  medium: () => {
    if ('vibrate' in navigator && 'ontouchstart' in window) {
      navigator.vibrate(20)
    }
  },

  // Heavy impact feedback (for important actions)
  heavy: () => {
    if ('vibrate' in navigator && 'ontouchstart' in window) {
      navigator.vibrate(50)
    }
  },

  // Success feedback (for completed actions)
  success: () => {
    if ('vibrate' in navigator && 'ontouchstart' in window) {
      navigator.vibrate([10, 100, 10])
    }
  },

  // Error feedback (for errors or warnings)
  error: () => {
    if ('vibrate' in navigator && 'ontouchstart' in window) {
      navigator.vibrate([50, 50, 50])
    }
  },

  // Notification feedback (for alerts)
  notification: () => {
    if ('vibrate' in navigator && 'ontouchstart' in window) {
      navigator.vibrate([20, 100, 20, 100, 20])
    }
  },

  // Selection feedback (for drag and drop)
  selection: () => {
    if ('vibrate' in navigator && 'ontouchstart' in window) {
      navigator.vibrate(15)
    }
  },

  // Check if haptic feedback is available
  isSupported: () => {
    return 'vibrate' in navigator && 'ontouchstart' in window
  }
}

// Hook to use haptic feedback with preferences
export function useHaptics() {
  const [isEnabled, setIsEnabled] = useState(true)

  useEffect(() => {
    // Check user preference for haptic feedback
    const preference = localStorage.getItem('haptic-feedback-enabled')
    if (preference !== null) {
      setIsEnabled(JSON.parse(preference))
    }
  }, [])

  const setHapticsEnabled = (enabled: boolean) => {
    setIsEnabled(enabled)
    localStorage.setItem('haptic-feedback-enabled', JSON.stringify(enabled))
  }

  const trigger = (type: keyof typeof haptics) => {
    if (isEnabled && haptics.isSupported() && typeof haptics[type] === 'function') {
      ;(haptics[type] as () => void)()
    }
  }

  return {
    isEnabled,
    isSupported: haptics.isSupported(),
    setEnabled: setHapticsEnabled,
    trigger
  }
}