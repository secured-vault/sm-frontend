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

interface LoginRequest {
  email: string;
  password: string;
  master_password: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  created_at: string;
}

interface LoginResponse {
  user: User;
  token: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
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
    if (!formData.email || !formData.password || !formData.masterPassword) {
      toast({
        title: "Error",
        description: "All fields are required",
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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsLoading(true)

    try {
      const loginData: LoginRequest = {
        email: formData.email,
        password: formData.password,
        master_password: formData.masterPassword
      }

      const response = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      })

      if (response.ok) {
        const data: LoginResponse = await response.json()
        
        setAuthToken(data.token)
        
        toast({
          title: "Success",
          description: `Welcome back, ${data.user.name}!`,
        })

        router.push('/dashboard')
      } else {
        const errorData = await response.json()
        let errorMessage = "Failed to sign in"
        
        switch (response.status) {
          case 400:
            errorMessage = "Invalid input. Please check your data."
            break
          case 401:
            if (errorData.error?.includes("not activated")) {
              errorMessage = "Account not activated. Please check your email."
            } else if (errorData.error?.includes("master password")) {
              errorMessage = "Invalid master password."
            } else {
              errorMessage = "Invalid email or password."
            }
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
      console.error('Login error:', error)
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
          <p className="text-zinc-400 mt-2">Welcome back</p>
        </div>

        <Card className="bg-zinc-950/50 border-zinc-800">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-light">Sign in</CardTitle>
            <CardDescription className="text-zinc-400">Access your secure API key vaults</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
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
                  placeholder="Enter your password"
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
                  placeholder="Enter your master password"
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
                {isLoading ? "Signing In..." : "Sign In"}
              </Button>
            </form>
            
            <div className="text-center text-sm mt-4">
              <span className="text-zinc-400">Don't have an account? </span>
              <Link href="/signup" className="text-white hover:underline">
                Sign up
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
            Your master password is never sent to our servers.
            <br />
            Zero-knowledge encryption keeps your keys secure.
          </p>
        </div>
      </div>
    </div>
  )
}
