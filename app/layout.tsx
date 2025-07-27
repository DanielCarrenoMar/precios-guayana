import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import Navbar from "@/components/nav-bar";
import { createClient } from "@/lib/supabase/server";
import { ReactNode } from "react";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Next.js and Supabase Starter Kit",
  description: "The fastest way to build apps with Next.js and Supabase",
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  display: "swap",
  subsets: ["latin"],
});

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  let userProfile = null;
  if (data?.claims?.sub) {
    const { data: profile } = await supabase
      .from("user")
      .select("name")
      .eq("id", data.claims.sub)
      .single();
    userProfile = profile;
  }

  return (
    <html lang="es">
      <body className="min-h-screen flex flex-col">
        <Navbar user={userProfile} />
        <div className="flex-1 w-full pt-20 flex flex-col" style={{ minHeight: "calc(100vh - 80px)" }}>
          {children}
        </div>
      </body>
    </html>
  );
}
