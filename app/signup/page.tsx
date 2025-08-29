'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import Link from "next/link"

interface SignupRequest {
  name: string;
  email: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  created_at: string;
}

interface SignupResponse {
  user: User;
  token: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: ''
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
    if (!formData.name || !formData.email) {
      toast({
        title: "Error",
        description: "All fields are required",
        variant: "destructive"
      })
      return false
    }

    if (formData.name.length < 2) {
      toast({
        title: "Error",
        description: "Name must be at least 2 characters long",
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
        name: formData.name,
        email: formData.email
      }

      const response = await fetch(`${API_BASE_URL}/api/v1/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(signupData),
      })

      if (response.ok) {
        const data: SignupResponse = await response.json()
        
        toast({
          title: "Success",
          description: "Account created! Check your email for login credentials.",
        })

        router.push('/login')
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
            errorMessage = errorData.error || errorMessage
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
            <CardDescription className="text-zinc-400">We'll send your credentials via email</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  Full Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  className="bg-zinc-900 border-zinc-700 text-white placeholder:text-zinc-500"
                  disabled={isLoading}
                  required
                />
              </div>
              
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
            
            <div className="text-center text-sm mt-2">
              <span className="text-zinc-400">Forgot your password? </span>
              <Link href="/forgot-password" className="text-white hover:underline">
                Reset it
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-8">
          <p className="text-xs text-zinc-500">
            Your login credentials will be sent to your email address
            <br />
            after successful account creation.
          </p>
        </div>
      </div>
    </div>
  )
}
