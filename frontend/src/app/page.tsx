import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-linear-to-b from-[#0a0e27] via-[#0d1117] to-[#0a0e27] text-white">
      <nav className="bg-[#000D1D] border-b border-zinc-800 px-6 py-8">
        <div className="flex items-center  justify-between max-w-screen mx-auto">
          <div className="flex items-center gap-3">
            <svg
              width="32"
              height="32"
              viewBox="0 0 56 56"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect x="4" y="4" width="48" height="48" rx="12" fill="#0F1C36" />
              <path
                d="M22 20l-6 8 6 8"
                stroke="#7DD3FC"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M34 20l6 8-6 8"
                stroke="#A78BFA"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="28" cy="28" r="3" fill="#60A5FA" />
            </svg>
            <div className="text-2xl font-bold">Codeack</div>
          </div>
          <div className="flex items-center gap-10">
            <Link href="/login" className="text-md hover:text-zinc-300">
              Login
            </Link>
            <Link
              href="/signup"
              className="bg-zinc-900 px-4 py-2 rounded-md text-md hover:bg-zinc-800"
            >
              Sign up
            </Link>
          </div>
        </div>
      </nav>

      <section className="px-6 py-16">
        <div className="max-w-screen mx-auto text-start">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
            Code, Collaborate, Compete — All in Real Time
          </h1>
          <p className="text-base text-zinc-400 mb-6 max-w-2xl">
            Join a vibrant community of competitive programmers. Solve
            challenges, compete with others, and unlock your coding potential.
          </p>
          <Link
            href="/signup"
            className="inline-block bg-blue-600 hover:bg-blue-700 px-8 py-2.5 rounded-md text-sm font-semibold transition-colors"
          >
            Start Coding
          </Link>
          <div className="flex justify-center mt-12">
            <img
              src="/landing_page_graphs.svg"
              alt="Landing page graphs"
              className="w-full max-w-3xl rounded-lg"
              suppressHydrationWarning
            />
          </div>
        </div>
      </section>

      <section className="px-6 py-16 border-t border-zinc-800">
        <div className="max-w-screen mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
            Interactive Challenges
          </h2>
          <p className="text-sm text-zinc-400 mb-8">
            Solve real-world coding problems and compete with others in
            real-time.
          </p>
          <Link
            href="/signup"
            className="inline-block bg-blue-600 hover:bg-blue-700 px-8 py-2.5 rounded-md text-sm font-semibold transition-colors mb-6"
          >
            Take on the challenges!
          </Link>
          <div className="flex text-start items-center justify-center">
            <div className="grid md:grid-cols-3 gap-6 max-w-7xl">
              <div className="bg-linear-to-br from-orange-500/20 to-red-500/20 border border-orange-500/30 rounded-lg p-6">
                <img
                  src="/code_battle.svg"
                  alt="Coding Battle"
                  className="w-full aspect-video object-cover rounded-md mb-4"
                />
                <h3 className="text-base font-semibold mb-2">Coding Battle</h3>
                <p className="text-xs text-zinc-400">
                  Compete head-to-head in real-time coding contests against
                  other programmers
                </p>
              </div>
              <div className="bg-linear-to-br from-teal-500/20 to-cyan-500/20 border border-teal-500/30 rounded-lg p-6">
                <img
                  src="/bug_fix.svg"
                  alt="Bug Fixing Challenge"
                  className="w-full aspect-video object-cover rounded-md mb-4 ml-2"
                />
                <h3 className="text-base font-semibold mb-2">
                  Bug Fixing Challenge
                </h3>
                <p className="text-xs text-zinc-400">
                  Fix bugs to succesfully debug and win the challenge!
                </p>
              </div>
              <div className="bg-linear-to-br from-purple-500/20 to-indigo-500/20 border border-purple-500/30 rounded-lg p-6">
                <img
                  src="/frontend_battle.svg"
                  alt="Frontend Challenge"
                  className="w-full aspect-video object-cover rounded-md mb-4"
                />
                <h3 className="text-base font-semibold mb-2">
                  Frontend Challenge
                </h3>
                <p className="text-xs text-zinc-400">
                  Build responsive UIs and implement interactive features with
                  modern web technologies
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-16 border-t border-zinc-800">
        <div className="max-w-screen mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
            Try our Multi-Language Compiler
          </h2>
          <p className="text-sm text-zinc-400 mb-8">
            Write, compile, and run code in multiple programming languages
            instantly.
          </p>
          <Link
            href="/signup"
            className="inline-block bg-blue-600 hover:bg-blue-700 px-8 py-2.5 rounded-md text-sm font-semibold transition-colors mb-6"
          >
            Try Now
          </Link>
          <div className="flex justify-center">
            <img
              src="/landing_page_compiler.png"
              alt="Landing page Compiler"
              className="w-full max-w-3xl rounded-lg"
              suppressHydrationWarning
            />
          </div>
        </div>
      </section>

      <section className="px-6 py-16 border-t border-zinc-800">
        <div className="max-w-screen mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
            Crack Your Dream Company!
          </h2>
          <p className="text-sm text-zinc-400 mb-8">
            Prepare for interviews with problems from top tech companies.
          </p>
          <div className="flex text-start items-center justify-center">
            <div className="grid md:grid-cols-2 gap-6 max-w-7xl w-full">
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
                <div className="flex justify-center">
                  <img
                    src="/structured_learning.svg"
                    alt="Structured Learning Path"
                    className="w-56 aspect-video object-cover rounded-md mb-4"
                  />
                </div>
                <h3 className="text-base font-semibold mb-2">
                  Structured Learning Path
                </h3>
                <p className="text-xs text-zinc-400">
                  Follow a comprehensive learning roadmap designed to take you
                  from beginner to expert with guided lessons and progressive
                  challenges.
                </p>
              </div>
              <div className="bg-zinc-900 border border-zinc-800  rounded-lg p-6">
                <div className="flex justify-center">
                  <img
                    src="/company_based.svg"
                    alt="Company-Based Challenges"
                    className="w-56 aspect-video object-cover rounded-md mb-4"
                  />
                </div>
                <h3 className="text-base font-semibold mb-2">
                  Company-Based Challenges
                </h3>
                <p className="text-xs text-zinc-400">
                  Practice problems from Google, Amazon, Meta, and other leading
                  tech companies to ace your interviews.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-16 border-t border-zinc-800">
        <div className="max-w-screen mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center leading-tight">
            What Users Say
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-linear-to-br from-blue-400 to-blue-600 rounded-full mr-3"></div>
                <div>
                  <div className="font-semibold text-sm">Alex Johnson</div>
                  <div className="text-xs text-zinc-500">@alexjohnson</div>
                </div>
              </div>
              <p className="text-zinc-300 text-sm leading-relaxed">
                "Codeack helped me ace my coding interviews. The problem variety
                is amazing!"
              </p>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-linear-to-br from-pink-400 to-pink-600 rounded-full mr-3"></div>
                <div>
                  <div className="font-semibold text-sm">Sarah Chen</div>
                  <div className="text-xs text-zinc-500">@sarahchen</div>
                </div>
              </div>
              <p className="text-zinc-300 text-sm leading-relaxed">
                "The competitive aspect keeps me motivated. I love the daily
                challenges!"
              </p>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-linear-to-br from-green-400 to-green-600 rounded-full mr-3"></div>
                <div>
                  <div className="font-semibold text-sm">Mike Dev</div>
                  <div className="text-xs text-zinc-500">@mikedev</div>
                </div>
              </div>
              <p className="text-zinc-300 text-sm leading-relaxed">
                "Best platform for competitive programming. Great community
                support!"
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-zinc-800 px-6 py-8">
        <div className="max-w-screen mx-auto text-center">
          <p className="text-zinc-400 text-xs mb-3">
            © 2025 Codeack. All rights reserved.
          </p>
          <div className="flex justify-center gap-4 text-xs text-zinc-500">
            <a href="#" className="hover:text-zinc-300">
              Privacy
            </a>
            <a href="#" className="hover:text-zinc-300">
              Terms
            </a>
            <a href="#" className="hover:text-zinc-300">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
