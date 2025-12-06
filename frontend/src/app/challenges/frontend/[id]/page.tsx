'use client'
import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { authService } from '@/lib/authService'
import Navbar from '@/components/Navbar'
import Loading from '@/components/Loading'

interface Challenge {
  challenge_id: number
  title: string
  description: string
  difficulty: string
  allowed_languages?: string[]
}

interface FrontendChallenge {
  frontend_id: number
  challenge_id: number
  design_mockup_url?: string
  design_template?: string
  required_technologies?: string[]
}

export default function FrontendChallengeEditorPage() {
  const router = useRouter()
  const params = useParams()
  const challengeId = params.id as string
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [challenge, setChallenge] = useState<Challenge | null>(null)
  const [frontendChallenge, setFrontendChallenge] =
    useState<FrontendChallenge | null>(null)
  const [htmlCode, setHtmlCode] = useState('')
  const [cssCode, setCssCode] = useState('')
  const [jsCode, setJsCode] = useState('')
  const [activeTab, setActiveTab] = useState('html')
  const [previewDoc, setPreviewDoc] = useState('')
  const [templatePreviewDoc, setTemplatePreviewDoc] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [matchPercentage, setMatchPercentage] = useState(0)
  const [templateHtml, setTemplateHtml] = useState('')
  const [templateCss, setTemplateCss] = useState('')

  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

  const getChallengeMetadata = (frontend_id: number) => {
    const metadata: {
      [key: number]: { title: string; description: string; difficulty: string }
    } = {
      1: {
        title: 'Responsive Landing Page',
        description:
          'Build a responsive landing page with navigation, hero section, and features grid',
        difficulty: 'Easy',
      },
      2: {
        title: 'Interactive Form with Validation',
        description:
          'Create a form with real-time validation and error messages',
        difficulty: 'Medium',
      },
      3: {
        title: 'Image Gallery with Lightbox',
        description: 'Build a responsive image gallery with a lightbox modal',
        difficulty: 'Medium',
      },
      4: {
        title: 'Todo App with Local Storage',
        description:
          'Create a todo app that saves data to browser local storage',
        difficulty: 'Hard',
      },
    }
    return (
      metadata[frontend_id] || {
        title: 'Challenge',
        description: '',
        difficulty: 'Easy',
      }
    )
  }
  const extractTemplateCode = (template: string) => {
    try {
      // Extract CSS from <style> tag
      const styleMatch = template.match(/<style[^>]*>([\s\S]*?)<\/style>/i)
      const css = styleMatch ? styleMatch[1].trim() : ''

      // Extract JS from <script> tag
      const scriptMatch = template.match(/<script[^>]*>([\s\S]*?)<\/script>/i)
      const js = scriptMatch ? scriptMatch[1].trim() : ''

      // Extract HTML body content
      const bodyMatch = template.match(/<body[^>]*>([\s\S]*?)<\/body>/i)
      const html = bodyMatch ? bodyMatch[1].trim() : template

      return { html, css, js }
    } catch (error) {
      return { html: '', css: '', js: '' }
    }
  }

  // Calculate match percentage between user code and template
  const calculateMatchPercentage = (
    userHtml: string,
    userCss: string,
    userJs: string,
    template: string,
  ) => {
    const {
      html: templateHtml,
      css: templateCss,
      js: templateJs,
    } = extractTemplateCode(template)

    if (!templateHtml && !templateCss && !templateJs) {
      return 0
    }

    // Normalize strings
    const normalize = (str: string) =>
      str.replace(/\s+/g, ' ').trim().toLowerCase()

    // Normalize and compare HTML
    const userHtmlNorm = normalize(userHtml)
    const templateHtmlNorm = normalize(templateHtml)
    const htmlMatch = userHtmlNorm === templateHtmlNorm ? 100 : 0

    // Normalize and compare CSS
    const userCssNorm = normalize(userCss)
    const templateCssNorm = normalize(templateCss)
    const cssMatch = userCssNorm === templateCssNorm ? 100 : 0

    // Normalize and compare JS
    const userJsNorm = normalize(userJs)
    const templateJsNorm = normalize(templateJs)
    const jsMatch = userJsNorm === templateJsNorm ? 100 : 0

    // Average the matches (only count non-empty template sections)
    const matchCount =
      (templateHtml ? 1 : 0) + (templateCss ? 1 : 0) + (templateJs ? 1 : 0)
    const totalMatch =
      (htmlMatch * (templateHtml ? 1 : 0) +
        cssMatch * (templateCss ? 1 : 0) +
        jsMatch * (templateJs ? 1 : 0)) /
      (matchCount || 1)

    return Math.round(totalMatch)
  }

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      router.push('/login')
      return
    }

    const currentUser = authService.getUser()
    setUser(currentUser)

    const fetchData = async () => {
      try {
        // Fetch frontend challenge details by challenge_id (the URL parameter)
        const frontendResponse = await fetch(
          `${API_BASE_URL}/frontend-challenge/challenge/${challengeId}`,
        )

        if (!frontendResponse.ok) {
          setLoading(false)
          return
        }
        const frontendData = await frontendResponse.json()
        setFrontendChallenge(frontendData)

        // Use template for reference preview
        if (frontendData.design_template) {
          setTemplatePreviewDoc(frontendData.design_template)
          // Extract template parts for matching
          const { html, css } = extractTemplateCode(
            frontendData.design_template,
          )
          setTemplateHtml(html)
          setTemplateCss(css)
        }

        // Set default code - empty editors for user to write from scratch
        const defaultHtml = `<!-- Write your HTML here -->`
        const defaultCss = `/* Write your CSS here */`
        const defaultJs = `// Write your JavaScript here`

        setHtmlCode(defaultHtml)
        setCssCode(defaultCss)
        setJsCode(defaultJs)

        setLoading(false)
      } catch (error) {
        setLoading(false)
      }
    }

    fetchData()
  }, [router, challengeId])

  // Build and update preview document from editor state
  useEffect(() => {
    let mounted = true
    const buildDoc = () => {
      const doc = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>${cssCode}</style></head><body>${htmlCode}<script>try{${jsCode}}catch(e){console.error(e)}</script></body></html>`
      if (mounted) setPreviewDoc(doc)
    }
    const timer = setTimeout(buildDoc, 300)
    return () => {
      mounted = false
      clearTimeout(timer)
    }
  }, [htmlCode, cssCode, jsCode])

  // Calculate match percentage between user code and template
  useEffect(() => {
    if (templatePreviewDoc) {
      const match = calculateMatchPercentage(
        htmlCode,
        cssCode,
        jsCode,
        templatePreviewDoc,
      )
      setMatchPercentage(match)
    }
  }, [htmlCode, cssCode, jsCode, templatePreviewDoc])

  const handleSubmit = async () => {
    try {
      // Check if code matches template 100%
      if (matchPercentage !== 100) {
        alert(
          `Your code must match the template 100%. Current match: ${matchPercentage}%`,
        )
        return
      }

      const userId = authService.getDbUserId()
      const portfolioId = authService.getPortfolioId()

      if (!userId || !frontendChallenge) {
        return
      }

      // Save frontend challenge submission
      const submissionResponse = await fetch(
        `${API_BASE_URL}/user-submissions`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_id: userId,
            challenge_id: parseInt(challengeId),
            code_content: JSON.stringify({
              html: htmlCode,
              css: cssCode,
              js: jsCode,
            }),
            language: 'html',
            score: 100,
            execution_time: 0,
            memory_used: 0,
          }),
        },
      )

      if (submissionResponse.status >= 200 && submissionResponse.status < 300) {
        setSubmitted(true)

        // Update portfolio
        if (portfolioId) {
          await fetch(
            `${API_BASE_URL}/portfolio/${portfolioId}/increment-solved`,
            {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ increment: 1 }),
            },
          )
        }
      }
    } catch (error) {
      // Error handling
    }
  }

  if (loading) {
    return <Loading />
  }

  if (!frontendChallenge) {
    return (
      <main className="min-h-screen bg-linear-to-b from-[#0a0e27] via-[#0d1117] to-[#0a0e27] text-white">
        <Navbar />
        <section className="px-6 py-12">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-3xl font-bold">Challenge not found</h1>
            <button
              onClick={() => router.back()}
              className="mt-6 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors"
            >
              Go Back
            </button>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-linear-to-b from-[#0a0e27] via-[#0d1117] to-[#0a0e27] text-white">
      <Navbar />

      <div className="flex h-[calc(100vh-80px)]">
        {/* Left - Project Description & Code Editors */}
        <div className="w-1/2 border-r border-zinc-800 overflow-y-auto flex flex-col">
          {/* Project Description */}
          <div className="p-6 border-b border-zinc-800">
            <div className="border border-blue-600/80 rounded p-4">
              {frontendChallenge && (
                <>
                  {(() => {
                    const metadata = getChallengeMetadata(
                      frontendChallenge.frontend_id,
                    )
                    return (
                      <>
                        <h2 className="text-blue-400 font-bold text-lg mb-2">
                          {metadata.title}
                        </h2>
                        <p className="text-zinc-300 text-sm mb-4">
                          {metadata.description}
                        </p>
                        <div className="mb-4">
                          <span
                            className={`px-3 py-1 rounded text-xs font-medium ${
                              metadata.difficulty === 'Easy'
                                ? 'bg-green-900/30 text-green-400'
                                : metadata.difficulty === 'Medium'
                                  ? 'bg-yellow-900/30 text-yellow-400'
                                  : 'bg-red-900/30 text-red-400'
                            }`}
                          >
                            {metadata.difficulty}
                          </span>
                        </div>
                      </>
                    )
                  })()}
                </>
              )}
              {frontendChallenge?.required_technologies && (
                <div className="mb-4">
                  <h3 className="text-white font-bold text-sm mb-2">
                    Required Technologies
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {frontendChallenge.required_technologies.map(
                      (tech, idx) => (
                        <span
                          key={idx}
                          className="bg-blue-900/30 text-blue-400 text-xs px-2 py-1 rounded"
                        >
                          {tech}
                        </span>
                      ),
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Code Editor with Tabs */}
          <div className="flex-1 flex flex-col p-6">
            {/* Tab Headers */}
            <div className="flex gap-2 mb-4 border-b border-zinc-800 pb-2 items-end justify-end">
              <button
                onClick={() => setActiveTab('html')}
                className={`px-4 py-2 rounded font-medium text-sm transition-colors ${
                  activeTab === 'html'
                    ? 'bg-blue-600 text-white'
                    : 'bg-zinc-800 text-zinc-400 hover:text-white'
                }`}
              >
                HTML
              </button>
              <button
                onClick={() => setActiveTab('css')}
                className={`px-4 py-2 rounded font-medium text-sm transition-colors ${
                  activeTab === 'css'
                    ? 'bg-blue-600 text-white'
                    : 'bg-zinc-800 text-zinc-400 hover:text-white'
                }`}
              >
                CSS
              </button>
              <button
                onClick={() => setActiveTab('js')}
                className={`px-4 py-2 rounded font-medium text-sm transition-colors ${
                  activeTab === 'js'
                    ? 'bg-blue-600 text-white'
                    : 'bg-zinc-800 text-zinc-400 hover:text-white'
                }`}
              >
                JS
              </button>
            </div>

            {/* Code Editor Area */}
            <div className="flex-1 border border-blue-600/50 rounded overflow-hidden flex flex-col">
              <div className="flex flex-1 overflow-hidden">
                {/* Line Numbers */}
                <div className="bg-blue-950/20 border-r border-blue-900/50 px-3 py-4 text-right text-zinc-500 font-mono text-xs overflow-hidden select-none">
                  {activeTab === 'html' &&
                    [...Array(13)].map((_, i) => (
                      <div key={i} className="leading-6">
                        {i + 1}
                      </div>
                    ))}
                  {activeTab === 'css' &&
                    [...Array(10)].map((_, i) => (
                      <div key={i} className="leading-6">
                        {i + 1}
                      </div>
                    ))}
                  {activeTab === 'js' &&
                    [...Array(8)].map((_, i) => (
                      <div key={i} className="leading-6">
                        {i + 1}
                      </div>
                    ))}
                </div>
                {/* Code Textarea */}
                {activeTab === 'html' && (
                  <textarea
                    value={htmlCode}
                    onChange={(e) => setHtmlCode(e.target.value)}
                    className="flex-1 bg-blue-950/30 text-green-400 font-mono text-xs p-4 resize-none focus:outline-none"
                    style={{ lineHeight: '1.5' }}
                    placeholder="&lt;!DOCTYPE html&gt;"
                  />
                )}
                {activeTab === 'css' && (
                  <textarea
                    value={cssCode}
                    onChange={(e) => setCssCode(e.target.value)}
                    className="flex-1 bg-blue-950/30 text-blue-300 font-mono text-xs p-4 resize-none focus:outline-none"
                    style={{ lineHeight: '1.5' }}
                    placeholder="/* CSS Code */"
                  />
                )}
                {activeTab === 'js' && (
                  <textarea
                    value={jsCode}
                    onChange={(e) => setJsCode(e.target.value)}
                    className="flex-1 bg-blue-950/30 text-yellow-300 font-mono text-xs p-4 resize-none focus:outline-none"
                    style={{ lineHeight: '1.5' }}
                    placeholder="// JavaScript Code"
                  />
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-zinc-400">Code Match</span>
                    <span
                      className={`text-sm font-bold ${
                        matchPercentage === 100
                          ? 'text-green-400'
                          : 'text-yellow-400'
                      }`}
                    >
                      {matchPercentage}%
                    </span>
                  </div>
                  <div className="w-full bg-zinc-800 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        matchPercentage === 100
                          ? 'bg-green-500'
                          : 'bg-yellow-500'
                      }`}
                      style={{ width: `${matchPercentage}%` }}
                    />
                  </div>
                </div>
              </div>
              <button
                onClick={handleSubmit}
                disabled={submitted || matchPercentage !== 100}
                className={`w-full font-bold py-3 rounded transition-colors ${
                  submitted
                    ? 'bg-green-600 hover:bg-green-600 text-white'
                    : matchPercentage === 100
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-zinc-700 cursor-not-allowed text-zinc-400'
                }`}
              >
                {submitted
                  ? 'SUBMITTED ✓'
                  : matchPercentage === 100
                    ? 'SUBMIT'
                    : `SUBMIT (${matchPercentage}% match required)`}
              </button>
            </div>
          </div>
        </div>

        {/* Right - Preview Sections */}
        <div className="w-1/2 border-l border-zinc-800 overflow-y-auto flex flex-col">
          <div className="p-6 space-y-6 flex-1">
            {/* Preview - Template Reference */}
            <div className="border border-blue-600/80 rounded p-4">
              <h3 className="text-blue-400 font-bold text-center mb-4">
                Reference Design
              </h3>
              <div className="bg-zinc-900 rounded p-4 min-h-[300px]">
                {templatePreviewDoc ? (
                  <iframe
                    title="template-preview"
                    srcDoc={`<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>body { font-family: system-ui, Segoe UI, Roboto, Arial; padding: 20px; background: #f7f9fc; margin: 0; }${templateCss}</style></head><body>${templateHtml}</body></html>`}
                    sandbox="allow-scripts allow-forms"
                    className="w-full h-[300px] bg-white rounded border border-zinc-700"
                  />
                ) : (
                  <p className="text-zinc-400 text-sm text-center py-12">
                    No template provided for this challenge
                  </p>
                )}
              </div>
            </div>

            {/* Live Preview - Rendered with iframe */}
            <div className="border border-blue-600/80 rounded p-4">
              <h3 className="text-blue-400 font-bold text-center mb-4">
                Live Preview
              </h3>
              <div className="bg-zinc-900 rounded p-4 min-h-[400px]">
                <iframe
                  title="live-preview"
                  srcDoc={previewDoc}
                  sandbox="allow-scripts allow-forms"
                  className="w-full h-[400px] bg-white rounded border border-zinc-700"
                  style={{ display: previewDoc ? 'block' : 'none' }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
