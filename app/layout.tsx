import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./provider";
import { Toaster } from "@/components/ui/sonner"


export const metadata: Metadata = {
  title: "Care-Worker-Management",
  description: "An app to manage care workers clock-in and clock-out times",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`antialiased`}
      >     
            <Providers>
                {children}
                <Toaster/>
            </Providers>     
      </body>
    </html>
  );
}