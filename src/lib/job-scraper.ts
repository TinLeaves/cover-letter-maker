import { chromium } from 'playwright'
import * as cheerio from 'cheerio'

// Random delay function
const randomDelay = (min: number, max: number) => 
  Math.floor(Math.random() * (max - min + 1)) + min

// Enhanced user agents for better rotation
const ENHANCED_USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36'
]

export async function scrapeJobListing(url: string): Promise<string> {
  let browser = null
  let retryCount = 0
  const maxRetries = 3

  while (retryCount < maxRetries) {
    try {
      // Browser launch args with enhanced anti-detection
      const launchArgs = [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu',
        '--disable-features=VizDisplayCompositor',
        '--disable-web-security',
        '--disable-features=site-per-process'
      ]

      // Add proxy if environment variable is set
      if (process.env.PROXY_URL) {
        launchArgs.push(`--proxy-server=${process.env.PROXY_URL}`)
      }

      // Launch browser with enhanced stealth settings
      browser = await chromium.launch({ 
        headless: true,
        args: [...launchArgs, 
          '--disable-blink-features=AutomationControlled',
          '--disable-features=VizDisplayCompositor',
        ]
      })

      // Create context with randomized settings
      const viewportOptions = [
        { width: 1920, height: 1080 },
        { width: 1366, height: 768 },
        { width: 1440, height: 900 },
        { width: 1280, height: 720 }
      ]
      const randomViewport = viewportOptions[Math.floor(Math.random() * viewportOptions.length)]
      
      const context = await browser.newContext({
        userAgent: ENHANCED_USER_AGENTS[Math.floor(Math.random() * ENHANCED_USER_AGENTS.length)],
        viewport: randomViewport,
        locale: 'en-US',
        timezoneId: 'America/New_York',
        permissions: ['geolocation'],
        geolocation: { longitude: -74.0, latitude: 40.7 }, // New York coordinates
        colorScheme: 'light'
      })

      const page = await context.newPage()

      // Hide automation indicators
      await page.addInitScript(() => {
        // Remove webdriver property
        delete (window as unknown as { navigator: { webdriver?: boolean } }).navigator.webdriver;
        
        // Override plugins length
        Object.defineProperty(window.navigator, 'plugins', {
          get: () => [1, 2, 3, 4, 5]
        });
        
        // Override languages
        Object.defineProperty(window.navigator, 'languages', {
          get: () => ['en-US', 'en']
        });
        
        // Mock chrome object
        (window as unknown as { chrome?: { runtime: object } }).chrome = {
          runtime: {},
        };
      });

      // Set additional headers to appear more legitimate
      await page.setExtraHTTPHeaders({
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'DNT': '1',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Cache-Control': 'max-age=0',
        'sec-ch-ua': '"Google Chrome";v="120", "Chromium";v="120", "Not?A_Brand";v="24"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"'
      })

      // Add random delay before navigation
      await page.waitForTimeout(randomDelay(1000, 3000))

      // Navigate to the page
      await page.goto(url, { 
        waitUntil: 'networkidle',
        timeout: 30000
      })

      // Enhanced human-like behavior simulation
      await page.waitForTimeout(randomDelay(2000, 4000))
      
      // Simulate more realistic human scrolling patterns
      await page.evaluate(() => {
        // Random scroll down
        const scrollAmount = Math.floor(Math.random() * 800) + 200
        window.scrollTo({ top: scrollAmount, behavior: 'smooth' })
      })
      
      await page.waitForTimeout(randomDelay(1500, 3000))
      
      // Sometimes scroll up a bit (human-like behavior)
      if (Math.random() > 0.7) {
        await page.evaluate(() => {
          const currentScroll = window.pageYOffset
          const scrollBack = Math.floor(Math.random() * 200) + 50
          window.scrollTo({ top: Math.max(0, currentScroll - scrollBack), behavior: 'smooth' })
        })
        await page.waitForTimeout(randomDelay(800, 1500))
      }
      
      // Random mouse movements (simulate human presence)
      await page.mouse.move(
        Math.floor(Math.random() * 800) + 100,
        Math.floor(Math.random() * 600) + 100
      )
      
      await page.waitForTimeout(randomDelay(1000, 2000))

      const content = await page.content()
      await browser.close()
      
      // Check if we got blocked
      if (content.includes('blocked') || content.includes('cloudflare') || content.includes('Ray ID')) {
        throw new Error('Blocked by anti-bot protection')
      }
    
      const $ = cheerio.load(content)
      
      // Remove script and style elements
      $('script, style, nav, header, footer').remove()
      
      // Try to find job-specific content
      let jobText = ''
      
      // Common selectors for job listings
      const selectors = [
        '[class*="job"]',
        '[class*="description"]',
        '[class*="detail"]',
        '[id*="job"]',
        '[id*="description"]',
        'main',
        '.content',
        '#content'
      ]
      
      for (const selector of selectors) {
        const element = $(selector)
        if (element.length > 0) {
          const text = element.text().trim()
          if (text.length > jobText.length) {
            jobText = text
          }
        }
      }
      
      // Fallback to body text if no specific selectors work
      if (!jobText || jobText.length < 100) {
        jobText = $('body').text().trim()
      }
      
      // Clean up the text
      jobText = jobText
        .replace(/\s+/g, ' ')
        .replace(/\n+/g, '\n')
        .trim()
      
      // If we got meaningful content, return it
      if (jobText.length > 50) {
        return jobText
      } else {
        throw new Error('No meaningful content extracted')
      }
      
    } catch (error) {
      console.error(`Scraping attempt ${retryCount + 1} failed:`, error)
      
      if (browser) {
        try {
          await browser.close()
        } catch (closeError) {
          console.error('Error closing browser:', closeError)
        }
      }
      
      retryCount++
      
      // If this was the last retry, provide a more helpful error
      if (retryCount >= maxRetries) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        
        if (errorMessage.includes('blocked') || errorMessage.includes('cloudflare')) {
          throw new Error('Unable to access the job listing due to anti-bot protection. Please try copying and pasting the job description manually on the review page.')
        }
        
        throw new Error(`Failed to scrape job listing after ${maxRetries} attempts. Please try copying and pasting the job description manually.`)
      }
      
      // Enhanced exponential backoff with randomization
      const baseDelay = Math.pow(2, retryCount) * 1000
      const jitter = randomDelay(500, 2000)
      const delay = baseDelay + jitter
      console.log(`Waiting ${delay}ms before retry ${retryCount + 1}`)
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }
  
  // This should never be reached, but TypeScript requires it
  throw new Error('Unexpected error in scraping logic')
}