import { Header } from './header'
import { SkipLinks } from '@/components/ui'

interface AppLayoutProps {
  children: React.ReactNode
  showHeader?: boolean
  className?: string
}

export function AppLayout({ 
  children, 
  showHeader = true, 
  className = "" 
}: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-neutral-50">
      <SkipLinks />
      {showHeader && <Header />}
      <main id="main-content" className={className} role="main">
        {children}
      </main>
    </div>
  )
}