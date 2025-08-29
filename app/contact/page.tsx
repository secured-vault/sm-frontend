import { Button } from "@/components/ui/button"
import { Github } from "lucide-react"
import Link from "next/link"

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <header className="border-b border-zinc-800">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-medium">
            Secured
          </Link>
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/features" className="text-zinc-400 hover:text-white transition-colors text-sm">
              Features
            </Link>
            <Link href="/pricing" className="text-zinc-400 hover:text-white transition-colors text-sm">
              Pricing
            </Link>
            <Link href="/contact" className="text-white text-sm">
              Contact
            </Link>
            <Button variant="outline" size="sm" className="border-zinc-700 text-white hover:bg-zinc-900 bg-transparent">
              Sign in
            </Button>
            <Button size="sm" className="bg-white text-black hover:bg-zinc-200">
              Get Started
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex items-center justify-center min-h-[80vh] px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-normal mb-6 tracking-tight">Get in touch</h1>
          <p className="text-xl text-zinc-400 mb-12 leading-relaxed">
            Have questions? We'd love to hear from you.
            <br />
            Send us a message and we'll respond as soon as possible.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-black hover:bg-zinc-200 px-8">
              Contact Support
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-zinc-700 text-white hover:bg-zinc-900 px-8 bg-transparent"
            >
              <Github className="h-5 w-5 mr-2" />
              GitHub Issues
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
