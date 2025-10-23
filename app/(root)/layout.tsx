"use client"

import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";
import SidebarWrapper from "@/components/shared/sidebar/SidebarWrapper";
import LoadingLogo from "@/components/shared/LoadingLogo";
import { SignIn } from "@clerk/nextjs";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <AuthLoading>
        <LoadingLogo />
      </AuthLoading>
      <Authenticated>
        <SidebarWrapper>{children}</SidebarWrapper>
      </Authenticated>
      <Unauthenticated>
        <SignIn />
      </Unauthenticated>
    </>
  );
};

export default Layout;
