"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

// Define supported languages
export const SUPPORTED_LANGUAGES = [
  { code: "en", name: "English", nativeName: "English" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी" },
  { code: "ta", name: "Tamil", nativeName: "தமிழ்" },
  { code: "te", name: "Telugu", nativeName: "తెలుగు" },
  { code: "kn", name: "Kannada", nativeName: "ಕನ್ನಡ" },
  { code: "ml", name: "Malayalam", nativeName: "മലയാളം" },
]

// Basic UI translations for common elements
export const uiTranslations = {
  welcome: {
    en: "Welcome",
    hi: "स्वागत है",
    ta: "வரவேற்கிறோம்",
    te: "స్వాగతం",
    kn: "ಸ್ವಾಗತ",
    ml: "സ്വാഗതം",
  },
  profile: {
    en: "Profile",
    hi: "प्रोफाइल",
    ta: "சுயவிவரம்",
    te: "ప్రొఫైల్",
    kn: "ಪ್ರೊಫೈಲ್",
    ml: "പ്രൊഫൈൽ",
  },
  logout: {
    en: "Log out",
    hi: "लॉग आउट",
    ta: "வெளியேறு",
    te: "లాగ్ అవుట్",
    kn: "ಲಾಗ್ ಔಟ್",
    ml: "ലോഗൗട്ട്",
  },
  my_records: {
    en: "My Records",
    hi: "मेरे रिकॉर्ड्स",
    ta: "எனது பதிவுகள்",
    te: "నా రికార్డులు",
    kn: "ನನ್ನ ದಾಖಲೆಗಳು",
    ml: "എന്റെ രേഖകൾ",
  },
  view_records: {
    en: "View Records",
    hi: "रिकॉर्ड देखें",
    ta: "பதிவுகளைக் காண்க",
    te: "రికార్డులను వీక్షించండి",
    kn: "ದಾಖಲೆಗಳನ್ನು ವೀಕ್ಷಿಸಿ",
    ml: "രേഖകൾ കാണുക",
  },
  symptom_checker: {
    en: "Symptom Checker",
    hi: "लक्षण जांचकर्ता",
    ta: "அறிகுறி சரிபார்ப்பி",
    te: "లక్షణ తనిఖీ",
    kn: "ರೋಗಲಕ್ಷಣ ಪರಿಶೀಲಕ",
    ml: "രോഗലക്ഷണ പരിശോധകൻ",
  },
  prescription_scanner: {
    en: "Prescription Scanner",
    hi: "प्रिस्क्रिप्शन स्कैनर",
    ta: "மருந்து சீட்டு ஸ்கேனர்",
    te: "ప్రిస్క్రిప్షన్ స్కానర్",
    kn: "ಪ್ರಿಸ್ಕ್ರಿಪ್ಶನ್ ಸ್ಕ್ಯಾನರ್",
    ml: "പ്രിസ്ക്രിപ്ഷൻ സ്കാനർ",
  },
  book_appointment: {
    en: "Book Appointment",
    hi: "अपॉइंटमेंट बुक करें",
    ta: "சந்திப்பை பதிவு செய்யுங்கள்",
    te: "అపాయింట్మెంట్ బుక్ చేయండి",
    kn: "ಅಪಾಯಿಂಟ್ಮೆಂಟ್ ಬುಕ್ ಮಾಡಿ",
    ml: "അപ്പോയിന്റ്മെന്റ് ബുക്ക് ചെയ്യുക",
  },
  scan_prescription: {
    en: "Scan Prescription",
    hi: "प्रिस्क्रिप्शन स्कैन करें",
    ta: "மருந்து சீட்டை ஸ்கேன் செய்யுங்கள்",
    te: "ప్రిస్క్రిప్షన్ స్కాన్ చేయండి",
    kn: "ಪ್ರಿಸ್ಕ್ರಿಪ್ಶನ್ ಸ್ಕ್ಯಾನ್ ಮಾಡಿ",
    ml: "പ്രിസ്ക്രിപ്ഷൻ സ്കാൻ ചെയ്യുക",
  },
  upload_prescription: {
    en: "Upload Prescription",
    hi: "प्रिस्क्रिप्शन अपलोड करें",
    ta: "மருந்து சீட்டை பதிவேற்றவும்",
    te: "ప్రిస్క్రిప్షన్ అప్లోడ్ చేయండి",
    kn: "ಪ್ರಿಸ್ಕ್ರಿಪ್ಶನ್ ಅಪ್ಲೋಡ್ ಮಾಡಿ",
    ml: "പ്രിസ്ക്രിപ്ഷൻ അപ്‌ലോഡ് ചെയ്യുക",
  },
  medicines: {
    en: "Medicines",
    hi: "दवाइयां",
    ta: "மருந்துகள்",
    te: "మందులు",
    kn: "ಔಷಧಿಗಳು",
    ml: "മരുന്നുകൾ",
  },
  diagnosis: {
    en: "Diagnosis",
    hi: "निदान",
    ta: "நோய் அறிதல்",
    te: "రోగ నిర్ధారణ",
    kn: "ರೋಗನಿರ್ಣಯ",
    ml: "രോഗനിർണ്ണയം",
  },
  fulltext: {
    en: "Full Text",
    hi: "पूरा टेक्स्ट",
    ta: "முழு உரை",
    te: "పూర్తి పాఠ్యం",
    kn: "ಪೂರ್ಣ ಪಠ್ಯ",
    ml: "മുഴുവൻ വാചകം",
  },
  processing: {
    en: "Processing...",
    hi: "प्रोसेसिंग...",
    ta: "செயலாக்கம்...",
    te: "ప్రాసెసింగ్...",
    kn: "ಪ್ರಕ್ರಿಯೆಗೊಳಿಸಲಾಗುತ್ತಿದೆ...",
    ml: "പ്രോസസ്സിംഗ്...",
  },
  add_to_meds: {
    en: "Add to Meds",
    hi: "दवाओं में जोड़ें",
    ta: "மருந்துகளில் சேர்க்கவும்",
    te: "మందులకు జోడించండి",
    kn: "ಔಷಧಿಗಳಿಗೆ ಸೇರಿಸಿ",
    ml: "മരുന്നുകളിൽ ചേർക്കുക",
  },
  settings: {
    en: "Settings",
    hi: "सेटिंग्स",
    ta: "அமைப்புகள்",
    te: "సెట్టింగులు",
    kn: "ಸೆಟ್ಟಿಂಗ್‌ಗಳು",
    ml: "ക്രമീകരണങ്ങൾ",
  },
  dashboard_subtitle: {
    en: "Here's your health overview and upcoming appointments",
    hi: "यहां आपका स्वास्थ्य अवलोकन और आगामी अपॉइंटमेंट हैं",
    ta: "இங்கே உங்கள் ஆரோக்கிய கண்ணோட்டம் மற்றும் வரவிருக்கும் சந்திப்புகள் உள்ளன",
    te: "ఇక్కడ మీ ఆరోగ్య అవలోకనం మరియు రాబోయే అపాయింట్మెంట్లు ఉన్నాయి",
    kn: "ಇಲ್ಲಿ ನಿಮ್ಮ ಆರೋಗ್ಯದ ಅವಲೋಕನ ಮತ್ತು ಮುಂಬರುವ ಅಪಾಯಿಂಟ್ಮೆಂಟ್‌ಗಳಿವೆ",
    ml: "ഇവിടെ നിങ്ങളുടെ ആരോഗ്യ അവലോകനവും വരാനിരിക്കുന്ന അപ്പോയിന്റ്മെന്റുകളും ഉണ്ട്",
  },
  schedule_visit: {
    en: "Schedule a visit",
    hi: "विजिट शेड्यूल करें",
    ta: "வருகையை திட்டமிடுங்கள்",
    te: "సందర్శనను షెడ్యూల్ చేయండి",
    kn: "ಭೇಟಿಯನ್ನು ಶೆಡ್ಯೂಲ್ ಮಾಡಿ",
    ml: "സന്ദർശനം ഷെഡ്യൂൾ ചെയ്യുക",
  },
  nearby_facilities: {
    en: "Nearby Facilities",
    hi: "नज़दीकी सुविधाएं",
    ta: "அருகிலுள்ள வசதிகள்",
    te: "సమీపంలోని సౌకర్యాలు",
    kn: "ಹತ್ತಿರದ ಸೌಲಭ್ಯಗಳು",
    ml: "സമീപമുള്ള സൗകര്യങ്ങൾ",
  },
  find_hospitals_around_you: {
    en: "Find hospitals around your location",
    hi: "अपने आस-पास के अस्पताल खोजें",
    ta: "உங்கள் அருகிலுள்ள மருத்துவமனைகளை கண்டறியுங்கள்",
    te: "మీ పరిసరాలలోని ఆసుపత్రులను కనుగొనండి",
    kn: "ನಿಮ್ಮ ಸುತ್ತಲಿನ ಆಸ್ಪತ್ರೆಗಳನ್ನು ಹುಡುಕಿ",
    ml: "നിങ്ങളുടെ ചുറ്റുപാടിലുള്ള ആശുപത്രികൾ കണ്ടെത്തുക",
  },
  
  ocr_prescriptions: {
    en: "OCR for prescriptions",
    hi: "प्रिस्क्रिप्शन के लिए OCR",
    ta: "மருந்து சீட்டுகளுக்கான OCR",
    te: "ప్రిస్క్రిప్షన్ల కోసం OCR",
    kn: "ಪ್ರಿಸ್ಕ್ರಿಪ್ಶನ್‌ಗಳಿಗಾಗಿ OCR",
    ml: "പ്രിസ്ക്രിപ്ഷനുകൾക്കായുള്ള OCR",
  },
  access_medical_history: {
    en: "Access medical history",
    hi: "मेडिकल हिस्ट्री एक्सेस करें",
    ta: "மருத்துவ வரலாற்றை அணுகவும்",
    te: "వైద్య చరిత్రను యాక్సెస్ చేయండి",
    kn: "ವೈದ್ಯಕೀಯ ಇತಿಹಾಸವನ್ನು ಪ್ರವೇಶಿಸಿ",
    ml: "മെഡിക്കൽ ചരിത്രം ആക്സസ് ചെയ്യുക",
  },
  ai_health_insights: {
    en: "AI health insights",
    hi: "AI स्वास्थ्य अंतर्दृष्टि",
    ta: "AI ஆரோக்கிய நுண்ணறிவுகள்",
    te: "AI ఆరోగ్య అంతర్దృష్టులు",
    kn: "AI ಆರೋಗ್ಯ ಒಳನೋಟಗಳು",
    ml: "AI ആരോഗ്യ ഇൻസൈറ്റുകൾ",
  },
  all_rights_reserved: {
    en: "All rights reserved",
    hi: "सर्वाधिकार सुरक्षित",
    ta: "அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை",
    te: "అన్ని హక్కులు రిజర్వ్ చేయబడ్డాయి",
    kn: "ಎಲ್ಲಾ ಹಕ್ಕುಗಳನ್ನು ಕಾಯ್ದಿರಿಸಲಾಗಿದೆ",
    ml: "എല്ലാ അവകാശങ്ങളും നിക്ഷിപ്തമാണ്",
  },
  privacy_policy: {
    en: "Privacy Policy",
    hi: "गोपनीयता नीति",
    ta: "தனியுரிமைக் கொள்கை",
    te: "గోప్యతా విధానం",
    kn: "ಗೌಪ್ಯತಾ ನೀತಿ",
    ml: "സ്വകാര്യതാ നയം",
  },
  terms_of_service: {
    en: "Terms of Service",
    hi: "सेवा की शर्तें",
    ta: "சேவை விதிமுறைகள்",
    te: "సేవా నిబంధనలు",
    kn: "ಸೇವಾ ನಿಯಮಗಳು",
    ml: "സേവന നിബന്ധനകൾ",
  },
  upload_photo: {
    en: "Upload Photo",
    hi: "फोटो अपलोड करें",
    ta: "புகைப்படத்தை பதிவேற்றவும்",
    te: "ఫోటో అప్లోడ్ చేయండి",
    kn: "ಫೋಟೋ ಅಪ್ಲೋಡ್ ಮಾಡಿ",
    ml: "ഫോട്ടോ അപ്‌ലോഡ് ചെയ്യുക",
  },
  analyze_symptoms: {
    en: "Analyze Symptoms",
    hi: "लक्षणों का विश्लेषण करें",
    ta: "அறிகுறிகளை பகுப்பாய்வு செய்யுங்கள்",
    te: "లక్షణాలను విశ్లేషించండి",
    kn: "ರೋಗಲಕ್ಷಣಗಳನ್ನು ವಿಶ್ಲೇಷಿಸಿ",
    ml: "രോഗലക്ഷണങ്ങൾ വിശ്ലേഷിക്കുക",
  },
  describe_symptoms: {
    en: "Describe your symptoms in detail...",
    hi: "अपने लक्षणों का विस्तार से वर्णन करें...",
    ta: "உங்கள் அறிகுறிகளை விரிவாக விவரிக்கவும்...",
    te: "మీ లక్షణాలను వివరంగా వివరించండి...",
    kn: "ನಿಮ್ಮ ರೋಗಲಕ್ಷಣಗಳನ್ನು ವಿವರವಾಗಿ ವಿವರಿಸಿ...",
    ml: "നിങ്ങളുടെ രോഗലക്ഷണങ്ങൾ വിശദമായി വിവരിക്കുക...",
  },
} as const

// Function to translate using Vertex AI
export async function translateWithAPI(text: string, targetLanguage: string): Promise<string> {
  if (!text || targetLanguage === "en") return text

  try {
    const response = await fetch("/api/translate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
        targetLanguage,
      }),
    })

    if (!response.ok) {
      throw new Error("Translation failed")
    }

    const data = await response.json()
    return data.translatedText
  } catch (error) {
    console.error("Translation error:", error)
    return text
  }
}

