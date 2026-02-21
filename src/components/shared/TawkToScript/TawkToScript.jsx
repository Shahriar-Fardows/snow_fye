"use client";

import { useEffect, useState } from "react";

const TawkToScript = () => {
  const [tawkToPropertyId, setTawkToPropertyId] = useState("");
  const [tawkToWidgetId, setTawkToWidgetId] = useState("");

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch("/api/general-settings");
        if (response.ok) {
          const data = await response.json();
          if (data.tawkToPropertyId && data.tawkToWidgetId && data.tawkToEnabled !== false) {
            setTawkToPropertyId(data.tawkToPropertyId);
            setTawkToWidgetId(data.tawkToWidgetId);
          }
        }
      } catch (error) {
        console.error("Error fetching Tawk.to settings:", error);
      }
    };

    fetchSettings();
  }, []);

  useEffect(() => {
    if (tawkToPropertyId && tawkToWidgetId) {
      // Create script dynamically to avoid duplication & hydration errors
      var s1 = document.createElement("script"), s0 = document.getElementsByTagName("script")[0];
      s1.async = true;
      s1.src = `https://embed.tawk.to/${tawkToPropertyId}/${tawkToWidgetId}`;
      s1.charset = 'UTF-8';
      s1.setAttribute('crossorigin', '*');
      if (s0 && s0.parentNode) {
        s0.parentNode.insertBefore(s1, s0);
      } else {
        document.head.appendChild(s1);
      }
    }
  }, [tawkToPropertyId, tawkToWidgetId]);

  return null;
};

export default TawkToScript;
