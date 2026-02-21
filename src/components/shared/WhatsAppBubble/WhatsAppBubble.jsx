"use client";

import { useEffect, useState } from "react";

const WhatsAppBubble = () => {
  const [whatsappLink, setWhatsappLink] = useState("");

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch("/api/general-settings");
        if (response.ok) {
          const data = await response.json();
          if (data.whatsappLink && data.whatsappEnabled !== false) {
            setWhatsappLink(data.whatsappLink);
          }
        }
      } catch (error) {
        console.error("Error fetching WhatsApp settings:", error);
      }
    };

    fetchSettings();
  }, []);

  if (!whatsappLink) return null;

  let formattedLink = whatsappLink;
  const numCheck = whatsappLink.trim().replace("+", "");
  if (/^\d+$/.test(numCheck)) {
    formattedLink = `https://wa.me/${numCheck}`;
  }

  return (
    <a
      href={formattedLink}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-[#25d366] text-white rounded-full shadow-lg hover:bg-[#1ebe57] transition-colors duration-300 hover:scale-110"
      aria-label="Chat on WhatsApp"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 448 512"
        className="w-8 h-8 fill-current"
      >
        <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zM223.9 414.8c-32 0-63.4-8.6-91-24.9l-6.5-3.9-67.7 17.8 18.1-66-4.3-6.8c-18.1-28.8-27.6-62.2-27.6-96.1 0-99.2 80.8-180 180-180 48 0 93.1 18.7 127 52.6 34 33.9 52.7 79 52.7 127.1 0 99.3-80.8 180.2-180.2 180.2zm98.6-134.8c-5.4-2.7-31.9-15.8-36.8-17.6-4.9-1.8-8.5-2.7-12 2.7-3.6 5.4-14 17.6-17.1 21.2-3.2 3.6-6.3 4.1-11.7 1.4-5.4-2.7-22.8-8.4-43.4-26.8-16-14.3-26.8-31.9-30-37.3-3.2-5.4-.3-8.3 2.4-11 2.4-2.4 5.4-6.3 8.1-9.5 2.7-3.2 3.6-5.4 5.4-9 1.8-3.6.9-6.8-.5-9.5-1.4-2.7-12-28.9-16.4-39.6-4.3-10.4-8.7-9-12-9.1-3.2-.1-6.8-.1-10.4-.1-3.6 0-9.5 1.4-14.5 6.8-4.9 5.4-18.9 18.5-18.9 45s19.4 52.2 22.1 55.8c2.7 3.6 38.1 58.2 92.4 81.6 12.9 5.6 23 8.9 30.9 11.4 13 4.1 24.8 3.5 34.2 2.1 10.5-1.5 31.9-13 36.4-25.6 4.5-12.6 4.5-23.4 3.1-25.6-1.3-2.2-5-3.5-10.4-6.2z"/>
      </svg>
    </a>
  );
};

export default WhatsAppBubble;
