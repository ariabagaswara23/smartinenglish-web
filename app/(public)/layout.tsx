import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getSiteSettings } from "@/app/admin/settings/actions";
import { SiteSettingsProvider } from "@/providers/SiteSettingsContext";
import WhatsAppModal from "@/components/ui/WhatsAppModal";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let settings = {};
  try {
    settings = await getSiteSettings();
  } catch (error) {
    console.error("Failed to load site settings in PublicLayout:", error);
  }

  return (
    <SiteSettingsProvider initialSettings={settings}>
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
      <WhatsAppModal />
    </SiteSettingsProvider>
  );
}
