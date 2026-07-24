"use client";
import { useEffect, useState } from "react";
import CookieConsent, { getCookieConsentValue } from "react-cookie-consent";
import Link from "next/link";

const COOKIE_NAME = "user_cookie_consent";
const GA_ID = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID;
const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type VendorWindow = typeof window & { dataLayer?: unknown[]; fbq?: any; _fbq?: unknown };

const loadGoogleAnalytics = () => {
  if (!GA_ID || document.getElementById("ga-script")) return;
  const win = window as VendorWindow

  const script = document.createElement("script");
  script.id = "ga-script";
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  script.async = true;
  document.head.appendChild(script);

  win.dataLayer = win.dataLayer || [];
  function gtag(...args: unknown[]) {
    win.dataLayer!.push(args);
  }
  gtag("js", new Date());
  gtag("config", GA_ID);
};

const loadFacebookPixel = () => {
  const win = window as VendorWindow
  if (!FB_PIXEL_ID || win.fbq) return;

  const fbq: VendorWindow["fbq"] = function (...args: unknown[]) {
    if (fbq.callMethod) {
      fbq.callMethod(...args);
    } else {
      fbq.queue.push(args);
    }
  };
  fbq.queue = [];
  fbq.loaded = true;
  fbq.version = "2.0";
  win.fbq = fbq;
  win._fbq = fbq;

  const script = document.createElement("script");
  script.async = true;
  script.src = "https://connect.facebook.net/en_US/fbevents.js";
  const firstScript = document.getElementsByTagName("script")[0];
  firstScript?.parentNode?.insertBefore(script, firstScript);

  win.fbq("init", FB_PIXEL_ID);
  win.fbq("track", "PageView");
};

export default function CookieConsentBanner() {
  const [consented, setConsented] = useState(false);

  useEffect(() => {
    if (getCookieConsentValue(COOKIE_NAME) === "true") {
      setConsented(true);
    }
  }, []);

  useEffect(() => {
    if (!consented) return;
    loadGoogleAnalytics();
    loadFacebookPixel();
  }, [consented]);

  return (
    <CookieConsent
      buttonText="Accept"
      declineButtonText="Decline"
      enableDeclineButton
      cookieName={COOKIE_NAME}
      disableStyles={true}
      containerClasses="fixed inset-x-4 bottom-4 sm:inset-x-auto sm:right-4 sm:max-w-md z-40 flex flex-col sm:flex-row items-center gap-4 rounded-2xl border border-white/10 bg-surface/95 backdrop-blur-xl p-5 text-white text-sm shadow-[0_24px_70px_rgba(0,0,0,0.35)]"
      buttonWrapperClasses="flex gap-2 shrink-0"
      buttonClasses="px-4 py-2 font-semibold text-sm rounded-full cursor-pointer bg-white text-black transition-colors duration-150 hover:bg-white/90"
      declineButtonClasses="px-4 py-2 font-semibold text-sm rounded-full cursor-pointer bg-white/10 text-white transition-colors duration-150 hover:bg-white/15"
      expires={365}
      onAccept={() => setConsented(true)}
    >
      <p>
        We use cookies to improve your experience and show you relevant advertising.
        Click <strong>&quot;Accept&quot;</strong> to agree or <strong>&quot;Decline&quot;</strong> to opt out. Find out more in the <Link className="underline" href="/legal/privacy">Privacy Policy</Link>.
      </p>
    </CookieConsent>
  );
}
