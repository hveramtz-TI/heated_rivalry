import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import LenisProvider from "../components/LenisProvider";
import Reproducer from "../components/Reproducer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Heated Rivalry — Personajes, Temporadas y Libros",
  description:
    "Sitio de fans de Heated Rivalry: explora sus personajes, sus temporadas y los libros de la serie.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <LenisProvider>
          {children}
          <Reproducer />
        </LenisProvider>
      </body>
    </html>
  );
}
