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
                <p className="text-center text-sm text-ink-strong/50"><strong>Effective date:</strong> July 24, 2026</p>
                <p className="pt-3 text-sm sm:text-base text-ink-strong/80">Your privacy is very important to us. This Privacy Policy explains how we collect, use, store, and protect your personal data when you interact with our website and services.</p>
            </div>
            <div className="mx-auto max-w-3xl w-full flex flex-col gap-8">
                <div>
                    <h3 className="pb-3 text-lg sm:text-xl font-semibold">What We Collect</h3>
                    <p className="text-sm sm:text-base text-ink-strong/80">When you fill out our &quot;Get Started&quot; form, we collect:</p>
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-sm sm:text-base text-ink-strong/80">
                        <li>Your fitness goal, how you identify, your age range, and your motivation</li>
                        <li>Whether you have Instagram installed</li>
                        <li>Your name, email address, and Instagram handle</li>
                        <li>Your IP address, used only to prevent spam submissions</li>
                    </ul>
                    <p className="mt-3 text-sm sm:text-base text-ink-strong/80">When you purchase a program, we collect:</p>
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-sm sm:text-base text-ink-strong/80">
                        <li>Your email address, provided to us by Stripe after a successful payment</li>
                        <li>The program purchased, the amount paid, and the currency</li>
                    </ul>
                    <p className="mt-3 text-sm sm:text-base text-ink-strong/80">
                        We never see or store your card details — payment is handled entirely by Stripe on its own secure checkout page.
                    </p>
                </div>

                <div className="border-t border-black/5 pt-8">
                    <h3 className="pb-3 text-lg sm:text-xl font-semibold">Why We Collect This Data</h3>
                    <p className="text-sm sm:text-base text-ink-strong/80">We collect this data to:</p>
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-sm sm:text-base text-ink-strong/80">
                        <li>Contact you regarding our coaching programs and offers</li>
                        <li>Provide personalized support</li>
                        <li>Process your purchase and deliver the program you bought</li>
                        <li>Improve our services and user experience</li>
                        <li>Send important updates or communication</li>
                    </ul>
                    <p className="mt-3 text-sm sm:text-base text-ink-strong/80">We rely on your explicit consent when you submit the form, and on performance of our agreement with you when you make a purchase.</p>
                </div>

                <div className="border-t border-black/5 pt-8">
                    <h3 className="pb-3 text-lg sm:text-xl font-semibold">How Your Data is Used</h3>
                    <p className="text-sm sm:text-base text-ink-strong/80">We use your information solely to:</p>
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-sm sm:text-base text-ink-strong/80">
                        <li>Communicate with you (including via Instagram or email)</li>
                        <li>Match you with the right fitness or nutrition program</li>
                        <li>Confirm and deliver a program you purchased</li>
                        <li>Respond to your questions or requests</li>
                    </ul>
                    <p className="mt-3 text-sm sm:text-base text-ink-strong/80">We do not sell your data. We share it only with the service providers that help us run the site, each acting under their own privacy and security terms:</p>
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-sm sm:text-base text-ink-strong/80">
                        <li><strong>Stripe</strong> — processes payments; handles your card details directly, we never receive them</li>
                        <li><strong>Supabase</strong> — securely hosts our database (form submissions and purchase records)</li>
                        <li><strong>Telegram</strong> — sends me a private notification when you submit the form or make a purchase, so I can follow up promptly</li>
                        <li><strong>Google Analytics</strong> — helps us understand how visitors use the site</li>
                        <li><strong>Meta (Facebook) Pixel</strong> — used for advertising, and only loads after you accept cookies</li>
                    </ul>
                    <p className="mt-3 text-sm sm:text-base text-ink-strong/80">We may also disclose data when required by law.</p>
                </div>

                <div className="border-t border-black/5 pt-8">
                    <h3 className="pb-3 text-lg sm:text-xl font-semibold">Data Storage & Security</h3>
                    <p className="text-sm sm:text-base text-ink-strong/80">
                        Your data is stored securely in our Supabase database, access to which is restricted to Yevhenii. Payment information is handled entirely by Stripe and never touches our servers.
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
                        We use Google Analytics to understand how visitors use the site. The Meta (Facebook) advertising pixel only loads after you accept cookies via the banner shown on your first visit.
                        You can withdraw consent at any time by clearing your cookies, or disable cookies entirely in your browser settings.
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
                    <p className="mt-2 text-sm sm:text-base text-ink-strong/80">yevheni.fit@gmail.com</p>
                </div>
            </div>
            <Button href="/" variant="outline-dark" className="mx-auto">Back to home</Button>
        </section>
    )
}

export default Privacy
