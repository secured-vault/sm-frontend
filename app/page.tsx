import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <header className="border-b border-zinc-800/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 relative">
              <Image src="/secured-logo.png" alt="Secured" fill className="object-contain" />
            </div>
            <div className="text-2xl font-light">Secured</div>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/features" className="text-zinc-400 hover:text-white transition-colors text-sm font-medium">
              Features
            </Link>
            <Link href="/pricing" className="text-zinc-400 hover:text-white transition-colors text-sm font-medium">
              Pricing
            </Link>
            <Link href="/contact" className="text-zinc-400 hover:text-white transition-colors text-sm font-medium">
              Contact
            </Link>
            <div className="flex items-center space-x-3 ml-6 pl-6 border-l border-zinc-800">
              <Link href="/login">
                <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-white hover:bg-zinc-900">
                  Sign in
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="sm" className="bg-white text-black hover:bg-zinc-200 font-medium">
                  Get Started
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      </header>

      <main className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-zinc-950/20 to-black pointer-events-none" />

        <section className="flex items-center justify-center min-h-[85vh] px-6 relative">
          <div className="max-w-5xl mx-auto text-center">
            <div className="mb-8">
              <div className="inline-block p-2 rounded-full bg-zinc-900/50 border border-zinc-800 mb-6">
                <div className="text-xs text-zinc-400 px-3 py-1">Open Source • Secure • Developer First</div>
              </div>
            </div>

            <h1 className="text-6xl md:text-8xl lg:text-9xl font-light mb-8 tracking-tight leading-none">
              API keys for
              <br />
              <span className="text-zinc-300">developers</span>
            </h1>

            <p className="text-xl md:text-2xl text-zinc-400 mb-12 max-w-3xl mx-auto leading-relaxed font-light">
              The best way to store your keys instead of forgetting them.
              <br />
              Never reset an API key again.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link href="/signup">
                <Button size="lg" className="bg-white text-black hover:bg-zinc-200 px-8 py-3 text-base font-medium">
                  Get Started
                </Button>
              </Link>
              <Button
                variant="outline"
                size="lg"
                className="border-zinc-700 text-white hover:bg-zinc-900 px-8 py-3 bg-transparent text-base font-medium"
              >
                Documentation
              </Button>
            </div>

            <div className="max-w-2xl mx-auto">
              <Card className="bg-zinc-950/50 border-zinc-800 p-6 text-left">
                <div className="text-xs text-zinc-500 mb-3 font-mono">secured-cli</div>
                <div className="font-mono text-sm text-zinc-300 space-y-2">
                  <div>
                    <span className="text-zinc-500">$</span> secured add openai
                  </div>
                  <div className="text-zinc-500">✓ API key stored securely</div>
                  <div>
                    <span className="text-zinc-500">$</span> secured get openai
                  </div>
                  <div className="text-green-400">sk-proj-abc123...</div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-24 px-6 border-t border-zinc-900">
          <div className="container mx-auto max-w-6xl">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-zinc-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <div className="w-6 h-6 bg-white rounded-sm"></div>
                </div>
                <h3 className="text-lg font-medium mb-2">Secure Vaults</h3>
                <p className="text-zinc-400 text-sm">End-to-end encrypted storage for your API keys</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-zinc-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <div className="w-6 h-6 border-2 border-white rounded"></div>
                </div>
                <h3 className="text-lg font-medium mb-2">CLI & GUI</h3>
                <p className="text-zinc-400 text-sm">Access your keys from terminal or web interface</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-zinc-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <div className="w-6 h-6 bg-gradient-to-br from-white to-zinc-400 rounded"></div>
                </div>
                <h3 className="text-lg font-medium mb-2">Open Source</h3>
                <p className="text-zinc-400 text-sm">Built by developers, for developers</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-zinc-900 py-12 px-6">
        <div className="container mx-auto text-center">
          <p className="text-sm text-zinc-500 leading-relaxed">
            Companies of all sizes trust Secured
            <br />
            to store their most important API keys.
          </p>
        </div>
      </footer>
    </div>
  )
}
