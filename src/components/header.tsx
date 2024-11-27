import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";

export default async function Header() {
  const { userId } = auth();
  return (
    <header className="py-6 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-gray-800">
          <Image src="/cloakmail.png" alt="logo" width={120} height={120} />
        </Link>
        <nav className="hidden md:flex space-x-10">
          <Link href="/#features" className="text-gray-600 hover:text-gray-900">
            Features
          </Link>
          <Link href="/pricing" className="text-gray-600 hover:text-gray-900">
            Pricing
          </Link>
          <Link href="#" className="text-gray-600 hover:text-gray-900">
            About
          </Link>
        </nav>
        <div className="flex items-center">
          {!userId ? (
            <>
              <SignInButton>
                <Button variant="outline" className="mr-4">
                  Log in
                </Button>
              </SignInButton>
              <SignUpButton>
                <Button variant="default">Sign up</Button>
              </SignUpButton>
            </>
          ) : (
            <div className="flex items-center">
              <Button variant="outline" className="mr-4" asChild>
                <Link href="/dashboard">Dashboard</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
