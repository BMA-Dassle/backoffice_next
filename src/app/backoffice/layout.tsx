"use client";

import { AppShell, Burger, Group } from "@mantine/core";
import { Navbar } from "../../components/navbar";
import { useAppSelector, useAppDispatch } from "../lib/redux/hooks";
import { setHidden } from "../lib/redux/reducers/menu";
import { IconCash } from "@tabler/icons-react";

export default function BackofficeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const hidden = useAppSelector((state) => state.menu.hidden);
  const dispatch = useAppDispatch();

  const links = [{ link: "/backoffice/cash", label: "Closeout Cash Sheet", icon: IconCash }];

  return (
    <>
      <AppShell
        header={{ height: 60 }}
        navbar={{
          width: 300,
          breakpoint: "sm",
          collapsed: { mobile: !hidden, desktop: !hidden },
        }}
        padding="md"
      >
        <AppShell.Header>
          <Group h="100%" px="md">
            <Burger
              opened={hidden}
              onClick={() => dispatch(setHidden(!hidden))}
              hiddenFrom="sm"
              size="sm"
            />
            <Burger
              opened={hidden}
              onClick={() => dispatch(setHidden(!hidden))}
              visibleFrom="sm"
              size="sm"
            />
          </Group>
        </AppShell.Header>
        <AppShell.Navbar>
          <Navbar linksData={links} />
        </AppShell.Navbar>
        <AppShell.Main>{children}</AppShell.Main>
      </AppShell>
    </>
  );
}
