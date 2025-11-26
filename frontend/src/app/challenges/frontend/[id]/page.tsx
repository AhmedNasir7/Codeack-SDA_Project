'use client'
import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { authService } from '@/lib/authService'
import Navbar from '@/components/Navbar'

interface FrontendChallenge {
  id: number
  title: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  statement: string
  description: string
  techStack: string[]
  requirements: string[]
  preview?: string
}

export default function FrontendChallengeEditorPage() {
  const router = useRouter()
  const params = useParams()
  const challengeId = params.id as string
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [htmlCode, setHtmlCode] = useState('')
  const [cssCode, setCssCode] = useState('')
  const [jsCode, setJsCode] = useState('')
  const [activeTab, setActiveTab] = useState('html')

  const challenges: { [key: number]: FrontendChallenge } = {
    1: {
      id: 1,
      title: 'Frontend Challenge',
      difficulty: 'Easy',
      statement:
        'Build a responsive landing page for a freelance community using HTML, CSS and JavaScript.',
      description:
        'Create a modern, interactive landing page that showcases the key features of a freelance community platform.',
      techStack: ['HTML', 'CSS', 'JavaScript'],
      requirements: [
        'Strictly Responsive design',
        'Smooth scrolling navigation menu',
        'Interactive elements with hover effects',
        'Form validation on contact form',
        'Clean, semantic HTML structure',
        'Cross-browser compatibility',
      ],
    },
    2: {
      id: 2,
      title: 'E-Commerce Product Page',
      difficulty: 'Medium',
      statement: 'Build a product showcase page with interactive features.',
      description:
        'Create an interactive product page with image gallery, size selector, and add to cart functionality.',
      techStack: ['React', 'Tailwind CSS', 'JavaScript'],
      requirements: [
        'Image gallery with zoom feature',
        'Product size and color selection',
        'Add to cart functionality',
        'Product reviews section',
        'Related products section',
      ],
    },
    3: {
      id: 3,
      title: 'Dashboard UI',
      difficulty: 'Hard',
      statement: 'Build a comprehensive admin dashboard interface.',
      description:
        'Create a full-featured admin dashboard with charts, tables, and real-time data updates.',
      techStack: ['React', 'Next.js', 'TypeScript'],
      requirements: [
        'Responsive grid layout',
        'Data visualization with charts',
        'Interactive data tables',
        'Theme switcher',
        'Real-time notifications',
      ],
    },
  }

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      router.push('/login')
      return
    }

    const currentUser = authService.getUser()
    setUser(currentUser)

    const challenge = challenges[parseInt(challengeId)]
    if (challenge) {
      setHtmlCode(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${challenge.title}</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="container">
        <h1>Welcome</h1>
        <p>Your code here</p>
    </div>
</body>
</html>`)
    }

    setLoading(false)
  }, [router, challengeId])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  const challenge = challenges[parseInt(challengeId)]

  if (!challenge) {
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
              <h2 className="text-blue-400 font-bold text-lg mb-2">
                Project Description
              </h2>
              <p className="text-zinc-300 text-sm mb-4">
                Build a responsive landing page for a fictional company using
                only HTML, CSS, and vanilla JavaScript
              </p>
              <ul className="text-zinc-400 text-xs space-y-2 mb-4">
                <li className="flex items-start gap-2">
                  <span className="text-blue-400">•</span>
                  <span>Mobile-friendly responsive design</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400">•</span>
                  <span>Smooth scrolling navigation with sections</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400">•</span>
                  <span>
                    Interactive elements (buttons, hover effects, animations)
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400">•</span>
                  <span>Form validation for a contact form</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400">•</span>
                  <span>Clean, semantic HTML structure</span>
                </li>
              </ul>
              <h3 className="text-white font-bold text-sm mb-2">
                Requirements
              </h3>
              <p className="text-zinc-400 text-xs">
                Must be built entirely with pure HTML, CSS and vanilla
                JavaScript - no frameworks or libraries allowed.
              </p>
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
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded transition-colors mt-4">
              SUBMIT
            </button>
          </div>
        </div>

        {/* Right - Preview Sections */}
        <div className="w-1/2 border-l border-zinc-800 overflow-y-auto flex flex-col">
          <div className="p-6 space-y-6 flex-1">
            {/* Preview - Static */}
            <div className="border border-blue-600/80 rounded p-4 pointer-events-none">
              <h3 className="text-blue-400 font-bold text-center mb-4">
                Preview
              </h3>
              <div className="bg-zinc-900 rounded p-4 space-y-3">
                <div>
                  <label className="text-zinc-400 text-xs block mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    placeholder="Your Name"
                    className="w-full bg-zinc-800 text-white border border-zinc-700 rounded px-3 py-2 text-xs focus:outline-none focus:border-blue-500 cursor-not-allowed"
                    disabled
                  />
                </div>
                <div>
                  <label className="text-zinc-400 text-xs block mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="Email Address"
                    className="w-full bg-zinc-800 text-white border border-zinc-700 rounded px-3 py-2 text-xs focus:outline-none focus:border-blue-500 cursor-not-allowed"
                    disabled
                  />
                </div>
                <div>
                  <label className="text-zinc-400 text-xs block mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    placeholder="Password"
                    className="w-full bg-zinc-800 text-white border border-zinc-700 rounded px-3 py-2 text-xs focus:outline-none focus:border-blue-500 cursor-not-allowed"
                    disabled
                  />
                </div>
                <button
                  className="w-full bg-green-500 text-white font-bold py-2 rounded text-xs cursor-not-allowed opacity-75"
                  disabled
                >
                  GET STARTED
                </button>
              </div>
            </div>

            {/* Live Preview - Rendered */}
            <div className="border border-blue-600/80 rounded p-4 pointer-events-none">
              <h3 className="text-blue-400 font-bold text-center mb-4">
                Live Preview
              </h3>
              <div className="bg-zinc-900 rounded p-4">
                <div className="text-white text-center mb-4">
                  <h4 className="font-bold mb-3">Sign Up for Free</h4>
                </div>
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Your Name"
                    className="w-full bg-zinc-800 text-white border border-zinc-700 rounded px-3 py-2 text-xs focus:outline-none focus:border-green-500 cursor-not-allowed"
                    disabled
                  />
                  <input
                    type="email"
                    placeholder="Email Address"
                    className="w-full bg-zinc-800 text-white border border-zinc-700 rounded px-3 py-2 text-xs focus:outline-none focus:border-green-500 cursor-not-allowed"
                    disabled
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    className="w-full bg-zinc-800 text-white border border-zinc-700 rounded px-3 py-2 text-xs focus:outline-none focus:border-green-500 cursor-not-allowed"
                    disabled
                  />
                  <button
                    className="w-full bg-green-500 text-white font-bold py-2 rounded text-xs cursor-not-allowed opacity-75"
                    disabled
                  >
                    GET STARTED
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
