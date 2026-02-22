"use client";

import { ChevronRight } from "lucide-react";
import { useState } from "react";

export default function AdminDocumentationPage() {
  const [activeTopic, setActiveTopic] = useState("analytics");

  const documentationTopics = [
    {
      id: "analytics",
      title: "Google Analytics 4 Dashboard",
      content: (
        <div className="space-y-4">
          <p className="text-gray-700 leading-relaxed">
            Your new Analytics page streams live visitor data directly into your admin panel using the Google Analytics Data API.
          </p>
          <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-2">Setup Instructions</h3>
          <ul className="list-disc pl-5 space-y-2 text-gray-700">
            <li>Navigate to <strong>General Settings</strong>.</li>
            <li>Scroll down to the Analytics section.</li>
            <li>Enter your <strong>GA4 Property ID</strong> (e.g., 123456789).</li>
            <li>Paste the full JSON content from your <strong>Google Service Account</strong> credentials file.</li>
            <li>Save Settings. The Analytics page will now display live data.</li>
          </ul>
          <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-2">What it tracks</h3>
          <ul className="list-disc pl-5 space-y-2 text-gray-700">
            <li><strong>Total Sessions:</strong> Overall visits to the store spanning the selected date range.</li>
            <li><strong>Page Views:</strong> Total number of pages loaded by visitors.</li>
            <li><strong>Active Users:</strong> Distinct visitors recognized by Google.</li>
            <li><strong>Top Viewed Pages:</strong> A list of your top 5 performing pages with percentage traffic bars.</li>
          </ul>
        </div>
      )
    },
    {
      id: "chat",
      title: "Chat & Smart Support Widgets",
      content: (
        <div className="space-y-4">
          <p className="text-gray-700 leading-relaxed">
            Configure how your customers communicate with you through Live Chat, WhatsApp, or Messenger directly on your storefront.
          </p>
          
          <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-2">WhatsApp & Messenger Configuration</h3>
          <ul className="list-disc pl-5 space-y-2 text-gray-700">
            <li>Go to <strong>General Settings</strong> &gt; Social Media Links.</li>
            <li>For WhatsApp, enter your phone number. The website intelligently turns it into an automatic <code>https://wa.me</code> link.</li>
            <li>For Messenger, enter your Facebook Page ID. This creates a lightweight redirect link avoiding heavy plugin slowdowns.</li>
          </ul>

          <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-2">Tawk.to Setup & Auto-Identify</h3>
          <ul className="list-disc pl-5 space-y-2 text-gray-700">
            <li>Enter your <strong>Property ID</strong> and <strong>Widget ID</strong> securely in settings.</li>
            <li><strong>Smart Identity Feature:</strong> If you toggle "Tawk.to Identifies Logged User" to ON, the website will automatically send the customer's <em>Name</em> and <em>Email</em> to your Tawk.to dashboard if they are logged into their store account. You will no longer need to ask for their details manually during a chat.</li>
          </ul>

          <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-2">Disabling Widgets</h3>
          <p className="text-gray-700 leading-relaxed">
            To hide any chat widget temporarily, scroll down to the "Feature Toggles" panel in General Settings and turn its specific switch OFF. You do not need to delete your IDs.
          </p>
        </div>
      )
    },
    {
      id: "reviews",
      title: "Product Review System",
      content: (
        <div className="space-y-4">
          <p className="text-gray-700 leading-relaxed">
            The customer review engine is designed to ensure authenticity by matching user emails with database order records.
          </p>
          <ul className="list-disc pl-5 space-y-2 text-gray-700 mt-4">
            <li>Reviews are strictly verified by the backend Node.js secure API.</li>
            <li>Users are mathematically blocked from submitting a review if their logged-in email address does not have a "Completed" or "Delivered" order containing that specific Product ID.</li>
            <li>Global Toggle: If you wish to globally disable customer reviews across all products, navigate to &apos;General Settings&apos; &gt; &apos;Feature Toggles&apos; and turn off &apos;Customer Reviews Enabled&apos;.</li>
          </ul>
        </div>
      )
    },
    {
      id: "text-editor",
      title: "Rich Text Editing",
      content: (
        <div className="space-y-4">
          <p className="text-gray-700 leading-relaxed">
            Product descriptions and Blog posts use an advanced Rich Text Formatter (ReactQuill) instead of standard text areas.
          </p>
          <ul className="list-disc pl-5 space-y-2 text-gray-700 mt-4">
            <li>Use the formatting toolbar to apply Bold, Italics, Underlines, and Lists.</li>
            <li>You can inject hyper-links directly into your text.</li>
            <li>When saving to the database, the editor preserves the pristine HTML output.</li>
          </ul>
        </div>
      )
    },
    {
      id: "settings",
      title: "General Settings Architecture",
      content: (
        <div className="space-y-4">
          <p className="text-gray-700 leading-relaxed">
            The General Settings govern the behavior of various frontend components statically and dynamically.
          </p>
          <ul className="list-disc pl-5 space-y-2 text-gray-700 mt-4">
            <li>Settings are fetched through the <code>/api/general-settings</code> MongoDB endpoint.</li>
            <li>Once loaded, settings logic determines if certain components like Announcements, Reviews, or Chat widgets render at all on the frontend DOM.</li>
            <li>When deploying to production, resolving peer-dependencies is automatically handled by the local <code>.npmrc</code> configuration enforcing legacy-peer-deps, averting React 18 installation errors.</li>
          </ul>
        </div>
      )
    }
  ];

  const activeContent = documentationTopics.find(t => t.id === activeTopic);

  return (
    <div className="min-h-screen bg-white">
      {/* Top Header */}
      <div className="border-b border-gray-200 bg-white px-6 py-8 md:px-10">
        <h1 className="text-3xl font-bold text-gray-900">Documentation</h1>
        <p className="text-gray-500 mt-2 text-lg">Official reference guide and manual for Snowfye system administration.</p>
      </div>

      <div className="flex flex-col md:flex-row max-w-7xl mx-auto">
        
        {/* Sidebar Navigation */}
        <div className="w-full md:w-80 border-b md:border-b-0 md:border-r border-gray-200 bg-gray-50/50 p-6 flex-shrink-0 min-h-[calc(100vh-140px)]">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Topics</h2>
          <nav className="space-y-1">
            {documentationTopics.map((topic) => (
              <button
                key={topic.id}
                onClick={() => setActiveTopic(topic.id)}
                className={`w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                  activeTopic === topic.id
                    ? "bg-[#ff6c2f] text-white"
                    : "text-gray-700 hover:bg-gray-200/50"
                }`}
              >
                {topic.title}
                {activeTopic === topic.id && <ChevronRight className="w-4 h-4 opacity-70" />}
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 p-6 md:p-12 lg:p-16">
          {activeContent && (
            <div className="max-w-3xl animate-in fade-in duration-300">
              <h1 className="text-3xl font-bold text-gray-900 mb-8 pb-4 border-b border-gray-100">
                {activeContent.title}
              </h1>
              <div className="prose prose-gray max-w-none prose-headings:text-gray-900 prose-a:text-[#ff6c2f]">
                {activeContent.content}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
