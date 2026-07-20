"use client";
import CookieConsent from "react-cookie-consent";
import Script from "next/script";
import Link from "next/link";

export default function CookieConsentBanner() {
  const fbPixelId = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID;

  return (
    <>
      <CookieConsent
        buttonText="Accept"
        declineButtonText="Decline"
        enableDeclineButton
        cookieName="user_cookie_consent"
        disableStyles={true}
        containerClasses="w-full p-6 fixed z-40 flex flex-col sm:flex-row justify-evenly items-center gap-5 bg-black text-white text-sm"
        buttonWrapperClasses="flex gap-5"
        buttonClasses="px-3 py-2 font-semibold text-sm rounded cursor-pointer bg-green-400 text-black"
        declineButtonClasses="px-3 py-2 font-semibold text-sm rounded cursor-pointer bg-red-500 text-white"
        expires={365}
      >
        <p>
          We use cookies to improve your experience and show you relevant advertising.
          Click <strong>"Accept"</strong> to agree or <strong>"Decline"</strong> to opt out. Find out more in the <Link className="underline" href="/legal/privacy">Privacy Policy</Link>.
        </p>
      </CookieConsent>

      <Script
        id="facebook-pixel"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            if (document.cookie.includes("user_cookie_consent=true") && '${fbPixelId}') {
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${fbPixelId}');
              fbq('track', 'PageView');
            }
          `,
        }}
      />
    </>
  );
}
