"use client";
import CookieConsent from "react-cookie-consent";
import Script from "next/script";
import { cookieContainer,
         cookieWrapperButtons,
         cookieButton
        } from "./styles";

export default function CookieConsentBanner() {
  return (
    <>
      <CookieConsent
        buttonText="Accept"
        declineButtonText="Decline"
        enableDeclineButton
        cookieName="user_cookie_consent"
        disableStyles={true}
        containerClasses={cookieContainer}
        buttonWrapperClasses={cookieWrapperButtons}
        buttonClasses={`${cookieButton} bg-[#4ade80] text-black`}
        declineButtonClasses={`${cookieButton} bg-[#ef4444] text-white`}
        expires={365}
      >
        <p>We use cookies to improve your experience and show you relevant advertising.
            Click <strong>"Accept"</strong> to agree or <strong>"Decline"</strong> to opt out. Find out more in the <a className="underline" href="/legal/privacy">Privacy Policy</a>.
        </p>
      </CookieConsent>

      <Script
        id="facebook-pixel"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            if (document.cookie.includes("user_cookie_consent=true")) {
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '1682995145732700');
              fbq('track', 'PageView');
            }
          `,
        }}
      />
    </>
  );
}

