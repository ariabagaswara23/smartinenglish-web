import { Metadata } from "next";
import AboutHero from "@/components/about/AboutHero";
import OurStory from "@/components/about/OurStory";
import VisionMission from "@/components/home-page/VisionMission";
import WhyChooseUs from "@/components/about/WhyChooseUs";
import ImpactCounter from "@/components/about/ImpactCounter";
import OurTeam from "@/components/about/OurTeam";

export const metadata: Metadata = {
  title: "About Us - Smart In English",
  description: "Kenali lebih dekat tentang cerita, visi misi, dan tim pengajar kami.",
};

export default function AboutPage() {
  return (
    <main>
      <AboutHero />
      <OurStory />
      <VisionMission />
      <WhyChooseUs />
      <ImpactCounter />
      <OurTeam />
    </main>
  );
}
