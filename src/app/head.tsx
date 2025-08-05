export default function Head() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Yevhenii Fit - Online Coaching & Fitness Programs",
    url: "https://www.yevheniifit.com",
    logo: "https://www.yevheniifit.com/logo.png",
    sameAs: ["https://www.instagram.com/_ev_ge_niii_/"],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
