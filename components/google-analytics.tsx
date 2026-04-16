"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

const GA_ID = "G-CNV2TR0MJB";

export function GoogleAnalytics() {
  const [consented, setConsented] = useState(false);

  useEffect(() => {
    // Check initial consent
    if (localStorage.getItem("cookie_consent") === "accepted") {
      setConsented(true);
    }

    // Listen for consent changes (fired by CookieBanner on accept)
    function onStorage(e: StorageEvent) {
      if (e.key === "cookie_consent" && e.newValue === "accepted") {
        setConsented(true);
      }
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  if (!consented) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="gtag-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}');
        `}
      </Script>
    </>
  );
}
