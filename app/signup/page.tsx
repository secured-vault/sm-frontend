import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-light">
            <span className="font-serif text-4xl">S</span>ecured
          </Link>
          <p className="text-zinc-400 mt-2">Start securing your API keys</p>
        </div>

        <Card className="bg-zinc-950/50 border-zinc-800">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-light">Create account</CardTitle>
            <CardDescription className="text-zinc-400">Join thousands of developers using Secured</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                className="bg-zinc-900 border-zinc-700 text-white placeholder:text-zinc-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Master Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Create a strong master password"
                className="bg-zinc-900 border-zinc-700 text-white placeholder:text-zinc-500"
              />
              <p className="text-xs text-zinc-500">This password encrypts your data. We cannot recover it if lost.</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password" className="text-sm font-medium">
                Confirm Password
              </Label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="Confirm your master password"
                className="bg-zinc-900 border-zinc-700 text-white placeholder:text-zinc-500"
              />
            </div>
            <Button className="w-full bg-white text-black hover:bg-zinc-200 font-medium">Create Account</Button>
            <div className="text-center text-sm">
              <span className="text-zinc-400">Already have an account? </span>
              <Link href="/login" className="text-white hover:underline">
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-8">
          <p className="text-xs text-zinc-500">
            By creating an account, you agree to our open source
            <br />
            terms and zero-knowledge privacy policy.
          </p>
        </div>
      </div>
    </div>
  )
}
