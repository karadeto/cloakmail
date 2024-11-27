import { Filter, Shield, Zap } from "lucide-react";

const features = [
  {
    name: "Privacy Protection",
    description:
      "Shield your real email address and control who can contact you.",
    icon: Shield,
  },
  {
    name: "Smart Filtering",
    description:
      "Advanced AI-powered filters to block spam and categorize your emails.",
    icon: Filter,
  },
  {
    name: "Lightning Fast",
    description:
      "Optimized email routing for quick delivery and response times.",
    icon: Zap,
  },
];

export default function Features() {
  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="container mx-auto">
        <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-12">
          Powerful Features for Your Email Needs
        </h2>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.name}
              className="bg-white p-6 rounded-lg shadow-md"
            >
              <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full mb-4">
                <feature.icon className="w-6 h-6 text-[#6236FF]" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {feature.name}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
