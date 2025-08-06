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

    // Generate cover letter using Gemini
    const coverLetter = await generateCoverLetter(jobDescription, resumeText)

    return NextResponse.json({ coverLetter })
  } catch (error) {
    console.error('Error generating cover letter:', error)
    return NextResponse.json(
      { error: 'Failed to generate cover letter. Please try again.' },
      { status: 500 }
    )
  }
}