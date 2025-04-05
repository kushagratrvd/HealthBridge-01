# HealthBridge - Healthcare Platform

HealthBridge is a modern healthcare platform designed to bridge the gap between patients and healthcare providers in India. It offers a comprehensive solution for appointment booking, medical consultations, and health management.

## 🌟 Features

### For Patients
- **Easy Appointment Booking**: Book appointments with top doctors across India
- **Multi-language Support**: Available in English, Hindi, Tamil, Telugu, Kannada, and Malayalam
- **AI-Powered Health Assistant**: Get instant health insights and recommendations
- **Symptom Checker**: AI-powered preliminary health assessment
- **Prescription Scanner**: Upload the prescription and get clear indications from doctor's handwriting
- **Medical Records Management**: Access and manage your medical history
- **Telehealth Consultations**: Connect with doctors remotely

### For Healthcare Providers
- **Digital Dashboard**: Manage appointments and patient records
- **AI Clinical Tools**: 
  - Medical Assistant for quick information access
  - Health Risk Prediction
  - Treatment Recommendations
- **Patient Management**: Streamlined patient care workflow
- **Analytics**: Track performance and patient statistics

### For Administrators
- **Comprehensive Analytics**: Monitor platform usage and performance
- **Resource Management**: Manage doctors and hospital resources
- **Operational Tools**: Oversee platform operations

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **UI Framework**: Tailwind CSS, Shadcn UI
- **Authentication**: NextAuth.js, Google OAuth
- **AI/ML**: Google Cloud Vertex AI, Gemini API
- **Translation**: Custom translation service with Google Cloud
- **News API**: NewsAPI.org for health-related news
- **Deployment**: Vercel

## 🚀 Getting Started

### Prerequisites
- Node.js 18.x or later
- npm or yarn
- Google Cloud account (for AI services)
- NewsAPI key

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/healthbridge.git
cd healthbridge
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Set up environment variables
Create a `.env.local` file with the following variables:
```env
# Google Cloud Vision API
GOOGLE_PROJECT_ID=your-project-id
GOOGLE_PRIVATE_KEY=your-private-key
GOOGLE_CLIENT_EMAIL=your-client-email

# Google Gemini API
GOOGLE_GEMINI_API_KEY=your-gemini-api-key

# NextAuth.js
NEXTAUTH_URL=your-app-url
NEXTAUTH_SECRET=your-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# News API
NEWS_API_KEY=your-news-api-key
```

4. Run the development server
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📱 Supported Languages

- English (en)
- Hindi (hi)
- Tamil (ta)
- Telugu (te)
- Kannada (kn)
- Malayalam (ml)







