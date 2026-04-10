import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AICompanion from "@/components/layout/AICompanion";
import { AuthProvider } from "@/components/auth/AuthContext";
import OnboardingModal from "@/components/auth/OnboardingModal";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mirai | Hackathon Prototype",
  description: "AI-powered platform for student builders",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.className} bg-[#07080f] text-white min-h-screen`} suppressHydrationWarning>
        <AuthProvider>
          {children}
          <AICompanion />
          <OnboardingModal />
        </AuthProvider>
      </body>
    </html>
  );
}
