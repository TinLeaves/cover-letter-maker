import { NextRequest, NextResponse } from 'next/server'
import { generateCoverLetter } from '@/lib/gemini'
import { parseResume } from '@/lib/resume-parser'
import { scrapeJobHtml, parseJobHtml } from '@/lib/job-scraper'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const jobUrl = formData.get('jobUrl') as string
    const resumeFile = formData.get('resume') as File
    const jobHtml = formData.get('jobHtml') as string | null
    const jobDescription = formData.get('jobDescription') as string | null

    if (!resumeFile || (!jobUrl && !jobDescription)) {
      return NextResponse.json(
        { error: 'Resume file and either job URL or job description are required' },
        { status: 400 }
      )
    }

    // Convert file to buffer
    const resumeBuffer = Buffer.from(await resumeFile.arrayBuffer())
    
    // Parse resume
    const resumeText = await parseResume(resumeBuffer, resumeFile.type)
    
    // Get job description: either use provided text, parse from HTML, or scrape from URL
    let finalJobDescription: string
    let dataSource: 'scraped' | 'direct' | 'parsed_html'
    
    if (jobDescription) {
      // Job description provided directly - no parsing needed
      finalJobDescription = jobDescription
      dataSource = 'direct'
    } else if (jobHtml) {
      // Parse job description from HTML right before AI processing
      finalJobDescription = parseJobHtml(jobHtml)
      dataSource = 'parsed_html'
    } else if (jobUrl) {
      // Scrape HTML and parse right before AI processing
      const htmlContent = await scrapeJobHtml(jobUrl)
      finalJobDescription = parseJobHtml(htmlContent)
      dataSource = 'scraped'
    } else {
      return NextResponse.json(
        { error: 'No job information provided' },
        { status: 400 }
      )
    }

    // Generate cover letter using Gemini with data source information
    const result = await generateCoverLetter(finalJobDescription, resumeText, { dataSource })

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