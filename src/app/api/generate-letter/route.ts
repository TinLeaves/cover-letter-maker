import { NextRequest, NextResponse } from 'next/server'
import { generateCoverLetter } from '@/lib/gemini'
import { parseResume } from '@/lib/resume-parser'
import { scrapeJobListing } from '@/lib/job-scraper'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const jobUrl = formData.get('jobUrl') as string
    const resumeFile = formData.get('resume') as File

    if (!jobUrl || !resumeFile) {
      return NextResponse.json(
        { error: 'Job URL and resume file are required' },
        { status: 400 }
      )
    }

    // Convert file to buffer
    const resumeBuffer = Buffer.from(await resumeFile.arrayBuffer())
    
    // Parse resume and scrape job listing in parallel
    const [resumeText, jobDescription] = await Promise.all([
      parseResume(resumeBuffer, resumeFile.type),
      scrapeJobListing(jobUrl)
    ])

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