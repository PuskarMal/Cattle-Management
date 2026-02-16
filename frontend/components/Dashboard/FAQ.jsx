import React, { useState } from "react";
import {FaChevronDown} from "react-icons/fa6";

const faqs = [
  {
    q: "How does the cattle health analysis work?",
    a: "You upload an image of the cattle, and our AI analyzes visible health indicators such as skin condition, posture, and physical symptoms to generate a preliminary health report."
  },
  {
    q: "Is this a replacement for a veterinarian?",
    a: "No. This system provides decision support only. For serious conditions, always consult a certified veterinarian."
  },
  {
    q: "Can I use the app without internet?",
    a: "Yes. Core features are designed to work offline. Internet is required only for syncing reports or updates."
  },
  {
    q: "Which cattle breeds are supported?",
    a: "The system supports common Indian breeds and crossbreeds. Breed-specific recommendations improve accuracy."
  },
  {
    q: "Is my data safe?",
    a: "Yes. All images and reports are securely stored and never shared without your consent."
  }
];

const FaqPage = () => {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <main className="">
      {/* Header */}
      <h1 className="text-3xl font-bold mb-2">
        Frequently Asked Questions
      </h1>
      <p className="text-gray-200 mb-8">
        Clear answers to common questions about using the system.
      </p>

      {/* FAQ List */}
      <div className="space-y-4">
        {faqs.map((faq, i) => (
          <div
            key={i}
            className="border border-gray-200 rounded-xl bg-white shadow-sm"
          >
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="w-full flex justify-between items-center p-4 text-left"
            >
              <span className="font-medium text-gray-800">
                {faq.q}
              </span>
              <FaChevronDown
                className={`transition-transform ${
                  openIndex === i ? "rotate-180" : ""
                }`}
              />
              
            </button>

            {openIndex === i && (
              <div className="px-4 pb-4 text-sm text-gray-700 leading-relaxed">
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer Prompt */}
      <div className="mt-10 text-center text-sm text-gray-200">
        Still need help?{" "}
        <a href="/help" className="text-primary-green font-medium hover:underline">
          Visit Help & Support
        </a>
      </div>
    </main>
  );
}

export default FaqPage;