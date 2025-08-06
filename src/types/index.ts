export interface CoverLetterRequest {
  jobUrl: string
  resumeFile: File
}

export interface CoverLetterResponse {
  coverLetter: string
}

export interface ParseResumeResponse {
  resumeText: string
}

export interface ScrapeJobResponse {
  jobDescription: string
}

export interface ParseDataResponse {
  resumeText: string
  jobDescription: string
  jobUrl: string
  resumeFileName: string
}

export interface GenerateFromTextRequest {
  jobDescription: string
  resumeText: string
}

export interface ApiError {
  error: string
}