import React from 'react';
import type { Metadata } from 'next';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions | Boston Legend Ice Cream Truck',
  description: 'Find answers to common questions about booking an ice cream truck in Boston, MA. Learn about pricing, packages, service areas, and more.',
};

const FAQS = [
  {
    question: "How much does an ice cream truck rental cost?",
    answer: "Our packages start at just $190 for up to 30 guests, and scale up depending on guest count and duration. We offer Family, Celebration, and Custom packages for large corporate events."
  },
  {
    question: "What areas do you serve?",
    answer: "We proudly serve over 140 cities and towns across Greater Boston and Massachusetts, including Cambridge, Somerville, Newton, Quincy, and more."
  },
  {
    question: "What types of events do you cater?",
    answer: "We cater all types of events including birthday parties, corporate events, weddings, school fundraisers, block parties, and employee appreciation days."
  },
  {
    question: "How far in advance should I book?",
    answer: "We recommend booking 2-4 weeks in advance, especially during the peak summer season, to guarantee availability."
  }
];

export default function FAQPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": FAQS.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <div className="min-h-screen flex flex-col bg-amber-50">
      <SiteHeader />
      <main className="flex-grow pt-24 pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          />
          <h1 className="text-4xl md:text-5xl font-playfair font-bold text-[#000223] mb-8 text-center">
            Frequently Asked Questions
          </h1>
          <div className="space-y-6">
            {FAQS.map((faq, idx) => (
              <details key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 group">
                <summary className="text-xl font-bold text-[#000223] cursor-pointer list-none flex justify-between items-center">
                  {faq.question}
                  <span className="text-[#FFA000] transition-transform group-open:rotate-180">▼</span>
                </summary>
                <p className="mt-4 text-gray-600 leading-relaxed">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
          <div className="mt-12 text-center">
            <a href="/packages" className="inline-block bg-[#FFA000] text-[#000223] font-bold py-4 px-8 rounded-full hover:bg-yellow-400 transition-colors shadow-lg">
              Book Your Truck Now
            </a>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
