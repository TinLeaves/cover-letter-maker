'use client'

import * as React from "react"
import { cn } from "@/lib/utils"
import { haptics } from "@/lib/haptics"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'default' | 'lg'
  loading?: boolean
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
  asChild?: boolean
  haptic?: boolean | 'light' | 'medium' | 'heavy'
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant = 'primary', 
    size = 'default', 
    loading = false,
    icon,
    iconPosition = 'left',
    asChild = false,
    haptic = 'light',
    children,
    disabled,
    onClick,
    ...props 
  }, ref) => {
    const baseClasses = "btn focus-ring"
    
    const variants = {
      primary: "btn-primary",
      secondary: "btn-secondary", 
      ghost: "btn-ghost",
      danger: "btn-danger"
    }
    
    const sizes = {
      sm: "btn-sm",
      default: "",
      lg: "btn-lg"
    }

    const isDisabled = disabled || loading

    const buttonClasses = cn(
      baseClasses,
      variants[variant],
      sizes[size],
      isDisabled && "opacity-50 cursor-not-allowed",
      // Make touch targets at least 44px for better mobile usability
      "min-h-[44px] min-w-[44px]",
      className
    )

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      // Trigger haptic feedback on touch devices
      if (haptic && !isDisabled) {
        const hapticType = haptic === true ? 'light' : haptic
        haptics[hapticType]()
      }
      
      onClick?.(e)
    }

    if (asChild && React.isValidElement(children)) {
      const child = children as React.ReactElement<Record<string, unknown>>
      return React.cloneElement(child, {
        className: cn(child.props?.className as string, buttonClasses),
        onClick: (e: React.MouseEvent) => {
          handleClick(e as React.MouseEvent<HTMLButtonElement>)
          if (child.props?.onClick) {
            (child.props.onClick as (e: React.MouseEvent) => void)(e)
          }
        },
      })
    }

    return (
      <button
        className={buttonClasses}
        ref={ref}
        disabled={isDisabled}
        onClick={handleClick}
        {...props}
      >
        {loading && (
          <svg 
            className="animate-spin -ml-1 mr-2 h-4 w-4" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24"
          >
            <circle 
              className="opacity-25" 
              cx="12" 
              cy="12" 
              r="10" 
              stroke="currentColor" 
              strokeWidth="4"
            />
            <path 
              className="opacity-75" 
              fill="currentColor" 
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        
        {!loading && icon && iconPosition === 'left' && (
          <span className="mr-2">{icon}</span>
        )}
        
        {children}
        
        {!loading && icon && iconPosition === 'right' && (
          <span className="ml-2">{icon}</span>
        )}
      </button>
    )
  }
)

Button.displayName = "Button"

export { Button }