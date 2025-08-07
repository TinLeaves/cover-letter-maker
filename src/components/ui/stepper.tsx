'use client'

import * as React from "react"
import { cn } from "@/lib/utils"

export interface Step {
  id: string
  title: string
  description?: string
  href?: string
  status?: 'pending' | 'current' | 'complete'
}

export interface StepperProps {
  steps: Step[]
  currentStep: number
  orientation?: 'horizontal' | 'vertical'
  className?: string
}

const Stepper: React.FC<StepperProps> = ({ 
  steps, 
  currentStep, 
  orientation = 'horizontal',
  className 
}) => {
  const getStepStatus = (stepIndex: number): Step['status'] => {
    if (stepIndex < currentStep) return 'complete'
    if (stepIndex === currentStep) return 'current'
    return 'pending'
  }

  if (orientation === 'vertical') {
    return (
      <nav className={cn("space-y-4", className)}>
        {steps.map((step, index) => {
          const status = getStepStatus(index)
          
          return (
            <div key={step.id} className="flex items-start">
              <div className="flex flex-col items-center mr-4">
                <div
                  className={cn(
                    "flex items-center justify-center w-8 h-8 rounded-full border-2 text-sm font-medium transition-colors",
                    status === 'complete' && "bg-primary-600 border-primary-600 text-white",
                    status === 'current' && "bg-white border-primary-600 text-primary-600",
                    status === 'pending' && "bg-white border-neutral-300 text-neutral-500"
                  )}
                >
                  {status === 'complete' ? (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    index + 1
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div className="w-px h-8 bg-neutral-300 mt-2" />
                )}
              </div>
              
              <div className="flex-1 min-w-0 pb-8">
                <h3
                  className={cn(
                    "text-sm font-medium",
                    status === 'current' && "text-primary-600",
                    status === 'complete' && "text-neutral-900",
                    status === 'pending' && "text-neutral-500"
                  )}
                >
                  {step.title}
                </h3>
                {step.description && (
                  <p className="text-sm text-neutral-500 mt-1">{step.description}</p>
                )}
              </div>
            </div>
          )
        })}
      </nav>
    )
  }

  return (
    <nav className={cn("w-full", className)}>
      <ol className="flex items-center justify-between">
        {steps.map((step, index) => {
          const status = getStepStatus(index)
          
          return (
            <li key={step.id} className="relative flex-1">
              <div className="flex items-center">
                <div
                  className={cn(
                    "flex items-center justify-center w-10 h-10 rounded-full border-2 text-sm font-medium transition-colors",
                    status === 'complete' && "bg-primary-600 border-primary-600 text-white",
                    status === 'current' && "bg-white border-primary-600 text-primary-600",
                    status === 'pending' && "bg-white border-neutral-300 text-neutral-500"
                  )}
                >
                  {status === 'complete' ? (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    index + 1
                  )}
                </div>
                
                {index < steps.length - 1 && (
                  <div className="flex-1 mx-4">
                    <div
                      className={cn(
                        "h-0.5 transition-colors",
                        status === 'complete' ? "bg-primary-600" : "bg-neutral-300"
                      )}
                    />
                  </div>
                )}
              </div>
              
              <div className="absolute top-12 left-1/2 transform -translate-x-1/2 text-center min-w-0">
                <h3
                  className={cn(
                    "text-sm font-medium whitespace-nowrap",
                    status === 'current' && "text-primary-600",
                    status === 'complete' && "text-neutral-900", 
                    status === 'pending' && "text-neutral-500"
                  )}
                >
                  {step.title}
                </h3>
                {step.description && (
                  <p className="text-xs text-neutral-500 mt-1 whitespace-nowrap">{step.description}</p>
                )}
              </div>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

Stepper.displayName = "Stepper"

export { Stepper }