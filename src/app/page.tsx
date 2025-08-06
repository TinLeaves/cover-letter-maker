import Link from 'next/link'

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Cover Letter Maker
        </h1>
        
        <p className="text-xl text-gray-600 mb-8 leading-relaxed">
          Generate personalized cover letters in seconds using AI. 
          Enter a job URL, upload your resume, and let our AI create 
          a tailored cover letter that highlights your relevant experience.
        </p>
        
        <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            How it works
          </h2>
          
          <div className="grid md:grid-cols-6 gap-3">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-14 h-14 flex items-center justify-center mx-auto mb-3">
                <span className="text-lg font-bold text-blue-600">1</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2 text-sm">Job URL</h3>
              <p className="text-gray-600 text-xs">Enter job listing URL</p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 rounded-full w-14 h-14 flex items-center justify-center mx-auto mb-3">
                <span className="text-lg font-bold text-green-600">2</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2 text-sm">Upload Resume</h3>
              <p className="text-gray-600 text-xs">Upload DOCX file</p>
            </div>
            
            <div className="text-center">
              <div className="bg-indigo-100 rounded-full w-14 h-14 flex items-center justify-center mx-auto mb-3">
                <span className="text-lg font-bold text-indigo-600">3</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2 text-sm">Parse Data</h3>
              <p className="text-gray-600 text-xs">AI extracts information</p>
            </div>
            
            <div className="text-center">
              <div className="bg-amber-100 rounded-full w-14 h-14 flex items-center justify-center mx-auto mb-3">
                <span className="text-lg font-bold text-amber-600">4</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2 text-sm">Review & Edit</h3>
              <p className="text-gray-600 text-xs">Verify extracted data</p>
            </div>
            
            <div className="text-center">
              <div className="bg-teal-100 rounded-full w-14 h-14 flex items-center justify-center mx-auto mb-3">
                <span className="text-lg font-bold text-teal-600">5</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2 text-sm">Generate</h3>
              <p className="text-gray-600 text-xs">AI creates letter</p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-14 h-14 flex items-center justify-center mx-auto mb-3">
                <span className="text-lg font-bold text-purple-600">6</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2 text-sm">Download</h3>
              <p className="text-gray-600 text-xs">Get your letter</p>
            </div>
          </div>
        </div>
        
        <Link 
          href="/job-url"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-lg text-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
        >
          Get Started
        </Link>
        
        <div className="mt-12 text-sm text-gray-500">
          Powered by Google Gemini 2.5 Pro • Fast • Secure • Free
        </div>
      </div>
    </div>
  )
}