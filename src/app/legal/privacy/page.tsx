import { babes } from "@/app/fonts";
import Button from "@/components/Button";

export const metadata = {
    title: "Privacy Policy",
    description: "Learn how we collect, use, and protect your personal data. Your privacy and trust are important to us. Read our full Privacy Policy to understand your rights.",
}

const Privacy = () => {
    return(
        <section className="pt-10 px-6 pb-6 flex flex-col gap-7">
            <div>
                <h1 className={`${babes.className} text-3xl sm:text-4xl text-center`}>Privacy Policy</h1>
                <h2 className="text-sm sm:text-base"><strong>Effective date:</strong> July 20, 2025</h2>
                <p className="text-sm sm:text-base">Your privacy is very important to us. This Privacy Policy explains how we collect, use, store, and protect your personal data when you interact with our website and services.</p>
            </div>
            <div className="flex flex-col gap-7">
                <div>
                    <h3 className="pb-3 text-lg sm:text-xl font-semibold">What We Collect</h3>
                    <h4 className="text-sm sm:text-base font-medium">When you fill out our form, we collect the following personal data:</h4>
                    <div className="text-sm sm:text-base">
                        <p>Your name</p>
                        <p>Your email address</p>
                        <p>Your Instagram handle</p>
                        <p>Any additional information you provide in free-text fields</p>
                    </div>
                </div>

                <div>
                    <h3 className="pb-3 text-lg sm:text-xl font-semibold">Why We Collect This Data</h3>
                    <h4 className="text-sm sm:text-base font-medium">We collect this data to:</h4>
                    <div className="text-sm sm:text-base">
                        <p>Contact you regarding our coaching programs and offers</p>
                        <p>Provide personalized support</p>
                        <p>Improve our services and user experience</p>
                        <p>Send important updates or communication</p>
                    </div>
                    <p className="text-sm sm:text-base">We rely on your explicit consent when you submit the form.</p>
                </div>

                <div>
                    <h3 className="pb-3 text-lg sm:text-xl font-semibold">How Your Data is Used</h3>
                    <h4 className="text-sm sm:text-base font-medium">We use your information solely to:</h4>
                    <div className="text-sm sm:text-base">
                        <p>Communicate with you (including via Instagram or email)</p>
                        <p>Match you with the right fitness or nutrition program</p>
                        <p>Respond to your questions or requests</p>
                    </div>
                    <h4 className="text-sm sm:text-base font-medium">We do not sell or share your data with third parties, except:</h4>
                    <div className="text-sm sm:text-base">
                        <p>When required by law</p>
                        <p>When using trusted service providers (e.g. Stripe for payments, Meta for advertising), and only under strict confidentiality agreements</p>
                    </div>
                </div>

                <div>
                    <h3 className="pb-3 text-lg sm:text-xl font-semibold">Data Storage & Security</h3>
                    <p className="text-sm sm:text-base">
                        Your data is stored securely using encrypted tools and protected databases.
                        We retain your data only as long as necessary for the purpose of communication or service delivery, and then delete or anonymize it.
                    </p>
                </div>

                <div>
                    <h3 className="pb-3 text-lg sm:text-xl font-semibold">Your Rights</h3>
                    <h4 className="text-sm sm:text-base font-medium">At any time, you may:</h4>
                    <div className="text-sm sm:text-base">
                        <p>Request to access your data</p>
                        <p>Ask us to correct or delete your data</p>
                        <p>Withdraw your consent</p>
                        <p>Object to marketing communications</p>
                    </div>
                    <p className="text-sm sm:text-base">To do so, simply contact us using the information at the bottom of this page.</p>
                </div>

                <div>
                    <h3 className="pb-3 text-lg sm:text-xl font-semibold">Cookies</h3>
                    <p className="text-sm sm:text-base">
                        Our website may use cookies to enhance user experience and store preferences.
                        You can disable cookies in your browser settings at any time.
                    </p>
                </div>

                <div>
                    <h3 className="pb-3 text-lg sm:text-xl font-semibold">Instagram and Messaging</h3>
                    <p className="text-sm sm:text-base">
                        By submitting your Instagram handle, you consent to us reaching out to you via Instagram to follow up or provide coaching information.
                    </p>
                </div>

                <div>
                    <h3 className="pb-3 text-lg sm:text-xl font-semibold">Consent</h3>
                    <p className="text-sm sm:text-base">
                        By using our site and submitting your information through a form, you agree to the terms outlined in this Privacy Policy.
                    </p>
                </div>

                <div>
                    <h3 className="pb-3 text-lg sm:text-xl font-semibold">Contact Us</h3>
                    <h4 className="text-sm sm:text-base font-medium">If you have any questions, concerns, or wish to request or delete your data, please contact us at:</h4>
                    <div className="text-sm sm:text-base">
                        <p>ke1vin.kapustian@gmail.com</p>
                    </div>
                </div>
            </div>
            <Button href="/" variant="outline-dark" className="mx-auto">Back to home</Button>
        </section>
    )
}

export default Privacy
