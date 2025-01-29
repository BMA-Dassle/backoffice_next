import "./globals.css";

import "@mantine/core/styles.css";

import {
  ColorSchemeScript,
  MantineColorsTuple,
  MantineProvider,
  Paper,
  createTheme,
  mantineHtmlProps,
} from "@mantine/core";
import StoreProvider from "@/components/storeProvider";
import { DatesProvider } from "@mantine/dates";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export const metadata = {
  title: "My Mantine app",
  description: "I have followed setup instructions carefully",
};

const myColor: MantineColorsTuple = [
  "#FFFFFF",
  "#E3F2FD",
  "#BBDEFB",
  "#90CAF9",
  "#83b4fe",
  "#42A5F5",
  "#83b4fe",
  "#1E88E5",
  "#1976D2",
  "#1565C0",
];

const theme = createTheme({
  colors: {
    myColor,
  },
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        <MantineProvider defaultColorScheme="dark" theme={theme}>
          <DatesProvider
            settings={{
              locale: "en",
              firstDayOfWeek: 0,
              weekendDays: [6, 0],
              timezone: "America/New_York",
            }}
          >
            <StoreProvider>
              <Paper>{children}</Paper>
            </StoreProvider>
          </DatesProvider>
        </MantineProvider>
      </body>
    </html>
  );
}
