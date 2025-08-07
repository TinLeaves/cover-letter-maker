import Link from 'next/link'
import { AppLayout } from '@/components/layout'
import { Button } from '@/components/ui'
import { HiOutlineLink, HiOutlineCloudUpload, HiOutlineCheckCircle, HiArrowRight } from 'react-icons/hi'

export default function HowItWorksPage() {
  return (
    <AppLayout>
      {/* Combined Section - Fits in One Viewport */}
      <section className="relative overflow-hidden bg-gradient-to-br from-white via-neutral-50 to-primary-50 min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="absolute inset-0 opacity-40" style={{
          backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fillRule=\"evenodd\"%3E%3Cg fill=\"%239C92AC\" fillOpacity=\"0.05\"%3E%3Ccircle cx=\"30\" cy=\"30\" r=\"2\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')"
        }} />
        
        <div className="relative container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl lg:text-5xl font-bold text-neutral-900 mb-4 animate-slide-up text-balance">
                Tired of Writing Multiple Cover Letters?
              </h1>
              
              <p className="text-lg lg:text-xl text-neutral-600 leading-relaxed max-w-2xl mx-auto animate-slide-up text-balance">
                Generate personalized cover letters for each job application in seconds
              </p>
            </div>

            {/* Steps */}
            <div className="grid lg:grid-cols-3 gap-6 mb-10">
              {[
                {
                  step: '01',
                  title: 'Add Job Details',
                  description: 'Paste the job URL or description. Our AI analyzes requirements and company culture.',
                  icon: <HiOutlineLink className="w-6 h-6" />,
                  color: 'primary'
                },
                {
                  step: '02', 
                  title: 'Upload Resume',
                  description: 'Upload your resume in any format. We extract your experience and achievements automatically.',
                  icon: <HiOutlineCloudUpload className="w-6 h-6" />,
                  color: 'secondary'
                },
                {
                  step: '03',
                  title: 'Get Your Letter',
                  description: 'Receive a personalized, professional cover letter optimized for the specific role.',
                  icon: <HiOutlineCheckCircle className="w-6 h-6" />,
                  color: 'success'
                }
              ].map((item, index) => (
                <div key={index} className="relative group">
                  <div className="bg-white rounded-2xl p-6 shadow-soft hover:shadow-medium transition-all duration-300 border border-neutral-100 h-full">
                    <div className={`w-12 h-12 rounded-xl bg-${item.color}-100 flex items-center justify-center text-${item.color}-600 mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      {item.icon}
                    </div>
                    
                    <div className={`text-${item.color}-600 font-mono text-xs font-semibold mb-2`}>
                      STEP {item.step}
                    </div>
                    
                    <h3 className="text-xl font-bold text-neutral-900 mb-3">
                      {item.title}
                    </h3>
                    
                    <p className="text-neutral-600 text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                  
                  {index < 2 && (
                    <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-0.5 bg-neutral-300" />
                  )}
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <div className="text-center">
              <Button asChild size="lg">
                <Link href="/">
                  Start Creating Now
                  <HiArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

    </AppLayout>
  )
}