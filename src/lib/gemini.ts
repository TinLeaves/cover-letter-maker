import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function generateCoverLetter(jobDescription: string, resumeText: string): Promise<string> {
  const prompt = `You are a professional cover letter writer. Create a personalized cover letter based on the job description and resume provided.

Job Description:
${jobDescription}

Resume:
${resumeText}

Please write a professional cover letter that:
1. Is addressed generically (use "Dear Hiring Manager" if no specific contact is provided)
2. Highlights relevant experience from the resume that matches the job requirements
3. Shows enthusiasm for the role and company
4. Is concise and professional (3-4 paragraphs)
5. Includes a strong opening and closing

Format the letter as a standard business letter with proper spacing.`

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })
    const result = await model.generateContent(prompt)
    const response = await result.response
    return response.text() || ''
  } catch (error) {
    console.error('Error generating cover letter with Gemini:', error)
    throw new Error('Failed to generate cover letter')
  }
}

export { genAI }