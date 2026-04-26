import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import LeadsProvider from "@/contexts/LeadsContext";
import UserProfileProvider from "@/contexts/UserProfileContext";
import AuthProvider from "@/contexts/AuthContext";
import { ModalProvider } from "@/contexts/ModalContext";
import ThemeProvider from "@/contexts/ThemeContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Prospo",
  description: "Find and win more clients with AI-powered lead generation, case studies, and outreach tools designed for freelancers and agencies.",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  keywords: ["freelance", "agency", "lead generation", "case studies", "outreach tools", "client acquisition", "AI-powered", "business growth"],
  openGraph: {
    title: "Prospo - AI-Powered Lead Generation and Outreach for Freelancers and Agencies",
    description: "Find and win more clients with Prospo's AI-powered lead generation, case studies, and outreach tools designed for freelancers and agencies.",
    url: "https://prospo.com",
    siteName: "Prospo",
    images: [
      {
        url: "https://prospo.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "Prospo - AI-Powered Lead Generation and Outreach for Freelancers and Agencies",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} "text-[14px] md:text-[15px] 2xl:text-[18px] bg-background text-text tracking-[5%] antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
        <ModalProvider>
        <AuthProvider>
        <UserProfileProvider>
        <LeadsProvider>
        {children}
        </LeadsProvider>
        </UserProfileProvider>
        </AuthProvider>
        </ModalProvider>
        </ThemeProvider>
        </body>
    </html>
  );
}
