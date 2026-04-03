import React, { useState } from "react";
import { ImPhone, ImInfo, ImWarning, ImQuestion } from "react-icons/im";

const Help = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      q: "How do I upload cattle images?",
      a: "Go to Dashboard → Upload Image → Select clear cattle image → Click Analyze."
    },
    {
      q: "Why is my report not generating?",
      a: "Check internet connection, ensure image is clear, and retry. If issue persists, contact support."
    },
    {
      q: "How accurate are AI predictions?",
      a: "Predictions are based on trained models but are advisory. Always confirm with a veterinarian."
    },
    {
      q: "Can I use the app offline?",
      a: "Some features are offline-friendly, but AI analysis requires internet connectivity."
    }
  ];

  return (
    <main className="max-w-6xl mx-auto p-6 md:p-10 space-y-10 min-h-screen bg-gray-50">
      <section>
      
      <h2 className="text-2xl font-semibold mb-6 border-b pb-2">
        Help & Support
      </h2>
        <p className="text-gray-600">
          Everything you need to use SAMRIDHI efficiently and safely.
        </p>
      </section>

      {/* ================= QUICK HELP ================= */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="p-6 bg-white border rounded-xl shadow-sm hover:shadow-md transition">
          <ImInfo className="text-3xl text-green-600 mb-3" />
          <h3 className="font-semibold text-lg mb-1">Using the App</h3>
          <p className="text-sm text-gray-600">
            Upload cattle images, generate reports, and track livestock health history.
          </p>
        </div>

        <div className="p-6 bg-white border rounded-xl shadow-sm hover:shadow-md transition">
          <ImWarning className="text-3xl text-amber-600 mb-3" />
          <h3 className="font-semibold text-lg mb-1">Health Disclaimer</h3>
          <p className="text-sm text-gray-600">
            AI results are advisory only. Always consult a veterinarian before treatment.
          </p>
        </div>

        <div className="p-6 bg-white border rounded-xl shadow-sm hover:shadow-md transition">
          <ImPhone className="text-3xl text-blue-600 mb-3" />
          <h3 className="font-semibold text-lg mb-1">Contact Support</h3>
          <p className="text-sm text-gray-600">
            Facing issues? Reach out via phone or support form for quick help.
          </p>
        </div>

      </section>

      {/* ================= STEP GUIDE ================= */}
      <section className="bg-white border rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          How to Use the Platform
        </h2>

        <ol className="space-y-3 text-sm text-gray-600 list-decimal list-inside">
          <li>Register or login to your account</li>
          <li>Upload cattle image from dashboard</li>
          <li>Wait for AI analysis (breed + disease)</li>
          <li>View detailed report and recommendations</li>
          <li>Save or download report for future use</li>
        </ol>
      </section>

      {/* ================= FAQ ================= */}
      <section className="bg-gray-50 border rounded-xl p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <ImQuestion /> Frequently Asked Questions
        </h2>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="border rounded-lg bg-white">
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full text-left p-4 font-medium text-gray-800 flex justify-between items-center"
              >
                {faq.q}
                <span>{openIndex === i ? "−" : "+"}</span>
              </button>

              {openIndex === i && (
                <div className="px-4 pb-4 text-sm text-gray-600">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ================= EMERGENCY ================= */}
      <section className="bg-red-50 border border-red-200 rounded-xl p-6">
        <h2 className="font-semibold text-red-700 mb-2">
          Emergency Advisory 🚨
        </h2>
        <p className="text-sm text-red-700 leading-relaxed">
          If cattle shows sudden distress, abnormal behavior, or severe symptoms,
          immediately contact a certified veterinarian or nearby animal health center.
        </p>
      </section>

      {/* ================= TROUBLESHOOTING ================= */}
      <section className="bg-white border rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Troubleshooting
        </h2>

        <ul className="space-y-3 text-sm text-gray-600">
          <li>✔ Ensure image is clear and well-lit</li>
          <li>✔ Check internet connection for AI processing</li>
          <li>✔ Refresh page if results don’t load</li>
          <li>✔ Try another image if detection fails</li>
        </ul>
      </section>

      {/* ================= ACCESSIBILITY ================= */}
      <section className="bg-gray-50 border rounded-xl p-6">
        <h2 className="font-semibold text-gray-800 mb-2">
          Accessibility & Voice Assistance
        </h2>
        <p className="text-sm text-gray-600">
          Use the 🔊 speaker icon to listen to instructions in your preferred language.
          Designed for multilingual and low-literacy users.
        </p>
      </section>

    </main>
  );
};

export default Help;