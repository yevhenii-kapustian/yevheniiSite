'use client'

import WelcomeSection from "@/components/WelcomeSection";
import WellnessSection from "@/components/WellnessSection";
import Form from "@/components/Form";
import LayoutWrapperMotion from "./motion-wrapper";


export default function Home() {
  return (
    <>
    <LayoutWrapperMotion>
      <WelcomeSection title={<>
                            <span className="max-sm:text-5xl">This is your moment.</span> 
                            <br/><span className="max-sm:text-[clamp(4.5rem,17vw,6rem)]">Right here. Right now.</span> 
                            <br/><span className="max-sm:text-[clamp(5rem,20vw,8rem)]">On site.</span></>
                            }
                      description="Stop waiting for “Monday”. Start now. The gym builds more than 
                                   muscles — it builds confidence. With us, you'll get a custom workout
                                   plan, smart nutrition, and real support. Train right, eat well, feel
                                   stronger. One step at a time — and you're already on your way."
      />
      <WellnessSection/>
    </LayoutWrapperMotion>
    {/* <Form/> */}
    </>
  );
}
 