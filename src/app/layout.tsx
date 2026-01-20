import type { Metadata } from "next";
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/notifications/styles.css';
import "./globals.css";
import { MantineProvider, ColorSchemeScript, QueryProvider } from "@/components/providers";

export const metadata: Metadata = {
  title: "Book Appointment | Uponco",
  description: "Book your appointment with our wellness and beauty specialists",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        <QueryProvider>
          <MantineProvider>
            {children}
          </MantineProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
