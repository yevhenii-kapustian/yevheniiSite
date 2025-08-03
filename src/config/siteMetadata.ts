import type { Metadata } from "next";

export const siteMetadata: Metadata = {
    title: "Yevhenii Fit - Online Coaching & Fitness Programs",
    description:
        "Transform your body and mind with expert coaching, personalized workouts, and meal plans. Join Yevhenii Fit and start your transformation today!",
    metadataBase: new URL("https://www.yevheniifit.com"),
    openGraph: {
        title: "Yevhenii Fit - Online Coaching & Fitness Programs",
        description:
        "Transform your body and mind with expert coaching, personalized workouts, and meal plans. Join Yevhenii Fit and start your transformation today!",
        url: "https://www.yevheniifit.com",
        siteName: "Yevhenii Fit",
        locale: "en_US",
        type: "website",
        images: [
        {
            url: "https://www.yevheniifit.com/og-image.png",
            width: 1200,
            height: 630,
            alt: "Yevhenii Fit - Online Coaching Cover",
        },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Yevhenii Fit - Online Coaching & Fitness Programs",
        description:
        "Transform your body and mind with expert coaching, personalized workouts, and meal plans. Join Yevhenii Fit and start your transformation today!",
        images: ["https://www.yevheniifit.com/og-image.png"],
    },
    icons: {
        icon: "/favicon.ico",
        apple: "/apple-touch-icon.png",
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
        index: true,
        follow: true,
        "max-snippet": -1,
        "max-image-preview": "large",
        "max-video-preview": -1,
        },
    },
    other: {
        "fb:app_id": "1682995145732700",
    },
}