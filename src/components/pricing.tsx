import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";

const tiers = [
  {
    name: "Basic",
    price: 4.99,
    description: "Perfect for personal use.",
    action: "Get Started",
    features: ["5 email aliases", "Basic spam filtering", "Email forwarding"],
  },
  {
    name: "Pro",
    price: 9.99,
    description:
      "Ideal for businesses with multiple email aliases and advanced spam filtering.",
    action: "Get Started",
    features: [
      "20 email aliases",
      "Advanced spam filtering",
      "Priority support",
    ],
  },
  {
    name: "Enterprise",
    price: 49,
    action: "Contact Us",
    description: "Customized solutions for large organizations.",
    features: [
      "Unlimited email aliases",
      "Dedicated account manager",
      "API access",
    ],
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {tiers.map((tier) => (
            <Card key={tier.name} className="flex flex-col">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">
                  {tier.name}
                </CardTitle>
                <p className="text-gray-600">{tier.description}</p>
              </CardHeader>
              <CardContent className="flex-grow">
                {tier.name !== "Enterprise" && (
                  <p className="text-4xl font-bold mb-4">
                    € {tier.price}
                    <span className="text-lg font-normal text-gray-600">
                      /mo
                    </span>
                  </p>
                )}
                {tier.name === "Enterprise" && (
                  <p className="text-4xl font-bold mb-4">Contact Us</p>
                )}
                <ul className="space-y-2">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-center">
                      <Check className="w-5 h-5 text-green-500 mr-2" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full">{tier.action}</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
