import { ThemeProvider } from "@/components/theme-provider";
import { VersionProvider } from "@/components/version-provider";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Add your viewport meta here */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <VersionProvider>
            {children}
            <Toaster />
          </VersionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
