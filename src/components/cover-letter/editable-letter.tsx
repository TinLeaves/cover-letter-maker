'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui'
import { cn } from '@/lib/utils'

interface EditableParagraph {
  id: string
  type: 'header' | 'contact' | 'date' | 'salutation' | 'body' | 'closing' | 'signature'
  content: string
  editable?: boolean
}

interface EditableLetterProps {
  paragraphs: EditableParagraph[]
  onParagraphUpdate?: (id: string, content: string) => void
  onParagraphReorder?: (paragraphs: EditableParagraph[]) => void
  className?: string
}

export function EditableLetter({
  paragraphs,
  onParagraphUpdate,
  onParagraphReorder,
  className = ""
}: EditableLetterProps) {
  const [draggedId, setDraggedId] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const dragOverId = useRef<string | null>(null)

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedId(id)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault()
    dragOverId.current = id
  }

  const handleDragEnd = () => {
    setDraggedId(null)
    dragOverId.current = null
  }

  const handleDrop = (e: React.DragEvent, dropId: string) => {
    e.preventDefault()
    
    if (!draggedId || draggedId === dropId) return

    const draggedIndex = paragraphs.findIndex(p => p.id === draggedId)
    const dropIndex = paragraphs.findIndex(p => p.id === dropId)
    
    if (draggedIndex === -1 || dropIndex === -1) return

    const newParagraphs = [...paragraphs]
    const [draggedParagraph] = newParagraphs.splice(draggedIndex, 1)
    newParagraphs.splice(dropIndex, 0, draggedParagraph)
    
    onParagraphReorder?.(newParagraphs)
    setDraggedId(null)
  }

  const handleEdit = (id: string, content: string) => {
    onParagraphUpdate?.(id, content)
  }

  const getParagraphIcon = (type: EditableParagraph['type']) => {
    switch (type) {
      case 'header':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        )
      case 'contact':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        )
      case 'date':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        )
      case 'salutation':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
          </svg>
        )
      case 'body':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        )
      case 'closing':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        )
      case 'signature':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        )
      default:
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )
    }
  }

  const getTypeLabel = (type: EditableParagraph['type']) => {
    return type.charAt(0).toUpperCase() + type.slice(1).replace(/([A-Z])/g, ' $1')
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {paragraphs.map((paragraph, index) => (
        <div
          key={paragraph.id}
          draggable={paragraph.editable !== false}
          onDragStart={(e) => handleDragStart(e, paragraph.id)}
          onDragOver={(e) => handleDragOver(e, paragraph.id)}
          onDrop={(e) => handleDrop(e, paragraph.id)}
          onDragEnd={handleDragEnd}
          className={cn(
            "group relative border-2 border-transparent rounded-lg transition-all duration-200",
            draggedId === paragraph.id && "opacity-50",
            dragOverId.current === paragraph.id && "border-primary-300 bg-primary-50",
            "hover:border-neutral-200 hover:bg-neutral-50"
          )}
        >
          {/* Drag handle and controls */}
          <div className="absolute left-0 top-0 -ml-12 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center space-y-1">
            {paragraph.editable !== false && (
              <button
                className="p-2 text-neutral-400 hover:text-neutral-600 cursor-grab active:cursor-grabbing"
                title="Drag to reorder"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                </svg>
              </button>
            )}
            
            <div className="flex items-center text-xs text-neutral-500 bg-white rounded border px-2 py-1">
              {getParagraphIcon(paragraph.type)}
              <span className="ml-1">{getTypeLabel(paragraph.type)}</span>
            </div>
          </div>

          {/* Content */}
          <div className="relative p-4">
            {editingId === paragraph.id ? (
              <textarea
                value={paragraph.content}
                onChange={(e) => handleEdit(paragraph.id, e.target.value)}
                onBlur={() => setEditingId(null)}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') {
                    setEditingId(null)
                  }
                  if (e.key === 'Enter' && e.metaKey) {
                    setEditingId(null)
                  }
                }}
                className="w-full bg-transparent border-none resize-none focus:outline-none text-neutral-900 leading-relaxed"
                style={{ height: 'auto' }}
                autoFocus
              />
            ) : (
              <div
                onClick={() => paragraph.editable !== false && setEditingId(paragraph.id)}
                className={cn(
                  "whitespace-pre-wrap text-neutral-900 leading-relaxed",
                  paragraph.editable !== false && "cursor-text hover:bg-neutral-50 -m-2 p-2 rounded"
                )}
              >
                {paragraph.content}
              </div>
            )}

            {/* Edit button */}
            {paragraph.editable !== false && editingId !== paragraph.id && (
              <button
                onClick={() => setEditingId(paragraph.id)}
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-white rounded-lg border border-neutral-200 shadow-sm"
                title="Click to edit"
              >
                <svg className="w-4 h-4 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
            )}

            {/* Editing indicator */}
            {editingId === paragraph.id && (
              <div className="absolute top-2 right-2 text-xs text-primary-600 bg-primary-50 px-2 py-1 rounded border border-primary-200">
                Editing • Press Esc to cancel
              </div>
            )}
          </div>
        </div>
      ))}

      {/* Instructions */}
      <div className="text-center py-8 text-neutral-500 text-sm">
        <div className="flex items-center justify-center space-x-4">
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4" />
            </svg>
            <span>Drag to reorder</span>
          </div>
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <span>Click to edit</span>
          </div>
        </div>
      </div>
    </div>
  )
}