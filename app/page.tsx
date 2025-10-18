"use client";

import { UserButton, SignedIn, SignedOut } from "@clerk/nextjs";

export default function Home() {
  return (
    <main className="h-screen flex items-center justify-center flex-col gap-4">
      <SignedIn>
        <div className="flex items-center">
          <UserButton afterSignOutUrl="/sign-in" />
        </div>
      </SignedIn>
    </main>
  );
}
