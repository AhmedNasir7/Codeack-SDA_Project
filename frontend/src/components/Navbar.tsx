'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { authService } from '@/lib/authService'
import { useEffect, useState } from 'react'

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  // Check authentication status on mount and update
  useEffect(() => {
    const checkAuth = () => {
      if (authService.isAuthenticated()) {
        const currentUser = authService.getUser()
        setUser(currentUser)
      } else {
        setUser(null)
      }
      setLoading(false)
    }

    checkAuth()
  }, [pathname])

  const handleLogout = () => {
    authService.logout()
    setUser(null)
    router.push('/login')
  }

  const isActive = (path: string) => pathname === path

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/challenges', label: 'Challenges' },
    { href: '/problems', label: 'Problems' },
    { href: '/profile', label: 'Profile' },
  ]

  if (loading) {
    return null
  }

  // Not authenticated - show login/signup navbar
  if (!user) {
    return (
      <nav className="bg-[#000D1D] px-6 py-8 border-b border-zinc-800">
        <div className="flex items-center justify-between max-w-screen mx-auto">
          <Link href="/" className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="Codeack"
              className="w-32"
              suppressHydrationWarning
            />
          </Link>
          <div className="flex items-center gap-10">
            <Link
              href="/"
              className={`text-md hover:text-zinc-300 transition-colors ${
                isActive('/') ? 'text-white font-semibold' : 'text-zinc-400'
              }`}
            >
              Home
            </Link>
            <Link
              href="/login"
              className="text-md text-zinc-400 hover:text-zinc-300 transition-colors"
            >
              Challenges
            </Link>
            <Link
              href="/login"
              className="text-md text-zinc-400 hover:text-zinc-300 transition-colors"
            >
              Problems
            </Link>
            <Link
              href="/login"
              className="text-md text-zinc-400 hover:text-zinc-300 transition-colors"
            >
              Profile
            </Link>
            <Link
              href="/login"
              className="text-md text-zinc-400 hover:text-white font-semibold transition-colors px-4 py-1 border border-zinc-600 rounded"
            >
              Login
            </Link>
          </div>
        </div>
      </nav>
    )
  }

  // Authenticated - show full navbar
  return (
    <nav className="bg-[#000D1D] px-6 py-4 border-b border-zinc-800">
      <div className="flex items-center justify-between max-w-screen mx-auto">
        <Link href="/" className="flex items-center gap-3">
          <img
            src="/logo.png"
            alt="Codeack"
            className="w-32"
            suppressHydrationWarning
          />
        </Link>
        <div className="flex items-center gap-10">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm transition-colors ${
                isActive(link.href)
                  ? 'text-white font-semibold border-b-2 border-blue-500'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              {link.label}
            </Link>
          ))}

          <button
            onClick={handleLogout}
            className="bg-black hover:bg-gray-900 text-white px-4 py-2 rounded text-sm font-semibold transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  )
}
