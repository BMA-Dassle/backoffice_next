import "./globals.css";

import "@mantine/core/styles.css";
import "@mantine/charts/styles.css";

import {
  ColorSchemeScript,
  MantineColorsTuple,
  MantineProvider,
  Paper,
  createTheme,
  mantineHtmlProps,
} from "@mantine/core";
import StoreProvider from "@/_components/providers/storeProvider";
import { DatesProvider } from "@mantine/dates";
import ReactQueryProvider from "./queryProvider";

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
        <title>HeadPinz</title>
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
            <ReactQueryProvider>
              <StoreProvider>
                <Paper>{children}</Paper>
              </StoreProvider>
            </ReactQueryProvider>
          </DatesProvider>
        </MantineProvider>
      </body>
    </html>
  );
}
