"use client";

import { UserButton, SignedIn } from "@clerk/nextjs";


export default function Home() {
  return (
    <main className="h-screen flex items-center justify-center flex-col gap-4 overflow-y-hidden">
      <SignedIn>
        <div className="flex items-center">
          <UserButton afterSignOutUrl="/sign-in" />
        </div>
      </SignedIn>
    </main>
  );
}
