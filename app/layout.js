import { DM_Sans, Fraunces } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"]
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"]
});

export const metadata = {
  title: "Scaler Scheduler",
  description: "Production-ready scheduling platform built with Next.js, Prisma, Neon, and Resend."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${dmSans.variable} ${fraunces.variable}`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
