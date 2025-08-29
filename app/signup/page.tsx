'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { setAuthToken } from "@/lib/auth"
import Link from "next/link"

interface SignupRequest {
  email: string;
  password: string;
  master_password: string;
}

interface User {
  id: string;
  email: string;
  created_at: string;
}

interface SignupResponse {
  user: User;
  token: string;
}

// API Base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

export default function SignupPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    masterPassword: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const validateForm = () => {
    if (!formData.email || !formData.password || !formData.confirmPassword || !formData.masterPassword) {
      toast({
        title: "Error",
        description: "All fields are required",
        variant: "destructive"
      })
      return false
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Error", 
        description: "Passwords do not match",
        variant: "destructive"
      })
      return false
    }

    if (formData.password.length < 8) {
      toast({
        title: "Error",
        description: "Password must be at least 8 characters long",
        variant: "destructive"
      })
      return false
    }

    if (formData.masterPassword.length < 8) {
      toast({
        title: "Error",
        description: "Master password must be at least 8 characters long",
        variant: "destructive"
      })
      return false
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Error",
        description: "Please enter a valid email address",
        variant: "destructive"
      })
      return false
    }

    return true
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsLoading(true)

    try {
      const signupData: SignupRequest = {
        email: formData.email,
        password: formData.password,
        master_password: formData.masterPassword
      }

      // Make API call to Go backend
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(signupData),
      })

      if (response.ok) {
        const data: SignupResponse = await response.json()
        
        // Set token using helper function
        setAuthToken(data.token)
        
        toast({
          title: "Success",
          description: "Account created successfully! Welcome to Secured.",
        })

        // Redirect to dashboard
        router.push('/dashboard')
      } else {
        const errorData = await response.json()
        let errorMessage = "Failed to create account"
        
        switch (response.status) {
          case 400:
            errorMessage = "Invalid input. Please check your data."
            break
          case 409:
            errorMessage = "An account with this email already exists."
            break
          case 500:
            errorMessage = "Server error. Please try again later."
            break
          default:
            errorMessage = errorData.message || errorMessage
        }

        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Signup error:', error)
      toast({
        title: "Error",
        description: "Network error. Please check your connection and try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

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
          <CardContent>
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  className="bg-zinc-900 border-zinc-700 text-white placeholder:text-zinc-500"
                  disabled={isLoading}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Create a strong password"
                  className="bg-zinc-900 border-zinc-700 text-white placeholder:text-zinc-500"
                  disabled={isLoading}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium">
                  Confirm Password
                </Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm your password"
                  className="bg-zinc-900 border-zinc-700 text-white placeholder:text-zinc-500"
                  disabled={isLoading}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="masterPassword" className="text-sm font-medium">
                  Master Password
                </Label>
                <Input
                  id="masterPassword"
                  name="masterPassword"
                  type="password"
                  value={formData.masterPassword}
                  onChange={handleInputChange}
                  placeholder="Create a strong master password"
                  className="bg-zinc-900 border-zinc-700 text-white placeholder:text-zinc-500"
                  disabled={isLoading}
                  required
                />
                <p className="text-xs text-zinc-500">This password encrypts your data. We cannot recover it if lost.</p>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-white text-black hover:bg-zinc-200 font-medium"
                disabled={isLoading}
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>

            <div className="text-center text-sm mt-4">
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
