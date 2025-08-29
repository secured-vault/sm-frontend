import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <header className="border-b border-zinc-800/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-light">
            <span className="font-serif text-3xl">S</span>ecured
          </Link>
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/features" className="text-zinc-400 hover:text-white transition-colors text-sm font-medium">
              Features
            </Link>
            <Link href="/pricing" className="text-white text-sm font-medium">
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
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-20">
            <div className="inline-block p-2 rounded-full bg-zinc-900/50 border border-zinc-800 mb-6">
              <div className="text-xs text-zinc-400 px-3 py-1">No hidden fees • Cancel anytime • Open Source</div>
            </div>
            <h1 className="text-5xl md:text-7xl font-light mb-6 tracking-tight">Simple, transparent pricing</h1>
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
              Start free, upgrade when you need more. Built by young developers who believe in fair pricing.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-20">
            <Card className="bg-zinc-950/50 border-zinc-800 p-8 relative">
              <CardHeader className="p-0 pb-8">
                <div className="flex items-center justify-between mb-4">
                  <CardTitle className="text-2xl font-light">Free</CardTitle>
                  <div className="text-xs text-zinc-500 bg-zinc-900 px-2 py-1 rounded">Personal</div>
                </div>
                <CardDescription className="text-zinc-400 text-base">
                  Perfect for personal projects and getting started
                </CardDescription>
                <div className="text-6xl font-light mt-8 mb-2">$0</div>
                <div className="text-zinc-500 text-sm">Forever free</div>
              </CardHeader>
              <CardContent className="p-0">
                <ul className="space-y-4 mb-8 text-zinc-300">
                  <li className="flex items-start">
                    <div className="w-1.5 h-1.5 bg-white rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <div>
                      <div className="font-medium">1 secure vault</div>
                      <div className="text-sm text-zinc-500">Encrypted with your master password</div>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="w-1.5 h-1.5 bg-white rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <div>
                      <div className="font-medium">50 Secrets storage</div>
                      <div className="text-sm text-zinc-500">Store up to 50 different Secrets</div>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="w-1.5 h-1.5 bg-white rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <div>
                      <div className="font-medium">Single API access</div>
                      <div className="text-sm text-zinc-500">One API key for GUI and CLI</div>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="w-1.5 h-1.5 bg-white rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <div>
                      <div className="font-medium">Web & CLI access</div>
                      <div className="text-sm text-zinc-500">Full access to both interfaces</div>
                    </div>
                  </li>
                </ul>
                <Link href="/signup">
                  <Button className="w-full bg-white text-black hover:bg-zinc-200 font-medium py-3">
                    Get Started Free
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-zinc-950/50 border-white relative p-8">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <div className="bg-white text-black px-4 py-1.5 rounded-full text-xs font-medium">Most Popular</div>
              </div>
              <CardHeader className="p-0 pb-8">
                <div className="flex items-center justify-between mb-4">
                  <CardTitle className="text-2xl font-light">Pro</CardTitle>
                  <div className="text-xs text-zinc-900 bg-white px-2 py-1 rounded">Teams</div>
                </div>
                <CardDescription className="text-zinc-400 text-base">
                  For teams and power users who need more
                </CardDescription>
                <div className="text-6xl font-light mt-8 mb-2">
                  $5<span className="text-2xl text-zinc-400 font-normal">/month</span>
                </div>
                <div className="text-zinc-500 text-sm">Billed monthly • Cancel anytime</div>
              </CardHeader>
              <CardContent className="p-0">
                <ul className="space-y-4 mb-8 text-zinc-300">
                  <li className="flex items-start">
                    <div className="w-1.5 h-1.5 bg-white rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <div>
                      <div className="font-medium">10 secure vaults</div>
                      <div className="text-sm text-zinc-500">Organize by project or environment</div>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="w-1.5 h-1.5 bg-white rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <div>
                      <div className="font-medium">Unlimited Secrets keys</div>
                      <div className="text-sm text-zinc-500">Store as many Secrets as you need</div>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="w-1.5 h-1.5 bg-white rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <div>
                      <div className="font-medium">Multiple APIs per vault</div>
                      <div className="text-sm text-zinc-500">Separate API access for each vault</div>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="w-1.5 h-1.5 bg-white rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <div>
                      <div className="font-medium">Team collaboration</div>
                      <div className="text-sm text-zinc-500">Share vaults with team members</div>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="w-1.5 h-1.5 bg-white rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <div>
                      <div className="font-medium">Priority support</div>
                      <div className="text-sm text-zinc-500">Direct access to our dev team</div>
                    </div>
                  </li>
                </ul>
                <Link href="/signup">
                  <Button className="w-full bg-white text-black hover:bg-zinc-200 font-medium py-3">
                    Start Pro Trial
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          <div className="border-t border-zinc-900 pt-20">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-light mb-6">Frequently asked questions</h2>
              <p className="text-zinc-400 text-lg">Built by developers, for developers</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div>
                <h3 className="text-lg font-medium mb-3">Why is it so affordable?</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  We're young developers who built this because we needed it. We believe great tools shouldn't break the
                  bank.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-3">Is my data really secure?</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  Yes. We use zero-knowledge encryption - your master password never leaves your device, and we
                  literally cannot see your keys when you use CLI and GUI.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-3"> Can I store my Secrets in my Own Database</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  Yes. You can integrate your own PostgreSQL Database for Secrets and monitor your access from the dashboard
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-3">Can I trust an open source project?</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  Absolutely. Open source means transparency. You can audit our code, contribute improvements, and know
                  exactly how your data is handled.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-3">What if I need to cancel?</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  Cancel anytime with one click. Your data remains accessible, and you can export everything before
                  downgrading.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
