import { GoogleGenerativeAI } from '@google/generative-ai'

interface CoverLetterConfig {
  maxWords?: number
  minWords?: number
  includeSalutation?: boolean
  dataSource?: 'scraped' | 'direct' | 'parsed_html'
}

interface CoverLetterResult {
  content: string
  wordCount: number
  success: boolean
  error?: string
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function generateCoverLetter(
  jobDescription: string, 
  resumeText: string,
  config: CoverLetterConfig = {}
): Promise<CoverLetterResult> {
  const { maxWords = 450, minWords = 350, includeSalutation = false, dataSource = 'direct' } = config

  const prompt = `You are a professional cover letter writer. Create a personalized, compelling, and well-formatted business letter (${minWords}–${maxWords} words) based on the job description and resume provided.

## DATA PROCESSING & ACCURACY VERIFICATION

CRITICAL: The job description and resume data provided have been processed with the following methodology to ensure maximum accuracy:

1. **Job Description Processing**: ${
  dataSource === 'scraped' 
    ? '✓ FRESH SCRAPED DATA: Raw HTML was scraped and parsed immediately before AI processing to capture the most current job requirements'
    : dataSource === 'parsed_html'
    ? '✓ PARSED HTML DATA: Previously scraped HTML was parsed right before AI processing to ensure accurate content extraction'
    : '✓ DIRECT TEXT INPUT: Job description was provided directly as text and used without modification to preserve user intent'
}
   - Parsing happened at the optimal time: right before AI generation for maximum accuracy
   - No outdated cached data was used - content is fresh and current

2. **Content Validation**:
   - Verify that job requirements align with current market standards
   - Cross-reference candidate qualifications with stated job needs  
   - Ensure all mentioned skills, technologies, and requirements are current and relevant

3. **Accuracy Expectations**:
   - Use ONLY the information provided - do not invent or assume details not present
   - If job description seems incomplete, work with available information rather than fabricating
   - Maintain fidelity to the actual parsed content rather than generic assumptions
   - Pay special attention to specific company names, job titles, and technical requirements as they were extracted directly from source

This dual-path processing ensures that whether the job information came from web scraping or direct input, you're working with the most accurate and up-to-date content available.

Job Description:
${jobDescription}

Resume:
${resumeText}

Follow these instructions exactly:

## STRUCTURE AND FORMATTING

1. **Contact Information:**
   - Begin with the applicant's full name on its own line
   - Include address only if available in resume
   - Add phone number and email on separate lines
   - Present in order: Name, Address (if available), Phone, Email

2. **Company Information:**
   - Include company name from job description
   - Add company address only if provided in job description

3. **Title Line:**
   - Create a centered, bold title line after the addresses
   - Use exact job title from job description if provided
   - Include job reference number if mentioned
   - For unclear positions, use "Application for [Most Relevant Position Title]"

4. **Salutation:**
   ${includeSalutation ? 
     '- Use "Dear [Name]," only if hiring manager\'s name is clearly provided' : 
     '- Omit salutation entirely - proceed directly to opening paragraph'
   }
   - Never use generic salutations like "Dear Hiring Manager"

## CONTENT STRUCTURE (4 Paragraphs)

### Opening Paragraph:
- Start with a genuine personal connection or motivation related to the role/industry
- Naturally mention where you found the position (if from job posting)
- State the specific position title you're applying for
- Express authentic enthusiasm for the company using specific details:
  * Reference company mission, values, recent projects, or news
  * Show you've researched the organization
  * Connect your values to theirs
- Avoid clichés like "I am writing to express my interest"
- Set an engaging, confident tone

### Education/Qualifications Paragraph:
- Highlight degrees, certifications, or training directly relevant to the role
- Focus on coursework, projects, or skills that demonstrate job readiness
- Explain how your educational background prepared you for this specific role
- Use specific examples of projects, achievements, or technical skills gained
- Connect academic experiences to practical applications in this field
- Show initiative and results from your educational journey

### Experience Paragraph:
- **Adaptation Rule:** If limited work experience, expand education into 2-3 paragraphs and omit this section. If extensive experience, focus on experience and minimize education coverage.
- Highlight 2-3 most compelling experiences that directly relate to job requirements
- Present in order of relevance and impact (most convincing first)
- Use specific, quantifiable achievements where possible
- Emphasize transferable skills with explicit connections to the target role
- Show progression and growth in your career
- Focus on results and impact rather than just duties
- Make clear connections between past work and future contributions

### Closing Paragraph:
- Reaffirm enthusiasm for the specific role and company
- Express confidence in your ability to contribute meaningfully
- Request an interview opportunity professionally
- Provide preferred contact method
- Thank them for their consideration
- End with forward-looking confidence rather than passive language

## WRITING GUIDELINES

**Tone and Style:**
- Professional yet personable and authentic
- Confident without being arrogant
- Show personality while maintaining professionalism
- Use active voice and strong action verbs
- Vary sentence structure for engaging flow

**Language Requirements:**
- Incorporate relevant keywords from job description naturally
- Avoid buzzwords, clichés, and overused phrases
- Use industry-specific terminology appropriately
- Write in clear, concise sentences
- Ensure smooth transitions between paragraphs

**Content Quality:**
- Make every sentence add value and advance your candidacy
- Provide specific examples with measurable outcomes when possible
- Show don't just tell - demonstrate qualifications through examples
- Connect all experiences back to the target role requirements
- Maintain focus on what you can contribute to their organization

**Formatting:**
- Standard business letter format with consistent spacing
- One blank line between major sections
- Bold and center the title line
- Professional sign-off: "Sincerely," or "Best regards,"
- Include "Enclosure: Résumé" after signature line

## FINAL REQUIREMENTS
- Total word count: ${minWords}-${maxWords} words
- Replace all placeholders with actual information or omit if unknown
- Output only the final formatted cover letter
- No explanations, markdown formatting, or commentary
- Ensure letter fits on one page when printed
- Every paragraph should feel essential and impactful

Create a cover letter that would genuinely impress a hiring manager and distinguish this candidate from others.`

  try {
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.0-flash',
      generationConfig: {
        temperature: 0.7,
        topP: 0.8,
        maxOutputTokens: 2048,
      },
    })
    
