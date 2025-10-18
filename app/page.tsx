"use client";
import { UserButton } from "@clerk/nextjs";

export default function Home() {

  return (
    <main className="h-screen flex items-center justify-center flex-col gap-4">
      <div className="flex items-center">
        <p className="mr-4">Hi</p>
        <UserButton afterSignOutUrl="/" />
      </div>
    </main>
  );
}
