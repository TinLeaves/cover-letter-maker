import { NextRequest, NextResponse } from 'next/server'
import { scrapeJobListing } from '@/lib/job-scraper'

export async function POST(request: NextRequest) {
  try {
    const { jobUrl } = await request.json()

    if (!jobUrl) {
      return NextResponse.json(
        { error: 'Job URL is required' },
        { status: 400 }
      )
    }

    const jobDescription = await scrapeJobListing(jobUrl)

    return NextResponse.json({ jobDescription })
  } catch (error) {
    console.error('Error scraping job listing:', error)
    return NextResponse.json(
      { error: 'Failed to scrape job listing. Please check the URL and try again.' },
      { status: 500 }
    )
  }
}