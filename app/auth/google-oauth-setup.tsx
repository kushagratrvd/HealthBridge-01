export default function GoogleOAuthSetupGuide() {
  // Get the current URL for the redirect URI
  const currentUrl = typeof window !== "undefined" ? window.location.origin : ""

  return (
    <div className="container max-w-4xl py-8">
      <h1 className="text-3xl font-bold mb-6">Google OAuth Setup Guide</h1>

      <div className="p-4 border rounded-lg bg-amber-50 border-amber-200 mb-6">
        <h2 className="text-xl font-semibold mb-2 text-amber-800">Important: Redirect URI Mismatch Detected</h2>
        <p className="text-amber-700 mb-4">
          Your Google OAuth configuration is missing the correct redirect URI for this deployment.
        </p>
        <div className="bg-white p-3 rounded border border-amber-200 mb-4">
          <p className="font-medium text-sm mb-1">Add this URI to your Google Cloud Console:</p>
          <code className="block p-2 bg-gray-100 rounded text-sm break-all">{currentUrl}</code>
        </div>
        <p className="text-sm text-amber-700">
          Follow the steps below to update your Google Cloud Console configuration.
        </p>
      </div>

      <div className="space-y-6">
        <div className="p-4 border rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Step 1: Access Your Google Cloud Console</h2>
          <ol className="list-decimal pl-5 space-y-2">
            <li>
              Go to the{" "}
              <a
                href="https://console.cloud.google.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Google Cloud Console
              </a>
            </li>
            <li>Select your project from the dropdown at the top of the page</li>
          </ol>
        </div>

        <div className="p-4 border rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Step 2: Navigate to OAuth Credentials</h2>
          <ol className="list-decimal pl-5 space-y-2">
            <li>In the left sidebar, click on "APIs & Services"</li>
            <li>Click on "Credentials"</li>
            <li>Find your OAuth 2.0 Client ID in the list and click on it to edit</li>
          </ol>
        </div>

        <div className="p-4 border rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Step 3: Add the Redirect URI</h2>
          <ol className="list-decimal pl-5 space-y-2">
            <li>
              In the "Authorized JavaScript origins" section, add your deployment URL:
              <code className="block mt-1 p-2 bg-gray-100 rounded text-sm">{currentUrl}</code>
            </li>
            <li>
              In the "Authorized redirect URIs" section, add your deployment URL:
              <code className="block mt-1 p-2 bg-gray-100 rounded text-sm">{currentUrl}</code>
            </li>
            <li>Click "Save" at the bottom of the page</li>
          </ol>
        </div>

        <div className="p-4 border rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Step 4: Wait for Changes to Propagate</h2>
          <p className="mb-4">
            Changes to OAuth configurations can take a few minutes to propagate through Google's systems.
          </p>
          <ol className="list-decimal pl-5 space-y-2">
            <li>Wait approximately 5-10 minutes</li>
            <li>Return to your application and try the Google Sign-In again</li>
          </ol>
        </div>

        <div className="p-4 border rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Additional Tips</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Make sure your OAuth consent screen is properly configured</li>
            <li>If you're using a test environment, add test users to your OAuth consent screen</li>
            <li>
              For development, add "http://localhost:3000" to both authorized JavaScript origins and redirect URIs
            </li>
            <li>For production, add both your domain with and without "www" prefix</li>
          </ul>
        </div>
      </div>

      <div className="mt-8 flex justify-center">
        <a href="/auth" className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90">
          Return to Login
        </a>
      </div>
    </div>
  )
}

