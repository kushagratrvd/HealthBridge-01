// Google OAuth configuration
// For development, we'll use a fallback client ID if the environment variable isn't set
export const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""

// Load the Google Identity Services script
export const loadGoogleScript = () => {
  // Check if the script is already loaded
  if (typeof document !== "undefined" && document.querySelector("script#google-identity-script")) {
    return Promise.resolve()
  }

  return new Promise<void>((resolve, reject) => {
    if (typeof document === "undefined") {
      resolve()
      return
    }

    const script = document.createElement("script")
    script.id = "google-identity-script"
    script.src = "https://accounts.google.com/gsi/client"
    script.async = true
    script.defer = true
    script.onload = () => resolve()
    script.onerror = (error) => reject(error)
    document.head.appendChild(script)
  })
}

// Initialize Google Identity Services with error handling
export const initializeGoogleAuth = () => {
  return loadGoogleScript().then(() => {
    if (typeof window === "undefined" || !window.google) {
      throw new Error("Google Identity Services failed to load")
    }

    if (!GOOGLE_CLIENT_ID) {
      throw new Error("Google Client ID is missing. Please set the NEXT_PUBLIC_GOOGLE_CLIENT_ID environment variable.")
    }

    // Check if there's a redirect_uri_mismatch error in the URL
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search)
      if (urlParams.get("error") === "redirect_uri_mismatch") {
        throw new Error("Redirect URI mismatch. Please update your Google Cloud Console configuration.")
      }
    }
  })
}

// Type for Google user profile
export interface GoogleUserProfile {
  email: string
  name: string
  picture: string
  sub: string // Google's user ID
}

// Parse JWT token to get user info
export const parseJwt = (token: string): GoogleUserProfile => {
  try {
    const base64Url = token.split(".")[1]
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/")
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    )
    return JSON.parse(jsonPayload)
  } catch (error) {
    console.error("Error parsing JWT token:", error)
    throw error
  }
}

// Get the current URL for the redirect URI
export const getCurrentUrl = (): string => {
  return typeof window !== "undefined" ? window.location.origin : ""
}

