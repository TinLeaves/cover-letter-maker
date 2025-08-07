'use client'

import { useState } from 'react'
import { Button, Badge, Card, CardHeader, CardTitle, CardContent } from '@/components/ui'
import { cn } from '@/lib/utils'

interface Suggestion {
  id: string
  type: 'grammar' | 'impact' | 'keywords' | 'structure'
  title: string
  description: string
  original: string
  suggested: string
  confidence: number
}

interface SuggestionsPanelProps {
  suggestions?: Suggestion[]
  onAcceptSuggestion?: (suggestionId: string) => void
  onRejectSuggestion?: (suggestionId: string) => void
  isLoading?: boolean
  className?: string
}

const typeColors = {
  grammar: 'error',
  impact: 'warning', 
  keywords: 'primary',
  structure: 'secondary'
} as const

const typeIcons = {
  grammar: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  impact: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ),
  keywords: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
    </svg>
  ),
  structure: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
    </svg>
  )
}

export function SuggestionsPanel({
  suggestions = [],
  onAcceptSuggestion,
  onRejectSuggestion,
  isLoading = false,
  className = ""
}: SuggestionsPanelProps) {
  const [expandedSuggestion, setExpandedSuggestion] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all' | 'grammar' | 'impact' | 'keywords' | 'structure'>('all')

  const filteredSuggestions = suggestions.filter(s => 
    filter === 'all' || s.type === filter
  )

  const suggestionCounts = suggestions.reduce((acc, suggestion) => {
    acc[suggestion.type] = (acc[suggestion.type] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  if (isLoading) {
    return (
      <div className={`bg-white border border-neutral-200 rounded-2xl flex flex-col ${className}`}>
        <div className="p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-neutral-200 rounded w-3/4 mb-4"></div>
            <div className="space-y-3">
              <div className="h-3 bg-neutral-200 rounded"></div>
              <div className="h-3 bg-neutral-200 rounded w-5/6"></div>
              <div className="h-3 bg-neutral-200 rounded w-4/6"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-white border border-neutral-200 rounded-2xl flex flex-col ${className}`}>
      <div className="p-6 border-b border-neutral-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-neutral-900">AI Suggestions</h3>
          <Badge variant="outline" size="sm">
            {suggestions.length} suggestions
          </Badge>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('all')}
            className={cn(
              "px-3 py-1.5 text-xs font-medium rounded-full transition-colors",
              filter === 'all' 
                ? "bg-primary-100 text-primary-800" 
                : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
            )}
          >
            All ({suggestions.length})
          </button>
          
          {(['grammar', 'impact', 'keywords', 'structure'] as const).map(type => (
            suggestionCounts[type] > 0 && (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={cn(
                  "px-3 py-1.5 text-xs font-medium rounded-full transition-colors capitalize",
                  filter === type 
                    ? `bg-${typeColors[type]}-100 text-${typeColors[type]}-800`
                    : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                )}
              >
                {type} ({suggestionCounts[type]})
              </button>
            )
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        {filteredSuggestions.length === 0 ? (
          <div className="p-6 text-center">
            <div className="w-16 h-16 bg-success-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h4 className="text-lg font-medium text-neutral-900 mb-2">Great job!</h4>
            <p className="text-neutral-600 text-sm">
              {suggestions.length === 0 
                ? "Your cover letter looks excellent. No suggestions at this time."
                : "No suggestions found for this filter."
              }
            </p>
          </div>
        ) : (
          <div className="p-6 space-y-4">
            {filteredSuggestions.map((suggestion) => (
              <Card key={suggestion.id} className="border-l-4 border-l-primary-500">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      <div className={cn(
                        "p-1.5 rounded-lg",
                        `bg-${typeColors[suggestion.type]}-100 text-${typeColors[suggestion.type]}-600`
                      )}>
                        {typeIcons[suggestion.type]}
                      </div>
                      <div>
                        <CardTitle className="text-sm font-medium">
                          {suggestion.title}
                        </CardTitle>
                        <p className="text-xs text-neutral-600 mt-1">
                          {suggestion.description}
                        </p>
                      </div>
                    </div>
                    
                    <Badge 
                      variant="outline" 
                      size="sm"
                      className="ml-2 flex-shrink-0"
                    >
                      {suggestion.confidence}% confident
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="space-y-3">
                    {/* Original text */}
                    <div>
                      <p className="text-xs font-medium text-neutral-500 mb-1">Current:</p>
                      <p className="text-sm bg-neutral-50 rounded-lg p-3 border">
                        {suggestion.original}
                      </p>
                    </div>

                    {/* Suggested text */}
                    <div>
                      <p className="text-xs font-medium text-success-600 mb-1">Suggested:</p>
                      <p className="text-sm bg-success-50 rounded-lg p-3 border border-success-200">
                        {suggestion.suggested}
                      </p>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center space-x-2 pt-2">
                      <Button
                        size="sm"
                        onClick={() => onAcceptSuggestion?.(suggestion.id)}
                        className="text-xs"
                      >
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Accept
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onRejectSuggestion?.(suggestion.id)}
                        className="text-xs"
                      >
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                        Dismiss
                      </Button>

                      <button
                        onClick={() => setExpandedSuggestion(
                          expandedSuggestion === suggestion.id ? null : suggestion.id
                        )}
                        className="text-xs text-neutral-500 hover:text-neutral-700 transition-colors ml-auto"
                      >
                        {expandedSuggestion === suggestion.id ? 'Less' : 'More'} details
                      </button>
                    </div>

                    {/* Expanded details */}
                    {expandedSuggestion === suggestion.id && (
                      <div className="pt-3 border-t border-neutral-200">
                        <div className="text-xs text-neutral-600 space-y-2">
                          <p><strong>Why this helps:</strong> This suggestion improves {suggestion.type} by making your language more impactful and professional.</p>
                          <p><strong>Impact:</strong> This change could make your cover letter more likely to pass ATS screening and catch the hiring manager&apos;s attention.</p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {suggestions.length > 0 && (
        <div className="border-t border-neutral-200 p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-neutral-600">
              AI-powered suggestions to improve your cover letter
            </p>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                suggestions.forEach(s => onAcceptSuggestion?.(s.id))
              }}
              className="text-xs"
            >
              Accept all suggestions
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}