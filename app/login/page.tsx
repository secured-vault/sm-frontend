import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-light">
            <span className="font-serif text-4xl">S</span>ecured
          </Link>
          <p className="text-zinc-400 mt-2">Welcome back</p>
        </div>

        <Card className="bg-zinc-950/50 border-zinc-800">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-light">Sign in</CardTitle>
            <CardDescription className="text-zinc-400">Access your secure API key vaults</CardDescription>
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
                placeholder="Enter your master password"
                className="bg-zinc-900 border-zinc-700 text-white placeholder:text-zinc-500"
              />
            </div>
            <Button className="w-full bg-white text-black hover:bg-zinc-200 font-medium">Sign In</Button>
            <div className="text-center text-sm">
              <span className="text-zinc-400">Don't have an account? </span>
              <Link href="/signup" className="text-white hover:underline">
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-8">
          <p className="text-xs text-zinc-500">
            Your master password is never sent to our servers.
            <br />
            Zero-knowledge encryption keeps your keys secure.
          </p>
        </div>
      </div>
    </div>
  )
}
