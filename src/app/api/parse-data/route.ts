import { NextRequest, NextResponse } from 'next/server'
import { parseResume } from '@/lib/resume-parser'
import { scrapeJobListing } from '@/lib/job-scraper'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const jobUrl = formData.get('jobUrl') as string
    const resumeFile = formData.get('resume') as File
    const preScrapeContent = formData.get('preScrapeContent') as string | null

    if (!jobUrl || !resumeFile) {
      return NextResponse.json(
        { error: 'Job URL and resume file are required' },
        { status: 400 }
      )
    }

    // Convert file to buffer
    const resumeBuffer = Buffer.from(await resumeFile.arrayBuffer())
    
    // Parse resume
    const resumeText = await parseResume(resumeBuffer, resumeFile.type)
    
    // Use pre-scraped content if available, otherwise scrape now
    let jobDescription: string
    if (preScrapeContent) {
      jobDescription = preScrapeContent
    } else {
      jobDescription = await scrapeJobListing(jobUrl)
    }

    return NextResponse.json({ 
      resumeText,
      jobDescription,
      jobUrl,
      resumeFileName: resumeFile.name
    })
  } catch (error) {
    console.error('Error parsing data:', error)
    return NextResponse.json(
      { error: 'Failed to parse data. Please try again.' },
      { status: 500 }
    )
  }
}