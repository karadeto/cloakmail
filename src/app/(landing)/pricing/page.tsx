import Footer from "@/components/footer";
import Header from "@/components/header";
import Pricing from "@/components/pricing";

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header />
      <main>
        <div className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto text-center mb-8">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-8">
              Simple, Transparent Pricing
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the plan that's right for you.
            </p>
          </div>
          <Pricing />
        </div>
      </main>
      <Footer />
    </div>
  );
}
