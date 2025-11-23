import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-linear-to-b from-[#0a0e27] via-[#0d1117] to-[#0a0e27] text-white">
      <nav className="bg-[#000D1D] px-6 py-8">
        <div className="flex items-center  justify-between max-w-screen mx-auto">
          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="Codeack"
              className="w-32"
              suppressHydrationWarning
            />
          </div>
          <div className="flex items-center gap-10">
            <Link href="/login" className="text-md hover:text-zinc-300">
              Home
            </Link>
            <Link href="/login" className="text-md hover:text-zinc-300">
              Challenges
            </Link>
            <Link href="/login" className="text-md hover:text-zinc-300">
              Profile
            </Link>
          </div>
        </div>
      </nav>

      <section className="px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
            Code, Collaborate,
            <br />
            Compete — All in Real Time
          </h1>
          <p className="text-base text-zinc-400 mb-8">
            Join the next generation of competitive programmers. Team up, fix
            bugs, and build your coding portfolio effortlessly.
          </p>
          <Link
            href="/signup"
            className="inline-block bg-black hover:bg-gray-900 px-8 py-3 rounded-lg text-sm font-semibold transition-colors"
          >
            Start Coding
          </Link>
          <div className="flex justify-center mt-12">
            <img
              src="/landing_page_graphs.svg"
              alt="Landing page graphs"
              className="w-full max-w-4xl rounded-lg"
              suppressHydrationWarning
            />
          </div>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
            Interactive Challenges
          </h2>
          <p className="text-sm text-zinc-400 mb-8">
            Solve real-world coding problems and compete with others in
            real-time.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-linear-to-br from-orange-500/20 to-red-500/20 border border-orange-500/30 rounded-lg p-6">
              <img
                src="/code_battle.svg"
                alt="Coding Battle"
                className="w-full aspect-video object-cover rounded-md mb-4"
                suppressHydrationWarning
              />
              <h3 className="text-base font-semibold mb-2">Coding Battle</h3>
              <p className="text-xs text-zinc-400">
                Compete head-to-head in real-time coding contests against other
                programmers
              </p>
            </div>
            <div className="bg-linear-to-br from-teal-500/20 to-cyan-500/20 border border-teal-500/30 rounded-lg p-6">
              <img
                src="/bug_fix.svg"
                alt="Bug Fixing Challenge"
                className="w-full aspect-video object-cover rounded-md mb-4 ml-2"
                suppressHydrationWarning
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
                suppressHydrationWarning
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
      </section>

      <section className="px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
            Try our Multi-Language Compiler
          </h2>
          <p className="text-sm text-zinc-400 mb-8">
            Write, compile, and run code in multiple programming languages
            instantly.
          </p>
          <Link
            href="/signup"
            className="inline-block bg-black hover:bg-gray-900 px-8 py-2.5 rounded-lg text-sm font-semibold transition-colors mb-8"
          >
            Try Now
          </Link>
          <div className="flex justify-center my-8">
            <img
              src="/landing_page_compiler.png"
              alt="Landing page Compiler"
              className="w-full max-w-3xl rounded-lg"
              suppressHydrationWarning
            />
          </div>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
            Crack Your Dream Company!
          </h2>
          <p className="text-sm text-zinc-400 mb-12">
            Sharpen your skills and crack your dream company by solving
            real-world coding challenges under time and complexity limits!
          </p>
          <div className="flex justify-center">
            <div className="grid md:grid-cols-2 gap-24">
              <div className="w-72">
                <div className="flex justify-center mb-4">
                  <img
                    src="/company_based.svg"
                    alt="Company-Based Challenges"
                    className="w-72 h-56 object-cover rounded-lg"
                    suppressHydrationWarning
                  />
                </div>
                <h3 className="text-lg font-semibold mb-3">
                  Company-Based Challenges
                </h3>
                <p className="text-sm text-zinc-400">
                  Practice real interview questions asked by FAANG and top
                  startups — sharpen your skills with the exact problems
                  recruiters love.
                </p>
              </div>
              <div className="w-72">
                <div className="flex justify-center mb-4">
                  <img
                    src="/structured_learning.svg"
                    alt="Structured Learning Path"
                    className="w-72 h-56 object-cover rounded-lg"
                    suppressHydrationWarning
                  />
                </div>
                <h3 className="text-lg font-semibold mb-3">
                  Structured Learning Paths
                </h3>
                <p className="text-sm text-zinc-400">
                  Follow curated tracks for Google, Amazon, Meta, and more.
                  Build your confidence step by step with focused problem sets.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 leading-tight">
            Reviews
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-blue-950/30 border border-blue-900/50 rounded-lg p-6">
              <p className="text-zinc-300 text-sm leading-relaxed mb-6">
                "Clean interface and super smooth to use!"
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-linear-to-br from-red-400 to-red-600 rounded-full mr-3"></div>
                <div>
                  <div className="font-semibold text-sm">Muhammad Rehan</div>
                  <div className="text-xs text-zinc-500">
                    Frontend Developer
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-blue-950/30 border border-blue-900/50 rounded-lg p-6">
              <p className="text-zinc-300 text-sm leading-relaxed mb-6">
                "Perfect balance between learning and challenge."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-linear-to-br from-yellow-400 to-yellow-600 rounded-full mr-3"></div>
                <div>
                  <div className="font-semibold text-sm">Ayesha Khan</div>
                  <div className="text-xs text-zinc-500">
                    Computer Science Student
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-blue-950/30 border border-blue-900/50 rounded-lg p-6">
              <p className="text-zinc-300 text-sm leading-relaxed mb-6">
                "Makes coding fun again!"
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-linear-to-br from-cyan-400 to-cyan-600 rounded-full mr-3"></div>
                <div>
                  <div className="font-semibold text-sm">Usman Farooq</div>
                  <div className="text-xs text-zinc-500">Software Engineer</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="px-6 py-8">
        <div className="max-w-7xl mx-auto text-center">
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
