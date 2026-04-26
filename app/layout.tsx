import type { Metadata, Viewport } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ThemeProvider } from "@/components/theme-provider";
import { AxeA11y } from "@/components/axe-a11y";
import { Toaster } from "@/components/ui/Toaster";
import { MetaPixel } from "@/components/analytics/MetaPixel";
import "./globals.css";

// Tipografía 2026: Inter (cuerpo, alta legibilidad on-screen) + Plus Jakarta Sans
// (display: títulos, badges, labels uppercase). Las CSS variables legacy
// --font-fraunces y --font-dm-sans se mapean en globals.css → no hace falta
// tocar los inline styles de los componentes.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'https://www.incluai.com.ar'),
  title: {
    default: 'IncluAI — Planificá clases inclusivas en minutos',
    template: '%s · IncluAI',
  },
  description:
    'Inteligencia artificial especializada en educación inclusiva para docentes, familias y profesionales de salud en Argentina. Guías concretas y personalizadas para cada alumno, cada discapacidad, cada contenido.',
  applicationName: 'IncluAI',
  keywords: [
    'educación inclusiva',
    'DUA',
    'Argentina',
    'TEA',
    'discapacidad',
    'docentes',
    'IA',
    'Claude',
  ],
  authors: [{ name: 'IncluAI' }],
  openGraph: {
    title: 'IncluAI — Educación inclusiva con IA',
    description: 'Guías pedagógicas y clínicas para docentes, familias y profesionales de salud.',
    type: 'website',
    locale: 'es_AR',
  },
  manifest: '/manifest.webmanifest',
};

export const viewport: Viewport = {
  themeColor: '#2E86C1',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es-AR"
      suppressHydrationWarning
      className={`${inter.variable} ${jakarta.variable} antialiased`}
    >
      <body className="min-h-screen">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <AxeA11y />
          {children}
          <Toaster />
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
        <MetaPixel />
      </body>
    </html>
  );
}
