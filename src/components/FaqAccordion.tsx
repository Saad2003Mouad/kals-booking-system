"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

export const FAQS = [
  { question: "How much does an ice cream truck cost?", answer: "Our pricing varies based on the package, distance, and guest count. However, you can instantly see your exact pricing by using our AI reservation system. We offer transparent pricing with no hidden fees." },
  { question: "How many guests can you serve?", answer: "We can handle events of any size! From small birthday parties of 20 people to massive corporate events with over 2,000 guests, our fleet is equipped to serve everyone quickly." },
  { question: "Do you serve schools?", answer: "Yes! We specialize in school events, including graduations, teacher appreciation days, field days, and back-to-school nights. We are fully licensed, insured, and health department inspected." },
  { question: "Do you serve corporate events?", answer: "Absolutely. We provide premium ice cream catering for corporate picnics, employee appreciation days, grand openings, and marketing events." },
  { question: "Are you licensed and insured?", answer: "Yes, Boston Legend Ice Cream Truck is fully licensed, fully insured, and regularly inspected by the health department to ensure the highest safety standards." },
  { question: "Can I book online?", answer: "Yes! We are the world's first AI-powered ice cream truck reservation platform. You can get instant pricing and book your event in less than 3 minutes online." },
  { question: "How does your AI reservation system work?", answer: "Our smart AI engine calculates the optimal travel routes, vehicle availability, and package sizing to instantly provide you with a customized quote and real-time availability." },
  { question: "Do you serve all Massachusetts?", answer: "Yes, we proudly serve all of Massachusetts. Just enter your ZIP code during the booking process to see our service availability." },
  { question: "What ice cream options are available?", answer: "We offer a wide variety of premium ice cream novelties, classic treats, and allergen-friendly options. Our inventory is fully stocked for every event." },
  { question: "Can you provide a Certificate of Insurance (COI)?", answer: "Yes, we frequently provide Certificates of Insurance (COI) for corporate clients, HOAs, schools, and apartment communities upon request." },
];

export default function FaqAccordion({ faqs = FAQS }: { faqs?: { question: string, answer: string }[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-3">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <h2 className="text-3xl font-black text-center mb-8" style={{ color: "#000223" }}>Frequently Asked Questions</h2>
      {faqs.map((faq, idx) => (
        <div key={idx} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
          <button
            onClick={() => toggle(idx)}
            className="w-full text-left px-6 py-5 flex items-center justify-between font-bold text-lg focus:outline-none"
            style={{ color: "#000223" }}
            aria-expanded={openIndex === idx}
          >
            <span>{faq.question}</span>
            <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${openIndex === idx ? "rotate-180" : ""}`} style={{ color: "#FFA000" }} />
          </button>
          <div 
            className={`px-6 overflow-hidden transition-all duration-300 ${openIndex === idx ? "max-h-96 pb-5 opacity-100" : "max-h-0 opacity-0"}`}
          >
            <p className="text-slate-600 font-medium leading-relaxed">{faq.answer}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
