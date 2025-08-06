import { NextRequest, NextResponse } from 'next/server'
import { parseResume } from '@/lib/resume-parser'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const resumeFile = formData.get('resume') as File

    if (!resumeFile) {
      return NextResponse.json(
        { error: 'Resume file is required' },
        { status: 400 }
      )
    }

    const resumeBuffer = Buffer.from(await resumeFile.arrayBuffer())
    const resumeText = await parseResume(resumeBuffer, resumeFile.type)

    return NextResponse.json({ resumeText })
  } catch (error) {
    console.error('Error parsing resume:', error)
    return NextResponse.json(
      { error: 'Failed to parse resume. Please check the file format and try again.' },
      { status: 500 }
    )
  }
}