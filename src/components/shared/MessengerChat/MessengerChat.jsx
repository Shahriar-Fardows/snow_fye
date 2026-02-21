"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

const MessengerChat = () => {
  const [messengerPageId, setMessengerPageId] = useState("");

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch("/api/general-settings");
        if (response.ok) {
          const data = await response.json();
          if (data.messengerPageId && data.messengerEnabled !== false) {
            setMessengerPageId(data.messengerPageId);
          }
        }
      } catch (error) {
        console.error("Error fetching Messenger settings:", error);
      }
    };

    fetchSettings();
  }, []);

  if (!messengerPageId) return null;

  return (
    <>
      <div id="fb-root"></div>
      <div 
        id="fb-customerchat"
        className="fb-customerchat" 
        attribution="setup_tool" 
        page_id={messengerPageId}
      ></div>
      <Script id="messenger-chat-script" strategy="lazyOnload">
        {`
          var chatbox = document.getElementById('fb-customerchat');
          chatbox.setAttribute("page_id", "${messengerPageId}");
          chatbox.setAttribute("attribution", "biz_inbox");

          window.fbAsyncInit = function() {
            FB.init({
              xfbml            : true,
              version          : 'v18.0'
            });
          };

          (function(d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) return;
            js = d.createElement(s); js.id = id;
            js.src = 'https://connect.facebook.net/en_US/sdk/xfbml.customerchat.js';
            fjs.parentNode.insertBefore(js, fjs);
          }(document, 'script', 'facebook-jssdk'));
        `}
      </Script>
    </>
  );
};

export default MessengerChat;
