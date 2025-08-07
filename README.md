# Cover Letter Maker

An AI-powered web application that generates personalized cover letters using Google Gemini 2.5 Pro. Simply provide a job listing URL or paste the job description directly, upload your resume, and get a tailored cover letter in seconds.

## Features

- 🤖 AI-powered cover letter generation using Google Gemini 2.5 Pro
- 📄 Resume parsing (DOCX support)
- 🔍 Automatic job listing scraping from URLs
- ✍️ Manual job description input option
- ✏️ Edit and customize generated letters
- 💾 Copy to clipboard and download as text files
- 📱 Responsive design with consistent styling
- 🎨 Modern UI with professional navigation

## Tech Stack

- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **AI**: Google Gemini 2.5 Pro API
- **File Processing**: mammoth (DOCX), PDF support coming soon
- **Web Scraping**: Playwright, Cheerio
- **Deployment**: Optimized for Vercel

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Google Gemini API key

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/TinLeaves/cover-letter-maker.git
   cd cover-letter-maker
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```
   
   Add your Google Gemini API key to `.env.local`:
   ```
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. Install Playwright browsers (for web scraping):
   ```bash
   npx playwright install chromium
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. **Homepage**: 
   - Choose between entering a job URL or pasting the job description directly
   - Upload your resume (DOCX format)
   - Click "Generate Cover Letter"
2. **Parsing Page**: 
   - Watch as the system extracts information from the job listing and your resume
   - Automatic progress tracking with visual indicators
3. **Review Page**: 
   - Review the extracted job description and resume content
   - Edit the text directly if needed (especially if scraping was blocked)
   - Click "Generate Cover Letter"
4. **Result Page**: 
   - Review the generated cover letter
   - Edit directly in the interface if needed
   - Copy to clipboard or download as a text file

## API Endpoints

- `POST /api/parse-data` - Parses resume files and scrapes job listings 
- `POST /api/generate-letter-from-text` - Generates cover letters from parsed text
- `POST /api/generate-letter` - Legacy endpoint that generates cover letters directly
- `POST /api/parse-resume` - Parses resume files to extract text
- `POST /api/scrape-job` - Scrapes job listings from URLs

## Project Structure

```
src/
├── app/
│   ├── api/           # API routes
│   ├── how-it-works/  # How it works page
│   ├── parsing/       # Data parsing progress page
│   ├── review/        # Review parsed data page
│   ├── result/        # Result page with editing capabilities
│   ├── upload-resume/ # Legacy resume upload page
│   └── page.tsx       # Homepage with integrated form
├── components/
│   ├── layout/        # App layout and header components
│   ├── ui/            # Reusable UI components (Button, Input, etc.)
│   └── cover-letter/  # Cover letter specific components
├── lib/               # Utility functions
│   ├── gemini.ts      # Google Gemini AI integration
│   ├── job-scraper.ts # Web scraping logic
│   ├── haptics.ts     # Mobile haptic feedback
│   └── utils.ts       # General utilities
└── types/             # TypeScript type definitions
```

## Deployment

This app is optimized for deployment on Vercel:

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add your `GEMINI_API_KEY` environment variable in Vercel settings
4. Deploy!

## Environment Variables

- `GEMINI_API_KEY`: Your Google Gemini API key for AI-powered cover letter generation
- `PROXY_URL`: (Optional) Proxy server URL to bypass IP blocks (format: `http://proxy:port` or `http://username:password@proxy:port`)

## Troubleshooting

### Job Scraping Issues

If you encounter "Request Blocked" or Cloudflare errors when scraping job listings:

1. **Use a Proxy**: Set the `PROXY_URL` environment variable with a proxy server
2. **Try Different URLs**: Some job sites have better bot protection than others
3. **Manual Input**: You can always manually copy/paste the job description on the review page
4. **Rate Limiting**: Wait a few minutes between requests to avoid triggering anti-bot measures

The app includes multiple anti-detection features:
- **User Agent Rotation**: Randomly rotates browser user agents
- **Multiple Browser Engines**: Uses Chrome, Firefox, and Safari engines
- **Human-like Behavior**: Adds random delays and scrolling
- **Retry Logic**: Automatically retries with exponential backoff
- **Proxy Support**: Routes traffic through proxy servers

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Support

If you encounter any issues or have questions, please open an issue on GitHub.