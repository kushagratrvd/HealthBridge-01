"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useTranslation } from "@/components/translation-provider"

const schemes = [
  {
    name: "Ayushman Bharat - Pradhan Mantri Jan Arogya Yojana (PM-JAY)",
    benefits: "Provides ₹5 lakh per family for secondary and tertiary hospitalization. Targets over 50 crore citizens.",
    eligibility: "Low-income families as per SECC 2011 data.",
    application: "Apply via PM-JAY website or visit the nearest hospital under the scheme.",
    link: "https://en.wikipedia.org/wiki/Ayushman_Bharat_Yojana",
    documents: ["Aadhar Card", "Ration Card", "Income Certificate", "PM-JAY Family ID (if applicable)"],
    steps: [
      "Check eligibility on the PM-JAY website.",
      "Visit a registered hospital or Common Service Center (CSC).",
      "Submit required documents for verification.",
      "Receive the Ayushman Bharat Health Card upon approval.",
      "Use the card for free treatment at empaneled hospitals.",
    ],
    applyLink: "https://pmjay.gov.in",
  },
  {
    name: "Rashtriya Arogya Nidhi (RAN)",
    benefits: "Financial aid for patients below the poverty line suffering from major life-threatening diseases.",
    eligibility: "Must be below the poverty line and need treatment in a government super-specialty hospital.",
    application: "Apply through the hospital social welfare officer.",
    link: "https://mohfw.gov.in",
    documents: [
      "Doctor’s referral and medical report",
      "Income proof (Below Poverty Line certificate)",
      "Aadhar Card",
      "Hospital treatment estimate",
    ],
    steps: [
      "Obtain a treatment cost estimate from a government hospital.",
      "Prepare and submit the application through the hospital's social welfare officer.",
      "Documents are reviewed by the Ministry of Health and Family Welfare.",
      "If approved, financial assistance is provided for the treatment.",
    ],
    applyLink: "https://mohfw.gov.in",
  },
  {
    name: "Health Minister’s Discretionary Grant (HMDG)",
    benefits: "Financial assistance for patients with an annual family income up to ₹1,25,000 for treatment in govt hospitals.",
    eligibility: "Annual family income ≤ ₹1,25,000. Covers life-threatening diseases.",
    application: "Submit application to the Health Ministry with income proof and medical documents.",
    link: "https://www.myscheme.gov.in/schemes/hmdg",
    documents: [
      "Medical records and doctor's prescription",
      "Income certificate (family income ≤ ₹1,25,000)",
      "Aadhar Card",
      "Hospital estimate for treatment cost",
    ],
    steps: [
      "Download and fill out the application form from the MyScheme portal.",
      "Attach required documents and get them verified by a government hospital.",
      "Submit the application to the Ministry of Health.",
      "Upon approval, funds are allocated to cover treatment expenses.",
    ],
    applyLink: "https://www.myscheme.gov.in/schemes/hmdg",
  },
  {
    name: "Janani Suraksha Yojana (JSY)",
    benefits: "Cash assistance to promote institutional deliveries, reducing maternal and neonatal mortality.",
    eligibility: "Pregnant women below the poverty line and from eligible states.",
    application: "Apply at a government hospital or health center.",
    link: "https://en.wikipedia.org/wiki/National_Health_Mission",
    documents: ["Pregnancy Registration Card", "Aadhar Card", "Bank Account Details", "BPL Certificate (if applicable)"],
    steps: [
      "Register for JSY at a government health center.",
      "Ensure all antenatal check-ups are completed as required.",
      "Deliver the baby at a government hospital or accredited private facility.",
      "Submit the required documents to claim financial aid.",
      "Cash assistance is directly transferred to the bank account.",
    ],
    applyLink: "https://en.wikipedia.org/wiki/National_Health_Mission",
  },
  {
    name: "National Health Protection Scheme for Senior Citizens",
    benefits: "Medical insurance coverage of ₹5 lakh per family for citizens aged 70 and above.",
    eligibility: "Senior citizens (70+ years).",
    application: "Register at a government healthcare center.",
    link: "https://www.reuters.com/world/india/india-raises-free-health-cover-citizens-aged-above-70-years-2024-09-12/",
    documents: ["Aadhar Card", "Age Proof (Birth Certificate, Voter ID, etc.)", "Income Certificate", "Medical Records (if applicable)"],
    steps: [
      "Visit a registered government hospital or insurance center.",
      "Submit identity and income verification documents.",
      "Complete biometric verification (if required).",
      "Once approved, receive your health protection card.",
      "Use the card for free treatment in empaneled hospitals.",
    ],
    applyLink: "https://www.reuters.com/world/india/india-raises-free-health-cover-citizens-aged-above-70-years-2024-09-12/",
  },
]

export default function SchemesPage() {
  const { t } = useTranslation()

  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tight">Government Health Schemes</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {schemes.map((scheme, idx) => (
          <Card key={idx} className="flex flex-col justify-between">
            <CardHeader>
              <CardTitle className="text-lg">{scheme.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p><strong>Benefits:</strong> {scheme.benefits}</p>
              <p><strong>Eligibility:</strong> {scheme.eligibility}</p>
              <p><strong>Application:</strong> {scheme.application}</p>
              <div>
                <strong>Required Documents:</strong>
                <ul className="list-disc list-inside mt-1">
                  {scheme.documents.map((doc, i) => (
                    <li key={i}>{doc}</li>
                  ))}
                </ul>
              </div>
              <div>
                <strong>Steps:</strong>
                <ol className="list-decimal list-inside mt-1">
                  {scheme.steps.map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ol>
              </div>
              <div className="pt-2 flex gap-2">
                <Button size="sm" asChild>
                  <Link href={scheme.applyLink} target="_blank">Apply Now</Link>
                </Button>
                <Button size="sm" variant="outline" asChild>
                  <Link href={scheme.link} target="_blank">Learn More</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
