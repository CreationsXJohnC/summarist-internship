import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import ReduxProvider from "@/components/providers/ReduxProvider";
import MainLayout from "@/components/layout/MainLayout";
import AuthModal from "@/components/auth/AuthModal";

const roboto = Roboto({
  weight: ['100', '300', '400', '500', '700', '900'],
  subsets: ["latin"],
  variable: "--font-roboto",
});

export const metadata: Metadata = {
  title: "Summarist - Gain more knowledge in less time",
  description: "Great summaries for busy people, individuals who barely have time to read, and even people who don't like to read.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${roboto.variable} font-roboto antialiased`}>
        <ReduxProvider>
          <MainLayout>
            {children}
          </MainLayout>
          <AuthModal />
        </ReduxProvider>
      </body>
    </html>
  );
}
