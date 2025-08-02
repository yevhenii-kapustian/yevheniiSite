import { babes } from "@/app/fonts"
import { flexColStyles, textTitleStyles } from "../styles"
import { basicButtonStyles } from "@/styles/button"
import Link from "next/link"

export const metadata = {
    title: "Terms & Conditions",
    description: "Learn how we collect, use, and protect your personal data. Your privacy and trust are important to us. Read our full Privacy Policy to understand your rights.",
}

const TermsConditions = () => {
    return(
        <section className={`pt-25 px-6 pb-6 ${flexColStyles}`}>
            <h1 className={`text-5xl text-center ${babes.className}`}>Terms and conditions</h1>
            <div className={`${flexColStyles}`}>
                <div>
                    <h3 className={`${textTitleStyles}`}>Risk of product use</h3>
                    <p>
                        This website's content is not a substitute for direct, personal, professional medical care and diagnosis. None of the meal plans or exercise programs should be performed or otherwise used without clearance from your physician or health care provider first. The information contained within is not intended to provide specific physical or mental health advice, or any other advice whatsoever, for any individual or company and should not be relied upon in that regard. We are not medical professionals and nothing on this website should be misconstrued to mean otherwise.
                        There may be risks associated with participating in activities mentioned on our site for people in poor health or with pre-existing physical or mental health conditions. Because these risks exist, you will not participate in any meal plans available from us. if you are in poor health or have a pre-existing mental or physical condition. If you choose to participate in these risks, you do so of your own free will and accord, knowingly and voluntarily assuming all risks associated with such dietary activities. These risks may also exist for those who are currently in good health right now.
                        As with any exercise program, you assume certain risks to your health and safety. Any form of exercise program can cause injuries, and our programs are no exception. It is possible that you may become injured doing the exercises in your program, especially if they are done with poor form. Although thorough instruction is included on the form for each exercise. Be aware that our programs (like any other exercise program) do involve a risk of injury. If you choose to participate in these risks, you do so of your own free will and accord, knowingly and voluntarily assuming all risks associated with such exercise activities. These risks may also exist for those who are currently in good health right now.
                        We are not medical practitioners. Our advice whether it be on our website, in our meal plans, exercise program's or via email coaching, none of it is meant as a substitute for medical advice. You must consult your doctor before beginning ANY meal plan or exercise program, with no exceptions. You are using our plans, programs, workout's and coaching at your own risk and we are not responsible for any injuries or health problems you may experience or even death as a result of using our programs.
                        It is to be made clear that we are not responsible for any injuries or health problems you may experience or even death as a result of using any of our products or services.
                    </p>
                </div>

                <div>
                    <h3 className={`${textTitleStyles}`}>Generally expected results</h3>
                    <p>
                        Although our products and services are intended to be fully implemented, sometimes they are not, which could result in a lack of progress/results for the user. If you implement the products and services from us correctly you should see amazing results, however, it must be disclaimed that even when consumers implement any products or services in full from us it is still possible they will not get the results they may have expected and it is also possible they will not lose fat or gain muscle or achieve any positive results of any kind.
                    </p>
                </div>

                <div>
                    <h3 className={`${textTitleStyles}`}>Testimonial disclaimer</h3>
                    <p>
                        All the transformations and testimonials are real. However, it must be disclaimed that these testimonials are not claimed to represent typical results with our meal plans and workout programs. They are meant as a showcase of what the most motivated and dedicated people can achieve by following our personalized meal plans and workout programs. Your results may vary and you may not get the same results compared to someone else when using our services due to differences in your individual exercise history, genetics, and personal motivation/dedication. The end results you get will depend upon the individual and how much effort you put in.
                    </p>
                </div>
            </div>
            <Link className={`${basicButtonStyles} border-black hover:bg-black hover:border-white hover:text-white mx-auto my-0`} href="/">Back to home</Link>
        </section>
    )
}

export default TermsConditions