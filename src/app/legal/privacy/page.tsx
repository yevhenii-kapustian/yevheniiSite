import { flexColStyles, textDescriptionStyles } from "../styles";
import { basicButtonStyles } from "@/styles/button";
import { babes } from "@/app/fonts";

const Privacy = () => {
    return(
        <section className={`p-16 ${flexColStyles}`}>
            <h1 className={`text-5xl text-center ${babes.className}`}>Privacy policy</h1>
            <div className={`${flexColStyles}`}>
                <div>
                    <h3 className={`${textDescriptionStyles}`}>Your privacy is important</h3>
                    <p>
                        We are totally committed to protecting the privacy of our site visitors and customers, we fully appreciate and respect the importance of privacy on the Internet. We will not disclose information about my customers to third parties except where it is part of providing a service to you - e.g. arranging for a product to be sent to you, carrying out credit and other security checks and for the purposes of customer research and profiling or where we have your express permission to do so.
                    </p>
                </div>

                <div>
                    <h3 className={`${textDescriptionStyles}`}>Your consent</h3>
                    <p>
                        We will not sell your name, address, e-mail address, credit card information or personal information to any third party (excluding partners from whom you may have linked to our site) without your permission.
                    </p>
                </div>

                <div>
                    <h3 className={`${textDescriptionStyles}`}>Communication & marketing</h3>
                    <p>
                        If you have made a purchase from my store I may occasionally update you on our latest products, news and special offers via e-mail. All our customers have the option to opt-out of receiving marketing communications from me and/or selected third parties. If you do not wish to continue to receive marketing from me and/or selected third parties on checkout.
                    </p>
                </div>

                <div>
                    <h3 className={`${textDescriptionStyles}`}>Cookies</h3>
                    <p>
                        A cookie are a small information file that is sent to your computer and is stored on your hard drive. If you have registered with us then your computer will store an identifying cookie which will save you time each time you re-visit our site, by remembering your email address for you. You can change the settings on your browser to prevent cookies being stored on your computer without your explicit consent.
                    </p>
                </div>

                <div>
                    <h3 className={`${textDescriptionStyles}`}>Checking your details</h3>
                    <p>
                        If you wish to verify the details you have submitted to us you may do so by contacting us via thee-mail address given below. Our security procedures mean that we may request proof of identity before we reveal information. This proof of identity will take the form of your e-mail address and password submitted upon registration. You must therefore keep this information safe as you will be responsible for any action which we take in response to a request from someone using your e-mail and password. We would strongly recommend that you do not use the browser's password memory function as that would permit other people using your terminal to access your personal information.
                    </p>
                </div>

                <div>
                    <h3 className={`${textDescriptionStyles}`}>Contacting us</h3>
                    <p>
                        We are always pleased to hear from my customers (even if it is a complaint!). we are always grateful for any time you spend providing us with the knowledge we need to ensure our customers are completely satisfied - we want you to return to the site and to recommend us to your friends and family. If you have any questions or feedback about this statement, or if you would like us to stop processing your information, please do not hesitate to contact customer support, who will be delighted to answer any questions you may have.
                    </p>
                </div>
            </div>
            <a className={`${basicButtonStyles}`} href="/">Back to home</a>
        </section>
    )
}

export default Privacy