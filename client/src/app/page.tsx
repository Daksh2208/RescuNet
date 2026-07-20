import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ModulesSection from "@/components/ModulesSection";
import Features from "@/components/Features";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <ModulesSection />
      <Features />
      <Footer />
    </main>
  );
}