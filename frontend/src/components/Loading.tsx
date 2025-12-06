'use client'

export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#000D1D]">
      <div className="flex flex-col items-center gap-6">
        {/* Animated Spinner */}
        <div className="relative w-16 h-16">
          {/* Outer rotating ring */}
          <div className="absolute inset-0 border-4 border-transparent border-t-blue-500 border-r-blue-500 rounded-full animate-spin"></div>

          {/* Middle rotating ring - slower */}
          <div
            className="absolute inset-2 border-4 border-transparent border-b-purple-500 border-l-purple-500 rounded-full animate-spin"
            style={{
              animationDirection: 'reverse',
              animationDuration: '1.5s',
            }}
          ></div>

          {/* Inner pulsing dot */}
          <div className="absolute inset-6 bg-linear-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
        </div>

        {/* Loading Text */}
        <div className="text-center">
          <h2 className="text-xl font-semibold text-white mb-2">Loading</h2>
          <div className="flex gap-1 justify-center">
            <span
              className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
              style={{ animationDelay: '0s' }}
            ></span>
            <span
              className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
              style={{ animationDelay: '0.2s' }}
            ></span>
            <span
              className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
              style={{ animationDelay: '0.4s' }}
            ></span>
          </div>
        </div>

        {/* Subtext */}
        <p className="text-zinc-400 text-sm mt-2">Please wait...</p>
      </div>
    </div>
  )
}
