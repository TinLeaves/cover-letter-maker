import { NextRequest, NextResponse } from 'next/server'
import { scrapeJobHtml, parseJobHtml } from '@/lib/job-scraper'

export async function POST(request: NextRequest) {
  try {
    const { jobUrl } = await request.json()

    if (!jobUrl) {
      return NextResponse.json(
        { error: 'Job URL is required' },
        { status: 400 }
      )
    }

    // Scrape raw HTML and then parse it for preview
    const htmlContent = await scrapeJobHtml(jobUrl)
    const jobDescription = parseJobHtml(htmlContent)

    return NextResponse.json({ 
      jobDescription,
      htmlContent 
    })
  } catch (error) {
    console.error('Error scraping job listing:', error)
    return NextResponse.json(
      { error: 'Failed to scrape job listing. Please check the URL and try again.' },
      { status: 500 }
    )
  }
}