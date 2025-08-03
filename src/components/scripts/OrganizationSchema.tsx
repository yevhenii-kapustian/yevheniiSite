import Script from "next/script";

export default function OrganizationSchema() {
  return(
    <Script
             id="organization-jsonld"
             type="application/ld+json"
             strategy="afterInteractive"
             dangerouslySetInnerHTML={{
               __html: JSON.stringify({
                 "@context": "https://schema.org",
                 "@type": "Organization",
                 name: "Yevhenii Fit",
                 url: "https://www.yevheniifit.com",
                 logo: "https://www.yevheniifit.com/og-image.png",
                 sameAs: [
                   "https://www.instagram.com/_ev_ge_niii_/",
                 ],
               }),
             }}
    />
  )
}