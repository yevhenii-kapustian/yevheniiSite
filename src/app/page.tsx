'use client'

import WelcomeSection from "@/components/WelcomeSection";
import WellnessSection from "@/components/WellnessSection";
import BenefitsSection from "@/components/BenefitsSection";
import Form from "@/components/Form/form";
import LayoutWrapperMotion from "./motion-wrapper";
import StatsSection from "@/components/StatsSection";
import ClientTransformationSection from "@/components/ClientTransformationSection";
import FAQs from "@/components/FAQsSection";

export default function Home() {
  return (
    <>
    <LayoutWrapperMotion>
      <WelcomeSection title={<>
                            This is your moment.
                            <br/><span className="text-white/45">Right here. Right now.</span>
                            <br/>On site.</>
                            }
                      description="Stop waiting for “Monday”. Start now. The gym builds more than 
                                   muscles — it builds confidence. With us, you'll get a custom workout
                                   plan, smart nutrition, and real support. Train right, eat well, feel
                                   stronger. One step at a time — and you're already on your way."
      />
      <WellnessSection/>
      <BenefitsSection/>
      <StatsSection/>
      <ClientTransformationSection/>
      <Form/>
      <FAQs/>
    </LayoutWrapperMotion>
    </>
  );
}
 