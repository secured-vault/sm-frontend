import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <header className="border-b border-zinc-800/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-light">
            <span className="font-serif text-3xl">S</span>ecured
          </Link>
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/features" className="text-white text-sm font-medium">
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

      <main className="py-24 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-20">
            <div className="inline-block p-2 rounded-full bg-zinc-900/50 border border-zinc-800 mb-6">
              <div className="text-xs text-zinc-400 px-3 py-1">Built by young developers • Open Source • Secure</div>
            </div>
            <h1 className="text-5xl md:text-7xl font-light mb-6 tracking-tight">Built for developers</h1>
            <p className="text-xl text-zinc-400 max-w-3xl mx-auto leading-relaxed">
              Everything you need to manage your API keys securely and efficiently.
              <br />
              Open source, transparent, and built by passionate young developers.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-20">
            <Card className="bg-zinc-950/50 border-zinc-800 p-8">
              <CardHeader className="p-0">
                <CardTitle className="text-2xl font-light mb-4">End-to-End Encryption</CardTitle>
                <CardDescription className="text-zinc-400 text-base leading-relaxed">
                  Your API keys are encrypted with military-grade security before storage. We use AES-256 encryption
                  with your master password as the key - even we can't see your data.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-zinc-950/50 border-zinc-800 p-8">
              <CardHeader className="p-0">
                <CardTitle className="text-2xl font-light mb-4">Multiple Secure Vaults</CardTitle>
                <CardDescription className="text-zinc-400 text-base leading-relaxed">
                  Organize your keys by project, environment, or team with isolated vaults. Each vault has its own
                  encryption layer for maximum security.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-zinc-950/50 border-zinc-800 p-8">
              <CardHeader className="p-0">
                <CardTitle className="text-2xl font-light mb-4">CLI & Web Interface</CardTitle>
                <CardDescription className="text-zinc-400 text-base leading-relaxed">
                  Access your keys through our clean web interface or powerful command-line tool. Perfect for both
                  development and production workflows.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-zinc-950/50 border-zinc-800 p-8">
              <CardHeader className="p-0">
                <CardTitle className="text-2xl font-light mb-4">Open Source & Transparent</CardTitle>
                <CardDescription className="text-zinc-400 text-base leading-relaxed">
                  Built by young, passionate developers who believe in transparency. Our entire codebase is open source
                  - audit it, contribute to it, trust it.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          <div className="border-t border-zinc-900 pt-20">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-light mb-6">Why developers choose Secured</h2>
              <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
                Built by developers who understand the pain of managing API keys across projects
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-6xl font-light text-zinc-700 mb-4">01</div>
                <h3 className="text-xl font-medium mb-3">Zero Knowledge Architecture</h3>
                <p className="text-zinc-400">
                  We literally cannot see your keys. Your master password never leaves your device.
                </p>
              </div>
              <div className="text-center">
                <div className="text-6xl font-light text-zinc-700 mb-4">02</div>
                <h3 className="text-xl font-medium mb-3">Developer Experience First</h3>
                <p className="text-zinc-400">
                  Simple CLI commands, clean API, and intuitive web interface designed for speed.
                </p>
              </div>
              <div className="text-center">
                <div className="text-6xl font-light text-zinc-700 mb-4">03</div>
                <h3 className="text-xl font-medium mb-3">Community Driven</h3>
                <p className="text-zinc-400">Open source project maintained by young developers who use it daily.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
