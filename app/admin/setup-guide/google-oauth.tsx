"use client"

export default function GoogleOAuthSetupGuide() {
  return (
    <div className="container max-w-4xl py-8">
      <h1 className="text-3xl font-bold mb-6">Google OAuth Setup Guide</h1>

      <div className="space-y-6">
        <div className="p-4 border rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Step 1: Create a Google Cloud Project</h2>
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
            <li>Create a new project or select an existing one</li>
            <li>Note your Project ID for later use</li>
          </ol>
        </div>

        <div className="p-4 border rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Step 2: Configure the OAuth Consent Screen</h2>
          <ol className="list-decimal pl-5 space-y-2">
            <li>In your Google Cloud project, go to "APIs & Services" &gt; "OAuth consent screen"</li>
            <li>Select the appropriate user type (External or Internal)</li>
            <li>Fill in the required information (App name, User support email, Developer contact information)</li>
            <li>Add the necessary scopes (typically email, profile, and openid)</li>
            <li>Add your domain to the authorized domains list</li>
            <li>Save and continue</li>
          </ol>
        </div>

        <div className="p-4 border rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Step 3: Create OAuth Client ID</h2>
          <ol className="list-decimal pl-5 space-y-2">
            <li>Go to &quot;APIs & Services&quot; → &quot;Credentials&quot;</li>
            <li>Click &quot;Create Credentials&quot; and select &quot;OAuth client ID&quot;</li>
            <li>Select &quot;Web application&quot; as the application type</li>
            <li>Add a name for your OAuth client</li>
            <li>Add your domain to the "Authorized JavaScript origins" (e.g., https://yourdomain.com)</li>
            <li>Add your redirect URIs (e.g., https://yourdomain.com/auth/callback)</li>
            <li>Click "Create"</li>
            <li>Copy your Client ID and Client Secret</li>
          </ol>
        </div>

        <div className="p-4 border rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Step 4: Set Environment Variables</h2>
          <ol className="list-decimal pl-5 space-y-2">
            <li>In your project, create or update your .env.local file</li>
            <li>
              Add the following environment variables:
              <pre className="bg-gray-100 p-2 mt-2 rounded">NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_client_id_here</pre>
            </li>
            <li>
              If using a backend, also add:
              <pre className="bg-gray-100 p-2 mt-2 rounded">GOOGLE_CLIENT_SECRET=your_client_secret_here</pre>
            </li>
            <li>Restart your development server</li>
          </ol>
        </div>

        <div className="p-4 border rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Common Issues and Solutions</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium">Error: "The given client ID is not found"</h3>
              <ul className="list-disc pl-5 mt-2">
                <li>Ensure your Client ID is correctly copied without any extra spaces</li>
                <li>Verify that the environment variable is properly set and accessible</li>
                <li>Check that you're using the correct Client ID for your environment</li>
                <li>Make sure your application's domain matches the authorized JavaScript origins</li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium">Error: "Invalid Origin"</h3>
              <ul className="list-disc pl-5 mt-2">
                <li>Add your development domain (e.g., http://localhost:3000) to the authorized JavaScript origins</li>
                <li>For production, ensure your actual domain is added</li>
                <li>Remember that subdomains are treated as separate origins</li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium">Error: "Redirect URI Mismatch"</h3>
              <ul className="list-disc pl-5 mt-2">
                <li>Ensure the redirect URI in your code exactly matches what's configured in Google Cloud Console</li>
                <li>Check for trailing slashes, protocol differences (http vs https), or port numbers</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

