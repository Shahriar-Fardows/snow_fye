"use client";

import { Book, FileText, MessageSquare, Search, Settings, Star } from "lucide-react";
import { useState } from "react";

export default function AdminDocumentationPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const documentationTopics = [
    {
      id: "reviews",
      icon: <Star className="w-6 h-6 text-[#ff6c2f]" />,
      title: "Product Reviews System",
      description: "How the customer review verification system works.",
      content: [
        "Customer reviews are strictly verified by the backend API.",
        "Users can only leave a review if their email address matches an order containing the specific Product ID.",
        "If you wish to globally disable customer reviews, navigate to 'General Settings' > 'Feature Toggles' and turn off 'Customer Reviews Enabled'."
      ]
    },
    {
      id: "chat-widgets",
      icon: <MessageSquare className="w-6 h-6 text-[#ff6c2f]" />,
      title: "Chat & Support Widgets",
      description: "Setting up WhatsApp, Messenger, and Tawk.to.",
      content: [
        "The website supports 3 robust chat systems: WhatsApp, Messenger Chat Plugin, and Tawk.to.",
        "You can configure their IDs right in 'General Settings' under 'Social Media Links'.",
        "WhatsApp: Enter your phone number (e.g., 017...) and the website intelligently turns it into an automatic https://wa.me link.",
        "Messenger: Paste your Facebook Page ID.",
        "Tawk.to: Paste your Property ID and Widget ID.",
        "To hide any chat widget temporarily, scroll down to 'Feature Toggles' in 'General Settings' and turn its specific switch OFF. You do not need to delete your IDs!"
      ]
    },
    {
      id: "text-formatter",
      icon: <FileText className="w-6 h-6 text-[#ff6c2f]" />,
      title: "Rich Text Formatter",
      description: "Editing products and blogs seamlessly.",
      content: [
        "The outdated text areas have been completely replaced with a powerful modern Rich Text Formatter (ReactQuill).",
        "You can find this formatter when Adding/Editing a Product ('Products' page) or when creating a new Blog ('Blog Settings').",
        "It supports Bold, Italics, Lists, HTML injection, and formatting preservation."
      ]
    },
    {
      id: "general-settings",
      icon: <Settings className="w-6 h-6 text-[#ff6c2f]" />,
      title: "General Settings Data Fetching",
      description: "How the general settings pull data and initialize.",
      content: [
        "The General Settings are seamlessly bound to the /api/general-settings API endpoint.",
        "If the settings appear blank upon initial load, simply fill out the primary fields (like your phone numbers or social links) and hit Save.",
        "The settings are cached for fast delivery on the frontend."
      ]
    }
  ];

  const filteredDocs = documentationTopics.filter(
    (doc) =>
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.content.some((line) => line.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="p-4 md:p-8">
      <div className="container max-w-5xl mx-auto">
        {/* Header section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Book className="w-8 h-8 text-[#ff6c2f]" />
                System Documentation
              </h1>
              <p className="text-gray-600 mt-2">
                Learn how to operate and customize the advanced features of your website.
              </p>
            </div>
            
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search documentation..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff6c2f] focus:border-transparent transition-colors shadow-sm"
              />
            </div>
          </div>
        </div>

        {/* Content Section */}
        {filteredDocs.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center text-gray-500">
            <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-lg font-medium">No documentation found for "{searchQuery}"</p>
            <p className="text-sm mt-1">Try searching for keywords like "chat", "reviews", or "text".</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredDocs.map((doc) => (
              <div key={doc.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-6 bg-gray-50 border-b border-gray-100 flex items-start gap-4">
                  <div className="p-2 bg-white rounded-lg shadow-sm inline-flex">
                    {doc.icon}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{doc.title}</h2>
                    <p className="text-sm font-medium text-gray-600 mt-1">{doc.description}</p>
                  </div>
                </div>
                <div className="p-6">
                  <ul className="space-y-3">
                    {doc.content.map((point, index) => (
                      <li key={index} className="flex items-start gap-3 text-gray-700 text-sm leading-relaxed">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#ff6c2f] mt-2 flex-shrink-0" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
