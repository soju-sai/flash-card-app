import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { ClientProviders } from "@/components/ClientProviders";
import { AppHeader } from "@/components/AppHeader";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Flash Card",
  description: "A flash card learning application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider 
      signInFallbackRedirectUrl="/dashboard"
      signUpFallbackRedirectUrl="/dashboard"
      afterSignOutUrl="/"
    >
      <html lang="en">
        <body className={`${poppins.variable} antialiased font-sans`}>
          <ClientProviders>
            <AppHeader />
            {children}
          </ClientProviders>
        </body>
      </html>
    </ClerkProvider>
  );
}
