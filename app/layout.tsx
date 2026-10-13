import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Una casa. un mes | Ayudemos a un hogar en Pacora",
  description: "Cada mes, un hogar en Panamá. Conoce el caso de Pacora y suma tu apoyo.",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased">{children}</body>
    </html>
  );
}
