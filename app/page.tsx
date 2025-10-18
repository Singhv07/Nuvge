"use client";
import { UserButton, useAuth } from "@clerk/nextjs";

export default function Home() {
  const { isLoaded, userId, sessionId } = useAuth();

  return (
    <main className="h-screen flex items-center justify-center flex-col gap-4">
      <div className="flex items-center">
        <p className="mr-4">Hello World!</p>
        <UserButton afterSignOutUrl="/" />
      </div>
      
      <div className="text-sm text-gray-500">
        <p>Auth loaded: {isLoaded ? "yes" : "no"}</p>
        <p>User ID: {userId || "not signed in"}</p>
        <p>Session: {sessionId || "no session"}</p>
      </div>
    </main>
  );
}
