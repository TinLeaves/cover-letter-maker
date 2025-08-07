import { NextRequest, NextResponse } from 'next/server'
import { generateCoverLetter } from '@/lib/gemini'

export async function POST(request: NextRequest) {
  try {
    const { jobDescription, resumeText } = await request.json()

    if (!jobDescription || !resumeText) {
      return NextResponse.json(
        { error: 'Job description and resume text are required' },
        { status: 400 }
      )
    }

    // Generate cover letter using Gemini with direct text input
    const result = await generateCoverLetter(jobDescription, resumeText, { dataSource: 'direct' })

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to generate cover letter' },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      coverLetter: result.content,
      wordCount: result.wordCount 
    })
  } catch (error) {
    console.error('Error generating cover letter:', error)
    return NextResponse.json(
      { error: 'Failed to generate cover letter. Please try again.' },
      { status: 500 }
    )
  }
}