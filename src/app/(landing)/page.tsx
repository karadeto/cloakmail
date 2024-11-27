import EmailAliasAnimation from "@/components/email-alias-animation";
import Features from "@/components/features";
import Footer from "@/components/footer";
import Header from "@/components/header";
import Hero from "@/components/hero";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header />
      <main>
        <Hero />
        <section className="px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto hidden md:block">
            <EmailAliasAnimation />
          </div>
        </section>
        <Features />
      </main>
      <Footer />
    </div>
  );
}
