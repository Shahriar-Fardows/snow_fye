"use client";

import { MessageCircle, X } from "lucide-react";
import Script from "next/script";
import { useEffect, useRef, useState } from "react";

export default function SupportWidget() {
  const [supportOptions, setSupportOptions] = useState([]);
  const [messengerConfig, setMessengerConfig] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch("/api/general-settings");
        if (response.ok) {
          const data = await response.json();
          const options = [];

          // WhatsApp (Link based)
          if (data.whatsappLink && data.whatsappEnabled !== false) {
            let wpLink = data.whatsappLink.trim();
            if (/^\+?\d+$/.test(wpLink)) {
              const cleanNumber = wpLink.replace(/\D/g, "");
              wpLink = `https://wa.me/${cleanNumber}`;
            }
            options.push({
              id: "whatsapp",
              name: "WhatsApp",
              icon: (
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                </svg>
              ),
              color: "bg-[#25D366] hover:bg-[#128C7E]",
              link: wpLink,
              action: null,
            });
          }

          // Facebook Messenger
          if (data.messengerPageId && data.messengerEnabled !== false) {
            const pageId = data.messengerPageId.trim();
            
            if (pageId) {
              setMessengerConfig({ pageId });

              // Remove manual SDK injection, we will use next/script
              setMessengerConfig({ pageId });
            }

            options.push({
              id: "messenger",
              name: "Facebook Messenger",
              icon: (
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M12 2C6.477 2 2 6.14 2 11.25c0 2.923 1.488 5.518 3.791 7.182v3.318a.75.75 0 0 0 1.157.63l3.226-2.1c1.173.328 2.443.5 3.826.5 5.523 0 10-4.14 10-9.25S17.523 2 12 2zm1.096 12.336-2.583-2.756a.75.75 0 0 0-1.077-.042l-3.565 3.428c-.46.442.227 1.134.733.72l2.673-2.188a.75.75 0 0 0 .93-.057l2.583 2.756a.75.75 0 0 0 1.076.042l3.565-3.428c.46-.442-.227-1.134-.733-.72l-2.602 2.245z"/>
                </svg>
              ),
              color: "bg-[#0084FF] hover:bg-[#006bd1]",
              action: () => {
                if (window.FB) {
                  window.FB.XFBML.parse();
                  if (window.FB.CustomerChat) {
                    window.FB.CustomerChat.show(true);
                    window.FB.CustomerChat.showDialog();
                  } else {
                    console.log("CustomerChat plugin not ready yet.");
                    alert("Messenger is connecting... Please wait a few seconds or disable ad blockers.");
                  }
                } else {
                  console.log("FB SDK not loaded.");
                  alert("Messenger is blocked by your browser or an extension. Try disabling AdBlocker.");
                }
              },
            });
          }

          // Tawk.to (Script Injection)
          if (data.tawkToPropertyId && data.tawkToWidgetId && data.tawkToEnabled !== false) {
            options.push({
              id: "tawkto",
              name: "Live Chat Support",
              icon: (
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.12.553 4.112 1.54 5.86L0 24l6.32-1.66c1.72.93 3.67 1.46 5.68 1.46 6.627 0 12-5.373 12-12S18.627 0 12 0Zm3.71 16.59c-1.38.64-3.11.83-4.59.83-2.64 0-4.9-1.07-6.22-3.13-.53-.82-.54-2.02-.38-2.61.08-.34.33-.42.63-.4.23.01.44.1.66.19.46.21 1.09.43 1.47 0 .19-.21.24-.54.26-.82.02-.32.09-.9.46-.99.23-.06.51.01.73.11.23.11.45.28.66.45.18.15.54.12.72-.03.27-.23.6-.52.93-.84.28-.27.56-.56.84-.84.21-.21.28-.47.11-.75-.15-.24-.31-.49-.44-.75-.11-.23-.19-.52-.1-.76.1-.28.46-.35.73-.32.32.04.88-.04 1.1.28.16.22.18.96.25 1.47.05.42-.09 1.04-.37 1.34-.33.35-.74.63-1.09 1-.22.25-.19.55-.05.78.29.47.8 1.05 1.25 1.31.25.15.58.11.78-.09.34-.33.56-.73 1.04-.97.5-.25 1.05-.1 1.41.34.46.57.8 1.33.6 2.05-.13.43-.89.87-1.38 1.1Z"/>
                </svg>
              ),
              color: "bg-[#03C04A] hover:bg-[#029539]",
              action: () => {
                if (window.Tawk_API) window.Tawk_API.maximize();
              },
            });

            // Inject Tawk.to Script if it doesn't exist
            if (!document.getElementById("tawk-script")) {
              window.Tawk_API = window.Tawk_API || {};
              window.Tawk_LoadStart = new Date();
              
              // Hide native bubble if multiple options exist
              window.Tawk_API.onLoad = function() {
                  if (options.length > 1) {
                      window.Tawk_API.hideWidget();
                  }
              };

              const script = document.createElement("script");
              script.id = "tawk-script";
              script.async = true;
              script.src = `https://embed.tawk.to/${data.tawkToPropertyId.trim()}/${data.tawkToWidgetId.trim()}`;
              script.charset = "UTF-8";
              script.setAttribute("crossorigin", "*");
              document.body.appendChild(script);
            }
          }

          setSupportOptions(options);
        }
      } catch (error) {
        console.error("Error fetching support settings:", error);
      }
    };

    fetchSettings();
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Avoid hiding FB bubble if it's the only option, but we want our custom SupportWidget to control it if multiple
  useEffect(() => {
    if (supportOptions.length > 1 && messengerConfig) {
      const fbCheck = setInterval(() => {
        if (window.FB && window.FB.CustomerChat) {
          window.FB.CustomerChat.hide();
          clearInterval(fbCheck);
        }
      }, 500);
      return () => clearInterval(fbCheck);
    }
  }, [supportOptions.length, messengerConfig]);

  if (supportOptions.length === 0) return null;

  // Single active support option -> Click opens directly without menu
  if (supportOptions.length === 1) {
    const option = supportOptions[0];
    // If it's only messenger, we just render the raw div. 
    // The FB SDK will automatically create the bubble, we don't need our custom button.
    if (option.id === "messenger") {
      return (
        <>
          <div id="fb-root"></div>
          <div 
            id="fb-customer-chat" 
            className="fb-customerchat"
            attribution="biz_inbox"
            page_id={messengerConfig.pageId}
          ></div>
          <Script
             id="facebook-jssdk"
             src="https://connect.facebook.net/en_US/sdk/xfbml.customerchat.js"
             strategy="lazyOnload"
             onLoad={() => {
               if (window.FB) {
                 window.FB.init({
                   xfbml: true,
                   version: "v18.0",
                 });
               }
             }}
          />
        </>
      );
    }

    return (
      <>
        <div id="fb-root"></div>
        <div 
          id="fb-customer-chat" 
          className="fb-customerchat"
          attribution="biz_inbox"
          page_id={messengerConfig.pageId}
        ></div>
        <Script
           id="facebook-jssdk"
           src="https://connect.facebook.net/en_US/sdk/xfbml.customerchat.js"
           strategy="lazyOnload"
           onLoad={() => {
             if (window.FB) {
               window.FB.init({
                 xfbml: true,
                 version: "v18.0",
               });
             }
           }}
        />
        {option.action ? (
          <button
            onClick={option.action}
            className={`fixed bottom-6 right-6 z-50 p-4 rounded-full text-white shadow-lg transition-transform hover:scale-110 flex items-center justify-center ${option.color}`}
            title={`Contact us via ${option.name}`}
          >
            {option.icon}
          </button>
        ) : (
          <a
            href={option.link}
            target="_blank"
            rel="noopener noreferrer"
            className={`fixed bottom-6 right-6 z-50 p-4 rounded-full text-white shadow-lg transition-transform hover:scale-110 flex items-center justify-center ${option.color}`}
            title={`Contact us via ${option.name}`}
          >
            {option.icon}
          </a>
        )}
      </>
    );
  }

  // Multiple active options -> Click toggles menu
  return (
    <>
      <div id="fb-root"></div>
      {messengerConfig && (
        <>
          <div 
            id="fb-customer-chat" 
            className="fb-customerchat"
            attribution="biz_inbox"
            page_id={messengerConfig.pageId}
          ></div>
          <Script
             id="facebook-jssdk"
             src="https://connect.facebook.net/en_US/sdk/xfbml.customerchat.js"
             strategy="lazyOnload"
             onLoad={() => {
               if (window.FB) {
                 window.FB.init({
                   xfbml: true,
                   version: "v18.0",
                 });
               }
             }}
          />
        </>
      )}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end" ref={menuRef}>
        {/* Menu Overlay */}
        {isOpen && (
        <div className="mb-4 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden w-64 animate-in fade-in slide-in-from-bottom-5 duration-200">
          <div className="bg-gray-50 border-b border-gray-100 p-4 text-center">
            <h3 className="text-gray-900 font-semibold">How can we help?</h3>
            <p className="text-xs text-gray-500 mt-1">Choose a channel</p>
          </div>
          <div className="flex flex-col text-sm">
            {supportOptions.map((option) => (
              option.action ? (
                <button
                  key={option.id}
                  onClick={() => {
                    option.action();
                    setIsOpen(false);
                  }}
                  className="flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0 w-full text-left"
                >
                  <div className={`p-2 rounded-full text-white shadow-sm flex-shrink-0 ${option.color}`}>
                    {option.icon}
                  </div>
                  <span className="font-medium text-gray-700">{option.name}</span>
                </button>
              ) : (
                <a
                  key={option.id}
                  href={option.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0"
                >
                  <div className={`p-2 rounded-full text-white shadow-sm flex-shrink-0 ${option.color}`}>
                    {option.icon}
                  </div>
                  <span className="font-medium text-gray-700">{option.name}</span>
                </a>
              )
            ))}
          </div>
        </div>
      )}

      {/* Main Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-4 rounded-full text-white shadow-lg transition-all duration-300 flex items-center justify-center ${
          isOpen ? "bg-gray-800 hover:bg-gray-900 rotate-90 scale-90" : "bg-[#ff6c2f] hover:bg-[#e5612a] hover:scale-110"
        }`}
        title="Support Menu"
      >
        {isOpen ? <X className="w-7 h-7" /> : <MessageCircle className="w-7 h-7" />}
      </button>
    </div>
    </>
  );
}