    const result = await model.generateContent(prompt)
    const response = await result.response
    const content = response.text() || ''
    
    // Count words (approximate)
    const wordCount = content.trim().split(/\s+/).length
    
    return {
      content,
      wordCount,
      success: true
    }
  } catch (error) {
    console.error('Error generating cover letter with Gemini:', error)
    return {
      content: '',
      wordCount: 0,
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate cover letter'
    }
  }
}

// Helper function for batch processing
export async function generateMultipleCoverLetters(
  applications: Array<{ jobDescription: string; resumeText: string; config?: CoverLetterConfig }>
): Promise<CoverLetterResult[]> {
  const results: CoverLetterResult[] = []
  
  for (const app of applications) {
    try {
      const result = await generateCoverLetter(app.jobDescription, app.resumeText, app.config)
      results.push(result)
      
      // Add delay to respect API rate limits
      await new Promise(resolve => setTimeout(resolve, 1000))
    } catch (error) {
      results.push({
        content: '',
        wordCount: 0,
        success: false,
        error: error instanceof Error ? error.message : 'Generation failed'
      })
    }
  }
  
  return results
}

// Validation helper
export function validateInputs(jobDescription: string, resumeText: string): string[] {
  const errors: string[] = []
  
  if (!jobDescription.trim()) {
    errors.push('Job description is required')
  }
  
  if (!resumeText.trim()) {
    errors.push('Resume text is required')
  }
  
  if (jobDescription.length < 50) {
    errors.push('Job description appears too short (minimum 50 characters)')
  }
  
  if (resumeText.length < 100) {
    errors.push('Resume text appears too short (minimum 100 characters)')
  }
  
  return errors
}

// Utility function to verify data processing approach
export function getDataProcessingInfo(dataSource: 'scraped' | 'direct' | 'parsed_html'): string {
  const info = {
    scraped: 'Fresh HTML scraping → Real-time parsing → AI processing',
    parsed_html: 'Pre-scraped HTML → Just-in-time parsing → AI processing', 
    direct: 'Direct text input → No parsing needed → AI processing'
  }
  return info[dataSource]
}

export { genAI }