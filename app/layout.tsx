import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { QueryClientProvider } from "@/contexts/query-client-provider";
import NextTopLoader from "nextjs-toploader";
import AuthController from "@/components/custom/auth-controller";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EaseTenant",
  description: "EaseTenant our capstone project.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <Script
        src="https://js.chapa.co/v1/inline.js"
        strategy="lazyOnload"
      />

      <body
        className={`${geistSans.variable} ${geistSans.className} ${geistMono.variable} antialiased`}
      >
        <QueryClientProvider>
          <Toaster
            position="top-right"
            closeButton
            richColors
            toastOptions={{
              className: "!font-sans",
              style: {
                "--toast-initial-height": "auto",
              } as React.CSSProperties,
            }}
          />
          <NextTopLoader
            showSpinner={true}
            easing="ease"
            color="#195559"
            zIndex={99999}
          />
          <AuthController>{children}</AuthController>
        </QueryClientProvider>
      </body>
    </html>
  );
}
