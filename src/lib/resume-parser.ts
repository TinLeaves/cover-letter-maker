import mammoth from 'mammoth'

export async function parseResume(file: Buffer, mimeType: string): Promise<string> {
  try {
    if (mimeType === 'application/pdf') {
      // For MVP: PDF parsing is not implemented yet
      // Users should convert their PDF to DOCX or paste text manually
      throw new Error('PDF parsing is not yet supported. Please upload a DOCX file or convert your PDF to DOCX format.')
    } else if (mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      const result = await mammoth.extractRawText({ buffer: file })
      return result.value
    } else {
      throw new Error('Unsupported file type. Please upload a DOCX file.')
    }
  } catch (error) {
    console.error('Error parsing resume:', error)
    throw error instanceof Error ? error : new Error('Failed to parse resume file')
  }
}