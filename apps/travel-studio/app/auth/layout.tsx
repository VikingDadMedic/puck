import type { ReactNode } from "react";

export const metadata = {
  title: "Sign In - Travel Studio",
};

export default function AuthLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
