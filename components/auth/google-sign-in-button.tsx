"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ChromeIcon as Google } from "lucide-react"
import { initializeGoogleAuth, GOOGLE_CLIENT_ID, parseJwt } from "@/lib/google-auth"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { verifyGoogleToken } from "@/app/actions/auth"

interface GoogleSignInButtonProps {
  onSuccess?: (userData: any) => void
  onError?: (error: Error) => void
  redirectUrl?: string
}

export function GoogleSignInButton({
  onSuccess,
  onError,
  redirectUrl = "/patient/dashboard",
}: GoogleSignInButtonProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isScriptLoaded, setIsScriptLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const buttonRef = useRef<HTMLDivElement>(null)
  const [showRedirectError, setShowRedirectError] = useState(false)

  // Get the current URL for the redirect URI
  const currentUrl = typeof window !== "undefined" ? window.location.origin : ""

  useEffect(() => {
    // Check for redirect_uri_mismatch in URL (if user was redirected back with an error)
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search)
      if (urlParams.get("error") === "redirect_uri_mismatch") {
        setShowRedirectError(true)
      }
    }

    // Initialize Google Identity Services
    initializeGoogleAuth()
      .then(() => {
        setIsScriptLoaded(true)
        setError(null)
      })
      .catch((error) => {
        console.error("Failed to initialize Google Auth:", error)
        setError(error.message)
        if (onError) onError(error)
      })
  }, [onError])

  useEffect(() => {
    // Render the Google Sign-In button once the script is loaded
    if (isScriptLoaded && buttonRef.current && window.google && GOOGLE_CLIENT_ID) {
      try {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleCredentialResponse,
          auto_select: false, // Don't auto-select an account
          cancel_on_tap_outside: true, // Allow canceling by tapping outside
        })

        // Render the button
        window.google.accounts.id.renderButton(buttonRef.current, {
          type: "standard",
          theme: "outline",
          size: "large",
          text: "continue_with",
          shape: "rectangular",
          logo_alignment: "left",
          width: buttonRef.current.offsetWidth,
        })

        // Also display the One Tap UI (but only if no redirect error)
        if (!showRedirectError) {
          window.google.accounts.id.prompt()
        }
      } catch (error) {
        if (error instanceof Error) {
          console.error("Error rendering Google Sign-In button:", error)
          setError(error.message)
        }
      }
    }
  }, [isScriptLoaded, showRedirectError])

  const handleCredentialResponse = async (response: any) => {
    setIsLoading(true)
    try {
      // Verify the token with our server action
      const result = await verifyGoogleToken(response.credential)

      if (!result.success) {
        throw new Error(result.error || "Failed to verify Google token")
      }

      // Get user info from the token
      const userProfile = parseJwt(response.credential)
      console.log("Google Sign-In successful:", userProfile)

      // Determine redirect path based on email
      let redirectPath = "/patient/dashboard"
      if (userProfile.email?.includes("admin")) {
        redirectPath = "/admin/dashboard"
      } else if (userProfile.email?.includes("provider") || userProfile.email?.includes("doctor")) {
        redirectPath = "/provider/dashboard"
      }

      // Call the success callback if provided
      if (onSuccess) {
        onSuccess({ ...userProfile, redirectPath })
      } else {
        // If no success callback is provided, redirect directly
        console.log("No success callback provided, redirecting directly to:", redirectPath)

        // Use a more direct approach for redirection
        window.location.replace(redirectPath)
      }
    } catch (error) {
      console.error("Error processing Google Sign-In:", error)
      if (error instanceof Error) {
        setError(error.message)
        if (onError) onError(error)
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Fallback button in case Google script fails to load
  const handleFallbackClick = () => {
    if (!isScriptLoaded || error) {
      alert("Google Sign-In is not available at the moment. Please try again later or use another sign-in method.")
    }
  }

  return (
    <div className="w-full">
      {/* Redirect URI mismatch error */}
      {showRedirectError && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Google Sign-In Configuration Error</AlertTitle>
          <AlertDescription>
            <p>The redirect URI for this application is not registered in Google Cloud Console.</p>
            <p className="mt-2 text-sm">
              Please add the following URL to the authorized redirect URIs in your Google Cloud Console:
            </p>
            <code className="block mt-1 p-2 bg-destructive/10 rounded text-xs break-all">{currentUrl}</code>
          </AlertDescription>
        </Alert>
      )}

      {/* Other errors */}
      {error && !showRedirectError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
          <p className="font-medium">Google Sign-In Error</p>
          <p>{error}</p>
          <p className="mt-1 text-xs">Please try another sign-in method or contact support.</p>
        </div>
      )}

      {/* Hidden div for Google to render its button */}
      <div ref={buttonRef} className={isScriptLoaded && !error ? "w-full" : "hidden"} />

      {/* Fallback button that's shown until Google script loads or if there's an error */}
      {(!isScriptLoaded || error) && (
        <Button
          type="button"
          variant="secondary"
          className="w-full gap-2"
          onClick={handleFallbackClick}
          disabled={isLoading}
        >
          <Google className="h-4 w-4" />
          Sign in with Google
        </Button>
      )}
    </div>
  )
}

