'use client'

import Navbar from '@/components/Navbar'

export default function DashboardPlaceholder() {
  return (
    <main className="min-h-screen bg-[#0a0e27] text-white">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 py-16 text-center space-y-4">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-zinc-400">
          This space is reserved for the upcoming personalized dashboard
          experience. Stay tuned!
        </p>
      </div>
    </main>
  )
}

