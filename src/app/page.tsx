import WelcomeSection from "@/components/WelcomeSection";
import WellnessSection from "@/components/WellnessSection";
import Form from "@/components/Form";


export default function Home() {
  return (
    <>
    <WelcomeSection title={<><span className="max-sm:text-5xl">This is your moment.</span> <br/><span className="max-sm:text-7xl">Right here. Right now.</span> <br/><span className="max-sm:text-[85px]">On site.</span></>}
                    description="Stop waiting for “Monday”. Start now. The gym builds more than muscles — it builds confidence. With us, you'll get a custom workout plan, smart nutrition, and real support. Train right, eat well, feel stronger. One step at a time — and you're already on your way."
    />
    <WellnessSection/>
    {/* <Form/> */}
    </>
  );
}
 