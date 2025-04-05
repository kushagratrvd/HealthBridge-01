"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Eye, EyeOff, Star, Shield, AlertCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import { LanguageSelector } from "@/components/language-selector"
import { GoogleSignInButton } from "@/components/auth/google-sign-in-button"
import { loginWithEmailPassword, registerUser } from "@/app/actions/auth"

export default function AuthPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [userType, setUserType] = useState("patient")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [registerEmail, setRegisterEmail] = useState("")
  const [registerPassword, setRegisterPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [registerError, setRegisterError] = useState<string | null>(null)
  const [registerSuccess, setRegisterSuccess] = useState<string | null>(null)

  const router = useRouter()
  const { toast } = useToast()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      // Use the server action to login
      const result = await loginWithEmailPassword(email, password)

      if (result.success) {
        toast({
          title: "Login successful",
          description: "You have been successfully logged in",
        })

        console.log("Login successful, attempting to redirect...")

        // Use a short timeout to ensure the toast is shown before redirect
        setTimeout(() => {
          // Use the redirectPath from the result
          const redirectPath = result.redirectPath || "/patient/dashboard"
          console.log("Redirecting to:", redirectPath)

          // Use direct window location for navigation instead of router
          window.location.href = redirectPath
        }, 1000)
      } else {
        throw new Error(result.error || "Login failed")
      }
    } catch (error) {
      console.error("Login error:", error)
      setError(error instanceof Error ? error.message : "Please check your credentials and try again")
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "Please check your credentials and try again",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignInSuccess = (userData: any) => {
    toast({
      title: "Google Sign-In successful",
      description: `Welcome, ${userData.name}!`,
    })

    console.log("Google login successful, attempting to redirect...")

    // Determine redirect path based on email
    let redirectPath = "/patient/dashboard"
    if (userData.email?.includes("admin")) {
      redirectPath = "/admin/dashboard"
    } else if (userData.email?.includes("provider") || userData.email?.includes("doctor")) {
      redirectPath = "/provider/dashboard"
    }

    // Redirect after a short delay to allow the toast to be seen
    setTimeout(() => {
      console.log("Redirecting to", redirectPath)
      window.location.href = redirectPath
    }, 1000)
  }

  const handleGoogleSignInError = (error: Error) => {
    console.error("Google Sign-In error:", error)
    toast({
      title: "Google Sign-In failed",
      description: error.message || "Please try again or use email login",
      variant: "destructive",
    })
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setRegisterError(null)
    setRegisterSuccess(null)

    // Validate passwords match
    if (registerPassword !== confirmPassword) {
      setRegisterError("Passwords do not match")
      setIsLoading(false)
      return
    }

    try {
      // Call the register function
      const result = await registerUser(registerEmail, registerPassword, userType)

      if (result.success) {
        toast({
          title: "Registration successful",
          description: "Your account has been created. Redirecting to dashboard...",
        })

        // Clear form
        setRegisterEmail("")
        setRegisterPassword("")
        setConfirmPassword("")

        // Short delay to show the success message before redirect
        setTimeout(() => {
          window.location.href = result.redirectPath || "/patient/dashboard"
        }, 1500)
      } else {
        throw new Error(result.error || "Registration failed")
      }
    } catch (error) {
      console.error("Registration error:", error)
      setRegisterError(error instanceof Error ? error.message : "Registration failed. Please try again.")
      toast({
        title: "Registration failed",
        description:
          error instanceof Error ? error.message : "There was an error creating your account. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Star className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">HealthBridge</span>
          </Link>

          <div className="flex items-center gap-4">
            <LanguageSelector />
          </div>
        </div>
      </header>

      <main className="flex-1 container max-w-6xl py-12">
        <Card>
          <CardHeader>
            <CardTitle>Welcome to HealthBridge</CardTitle>
            <CardDescription>Sign in to access your healthcare dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>
              <TabsContent value="login">
                <form onSubmit={handleLogin}>
                  <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold">Login to your account</CardTitle>
                    <CardDescription>Enter your email and password to access your account</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {error && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="name@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        autoComplete="email"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="password">Password</Label>
                        <Link href="/auth/forgot-password" className="text-sm text-primary hover:underline">
                          Forgot password?
                        </Link>
                      </div>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          autoComplete="current-password"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <Eye className="h-4 w-4 text-muted-foreground" />
                          )}
                          <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Shield className="h-4 w-4" />
                      <span>Secure authentication</span>
                    </div>

                    <Alert variant="default" className="bg-muted/50">
                      <AlertTitle>Demo Accounts</AlertTitle>
                      <AlertDescription className="text-xs">
                        <p className="mb-1">Use these credentials to test different user roles:</p>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Admin: admin@example.com / admin123</li>
                          <li>Doctor: doctor@example.com / doctor123</li>
                          <li>Patient: patient@example.com / patient123</li>
                        </ul>
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                  <CardFooter className="flex flex-col space-y-4">
                    <Button type="submit" className="w-full">
                      Login
                    </Button>

                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <Separator />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                      </div>
                    </div>

                    <GoogleSignInButton onSuccess={handleGoogleSignInSuccess} onError={handleGoogleSignInError} />
                  </CardFooter>
                </form>
              </TabsContent>
              <TabsContent value="register">
                <form onSubmit={handleRegister}>
                  <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
                    <CardDescription>Enter your information to create an account</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {registerError && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{registerError}</AlertDescription>
                      </Alert>
                    )}

                    {registerSuccess && (
                      <Alert variant="default" className="bg-green-50 text-green-800 border-green-200">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Success</AlertTitle>
                        <AlertDescription>{registerSuccess}</AlertDescription>
                      </Alert>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="register-email">Email</Label>
                      <Input
                        id="register-email"
                        type="email"
                        placeholder="name@example.com"
                        value={registerEmail}
                        onChange={(e) => setRegisterEmail(e.target.value)}
                        required
                        autoComplete="email"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-password">Password</Label>
                      <div className="relative">
                        <Input
                          id="register-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={registerPassword}
                          onChange={(e) => setRegisterPassword(e.target.value)}
                          required
                          autoComplete="new-password"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <Eye className="h-4 w-4 text-muted-foreground" />
                          )}
                          <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm Password</Label>
                      <div className="relative">
                        <Input
                          id="confirm-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="user-type">I am a</Label>
                      <select
                        id="user-type"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={userType}
                        onChange={(e) => setUserType(e.target.value)}
                      >
                        <option value="patient">Patient</option>
                        <option value="provider">Healthcare Provider</option>
                        <option value="admin">Administrator</option>
                      </select>
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col space-y-4">
                    <Button type="submit" className="w-full">
                      Register
                    </Button>

                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <Separator />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">Or register with</span>
                      </div>
                    </div>

                    <GoogleSignInButton onSuccess={handleGoogleSignInSuccess} onError={handleGoogleSignInError} />
                  </CardFooter>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>

      <footer className="w-full border-t bg-background">
        <div className="container py-6 flex justify-between items-center">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} HealthBridge. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="/privacy" className="text-xs text-muted-foreground hover:text-foreground">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-xs text-muted-foreground hover:text-foreground">
              Terms of Service
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

