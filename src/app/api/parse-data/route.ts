import { NextRequest, NextResponse } from 'next/server'
import { parseResume } from '@/lib/resume-parser'
import { scrapeJobHtml, parseJobHtml } from '@/lib/job-scraper'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const jobUrl = formData.get('jobUrl') as string | null
    const resumeFile = formData.get('resume') as File
    const preScrapeContent = formData.get('preScrapeContent') as string | null
    const preScrapedHtml = formData.get('preScrapedHtml') as string | null

    if (!resumeFile) {
      return NextResponse.json(
        { error: 'Resume file is required' },
        { status: 400 }
      )
    }
    
    if (!jobUrl && !preScrapeContent) {
      return NextResponse.json(
        { error: 'Job URL or job description is required' },
        { status: 400 }
      )
    }

    // Convert file to buffer
    const resumeBuffer = Buffer.from(await resumeFile.arrayBuffer())
    
    // Parse resume
    const resumeText = await parseResume(resumeBuffer, resumeFile.type)
    
    // Get job description: use parsed content, parse from HTML, or scrape
    let jobDescription: string
    let jobHtml: string | null = null
    
    if (preScrapeContent) {
      // Use pre-parsed content directly
      jobDescription = preScrapeContent
    } else if (preScrapedHtml) {
      // Store HTML for later parsing, parse now for preview
      jobHtml = preScrapedHtml
      jobDescription = parseJobHtml(preScrapedHtml)
    } else if (jobUrl) {
      // Scrape HTML and store it for later parsing
      jobHtml = await scrapeJobHtml(jobUrl)
      jobDescription = parseJobHtml(jobHtml)
    } else {
      // This shouldn't happen due to validation above, but handle gracefully
      throw new Error('No job information provided')
    }

    return NextResponse.json({ 
      resumeText,
      jobDescription,
      jobUrl,
      jobHtml,
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