import { babes } from "@/app/fonts";
import Button from "@/components/Button";

export const metadata = {
    title: "Privacy Policy",
    description: "Learn how we collect, use, and protect your personal data. Your privacy and trust are important to us. Read our full Privacy Policy to understand your rights.",
}

const Privacy = () => {
    return(
        <section className="pt-10 px-6 pb-16 flex flex-col gap-10">
            <div className="mx-auto max-w-3xl w-full flex flex-col gap-2">
                <h1 className={`${babes.className} text-3xl sm:text-4xl text-center`}>Privacy Policy</h1>
                <p className="text-center text-sm text-ink-strong/50"><strong>Effective date:</strong> July 20, 2025</p>
                <p className="pt-3 text-sm sm:text-base text-ink-strong/80">Your privacy is very important to us. This Privacy Policy explains how we collect, use, store, and protect your personal data when you interact with our website and services.</p>
            </div>
            <div className="mx-auto max-w-3xl w-full flex flex-col gap-8">
                <div>
                    <h3 className="pb-3 text-lg sm:text-xl font-semibold">What We Collect</h3>
                    <p className="text-sm sm:text-base text-ink-strong/80">When you fill out our form, we collect the following personal data:</p>
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-sm sm:text-base text-ink-strong/80">
                        <li>Your name</li>
                        <li>Your email address</li>
                        <li>Your Instagram handle</li>
                        <li>Any additional information you provide in free-text fields</li>
                    </ul>
                </div>

                <div className="border-t border-black/5 pt-8">
                    <h3 className="pb-3 text-lg sm:text-xl font-semibold">Why We Collect This Data</h3>
                    <p className="text-sm sm:text-base text-ink-strong/80">We collect this data to:</p>
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-sm sm:text-base text-ink-strong/80">
                        <li>Contact you regarding our coaching programs and offers</li>
                        <li>Provide personalized support</li>
                        <li>Improve our services and user experience</li>
                        <li>Send important updates or communication</li>
                    </ul>
                    <p className="mt-3 text-sm sm:text-base text-ink-strong/80">We rely on your explicit consent when you submit the form.</p>
                </div>

                <div className="border-t border-black/5 pt-8">
                    <h3 className="pb-3 text-lg sm:text-xl font-semibold">How Your Data is Used</h3>
                    <p className="text-sm sm:text-base text-ink-strong/80">We use your information solely to:</p>
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-sm sm:text-base text-ink-strong/80">
                        <li>Communicate with you (including via Instagram or email)</li>
                        <li>Match you with the right fitness or nutrition program</li>
                        <li>Respond to your questions or requests</li>
                    </ul>
                    <p className="mt-3 text-sm sm:text-base text-ink-strong/80">We do not sell or share your data with third parties, except:</p>
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-sm sm:text-base text-ink-strong/80">
                        <li>When required by law</li>
                        <li>When using trusted service providers (e.g. Stripe for payments, Meta for advertising), and only under strict confidentiality agreements</li>
                    </ul>
                </div>

                <div className="border-t border-black/5 pt-8">
                    <h3 className="pb-3 text-lg sm:text-xl font-semibold">Data Storage & Security</h3>
                    <p className="text-sm sm:text-base text-ink-strong/80">
                        Your data is stored securely using encrypted tools and protected databases.
                        We retain your data only as long as necessary for the purpose of communication or service delivery, and then delete or anonymize it.
                    </p>
                </div>

                <div className="border-t border-black/5 pt-8">
                    <h3 className="pb-3 text-lg sm:text-xl font-semibold">Your Rights</h3>
                    <p className="text-sm sm:text-base text-ink-strong/80">At any time, you may:</p>
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-sm sm:text-base text-ink-strong/80">
                        <li>Request to access your data</li>
                        <li>Ask us to correct or delete your data</li>
                        <li>Withdraw your consent</li>
                        <li>Object to marketing communications</li>
                    </ul>
                    <p className="mt-3 text-sm sm:text-base text-ink-strong/80">To do so, simply contact us using the information at the bottom of this page.</p>
                </div>

                <div className="border-t border-black/5 pt-8">
                    <h3 className="pb-3 text-lg sm:text-xl font-semibold">Cookies</h3>
                    <p className="text-sm sm:text-base text-ink-strong/80">
                        Our website may use cookies to enhance user experience and store preferences.
                        You can disable cookies in your browser settings at any time.
                    </p>
                </div>

                <div className="border-t border-black/5 pt-8">
                    <h3 className="pb-3 text-lg sm:text-xl font-semibold">Instagram and Messaging</h3>
                    <p className="text-sm sm:text-base text-ink-strong/80">
                        By submitting your Instagram handle, you consent to us reaching out to you via Instagram to follow up or provide coaching information.
                    </p>
                </div>

                <div className="border-t border-black/5 pt-8">
                    <h3 className="pb-3 text-lg sm:text-xl font-semibold">Consent</h3>
                    <p className="text-sm sm:text-base text-ink-strong/80">
                        By using our site and submitting your information through a form, you agree to the terms outlined in this Privacy Policy.
                    </p>
                </div>

                <div className="border-t border-black/5 pt-8">
                    <h3 className="pb-3 text-lg sm:text-xl font-semibold">Contact Us</h3>
                    <p className="text-sm sm:text-base text-ink-strong/80">If you have any questions, concerns, or wish to request or delete your data, please contact us at:</p>
                    <p className="mt-2 text-sm sm:text-base text-ink-strong/80">ke1vin.kapustian@gmail.com</p>
                </div>
            </div>
            <Button href="/" variant="outline-dark" className="mx-auto">Back to home</Button>
        </section>
    )
}

export default Privacy
