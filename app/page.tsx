import Hero from "../components/home-page/Hero";
import About from "../components/home-page/About";
import VisionMission from "../components/home-page/VisionMission";
import Programs from "../components/home-page/Programs";
import Events from "../components/home-page/Events";
import SocialProof from "@/components/home-page/SocialProof";
import Testimonials from "@/components/home-page/Testimonials";
import FAQ from "@/components/home-page/FAQ";
import WhatsAppCTA from "@/components/home-page/WhatsAppCTA";

export default function Home() {
  return (
    <main>
      <Hero />
      <SocialProof />
      <About />
      {/* <VisionMission /> */}
      <Programs />
      <Events />
      <Testimonials />
      <FAQ />
      <WhatsAppCTA />
    </main>
  );
}
