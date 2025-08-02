import { flexColStyles, textTitleStyles } from "../styles";
import { basicButtonStyles } from "@/styles/button";
import { babes } from "@/app/fonts";
import Link from "next/link";

export const metadata = {
    title: "Privacy Policy",
    description: "Learn how we collect, use, and protect your personal data. Your privacy and trust are important to us. Read our full Privacy Policy to understand your rights.",
}

const Privacy = () => {
    return(
        <section className={`pt-25 px-6 pb-6 ${flexColStyles}`}>
            <div>
                <h1 className={`text-5xl text-center ${babes.className}`}>Privacy Policy</h1>
                <h2><strong>Effective date:</strong> July 20, 2025</h2>
                <p>Your privacy is very important to us. This Privacy Policy explains how we collect, use, store, and protect your personal data when you interact with our website and services.</p>
            </div>
            <div className={`${flexColStyles}`}>
                <div>
                    <h3 className={`${textTitleStyles}`}>What We Collect</h3>
                    <h4>When you fill out our form, we collect the following personal data:</h4>
                    <div>
                        <p>Your name</p>
                        <p>Your email address</p>
                        <p>Your Instagram handle</p>
                        <p>Any additional information you provide in free-text fields</p>
                    </div>
                </div>

                <div>
                    <h3 className={`${textTitleStyles}`}>Why We Collect This Data</h3>
                    <h4>We collect this data to:</h4>
                    <div>
                        <p>Contact you regarding our coaching programs and offers</p>
                        <p>Provide personalized support</p>
                        <p>Improve our services and user experience</p>
                        <p>Send important updates or communication</p>
                    </div>
                    <p>We rely on your explicit consent when you submit the form.</p>
                </div>

                <div>
                    <h3 className={`${textTitleStyles}`}>How Your Data is Used</h3>
                    <h4>We use your information solely to:</h4>
                    <div>
                        <p>Communicate with you (including via Instagram or email)</p>
                        <p>Match you with the right fitness or nutrition program</p>
                        <p>Respond to your questions or requests</p>
                    </div>
                    <h4>We do not sell or share your data with third parties, except:</h4>
                    <div>
                        <p>When required by law</p>
                        <p>When using trusted service providers (e.g. Stripe for payments, Meta for advertising), and only under strict confidentiality agreements</p>
                    </div>
                </div>

                <div>
                    <h3 className={`${textTitleStyles}`}>Data Storage & Security</h3>
                    <p>
                        Your data is stored securely using encrypted tools and protected databases.
                        We retain your data only as long as necessary for the purpose of communication or service delivery, and then delete or anonymize it.
                    </p>
                </div>

                <div>
                    <h3 className={`${textTitleStyles}`}>Your Rights</h3>
                    <h4>At any time, you may:</h4>
                    <div>
                        <p>Request to access your data</p>
                        <p>Ask us to correct or delete your data</p>
                        <p>Withdraw your consent</p>
                        <p>Object to marketing communications</p>
                    </div>
                    <p>To do so, simply contact us using the information at the bottom of this page.</p>
                </div>

                <div>
                    <h3 className={`${textTitleStyles}`}>Cookies</h3>
                    <p>
                        Our website may use cookies to enhance user experience and store preferences.
                        You can disable cookies in your browser settings at any time.
                    </p>
                </div>

                <div>
                    <h3 className={`${textTitleStyles}`}>Instagram and Messaging</h3>
                    <p>
                        By submitting your Instagram handle, you consent to us reaching out to you via Instagram to follow up or provide coaching information.
                    </p>
                </div>

                <div>
                    <h3 className={`${textTitleStyles}`}>Consent</h3>
                    <p>
                        By using our site and submitting your information through a form, you agree to the terms outlined in this Privacy Policy.
                    </p>
                </div>

                <div>
                    <h3 className={`${textTitleStyles}`}>Contact Us</h3>
                    <h4>If you have any questions, concerns, or wish to request or delete your data, please contact us at:</h4>
                    <div>
                        <p>ke1vin.kapustian@gmail.com</p>
                    </div>
                </div>
            </div>
            <Link className={`${basicButtonStyles} border-black hover:bg-black hover:border-white hover:text-white mx-auto my-0`} href="/">Back to home</Link>
        </section>
    )
}

export default Privacy