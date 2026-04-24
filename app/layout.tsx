import type { Metadata, Viewport } from "next";
import { Poppins, Nunito } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ThemeProvider } from "@/components/theme-provider";
import { AxeA11y } from "@/components/axe-a11y";
import "./globals.css";

// Mantengo los nombres de CSS variables (--font-fraunces, --font-dm-sans) para no
// romper referencias en estilos inline y CSS; solo cambian las fuentes que carga.
const fraunces = Poppins({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  display: "swap",
});

const dmSans = Nunito({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
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
      className={`${fraunces.variable} ${dmSans.variable} antialiased`}
    >
      <body className="min-h-screen">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <AxeA11y />
          {children}
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
