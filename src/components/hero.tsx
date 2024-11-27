import { Button } from "@/components/ui/button";
import { SignInButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";

export default async function Hero() {
  const { userId } = auth();
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 mb-8">
          Secure Your Email Address
        </h1>
        <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
          Protect your real email address with multiple aliases, all managed
          through a single, secure gateway.
        </p>
        <div className="flex justify-center space-x-4">
          {!userId ? (
            <>
              <SignInButton>
                <Button size="lg">Get Started for Free</Button>
              </SignInButton>
            </>
          ) : (
            <Button size="lg" variant="default" asChild>
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
