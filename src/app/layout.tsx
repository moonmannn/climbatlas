import type { Metadata } from "next";
import { LanguageProvider } from "@/components/LanguageProvider";
import { SupabaseProvider } from "@/components/SupabaseProvider";
import { UserProfileProvider } from "@/components/UserProfileProvider";
import { UserRoutesProvider } from "@/components/UserRoutesProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "ClimbAtlas",
  description: "Discover famous climbing destinations around the world."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <LanguageProvider>
          <SupabaseProvider>
            <UserProfileProvider>
              <UserRoutesProvider>{children}</UserRoutesProvider>
            </UserProfileProvider>
          </SupabaseProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
