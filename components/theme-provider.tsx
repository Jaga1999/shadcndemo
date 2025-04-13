"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { getDecodedToken } from "@/lib/utils"

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  const [initialTheme, setInitialTheme] = React.useState<string | undefined>(undefined);

  React.useEffect(() => {
    const fetchTheme = async () => {
      const decoded = await getDecodedToken();
      if (decoded?.preferences?.theme) {
        setInitialTheme(decoded.preferences.theme);
      }
    };
    fetchTheme();
  }, []);

  return (
    <NextThemesProvider 
      enableSystem={true}
      enableColorScheme={true}
      storageKey="ui-theme"
      attribute="class"
      defaultTheme="system"
      forcedTheme={initialTheme}
      {...props}
    >
      {children}
    </NextThemesProvider>
  )
}
