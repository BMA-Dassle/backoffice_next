"use client";

import { AppShell, Burger, Group, Paper } from "@mantine/core";
import { Link, Navbar } from "@/_components/ui/navbar";
import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks";
import { setHidden } from "@/lib/redux/reducers/menu";
import { IconCash, IconCoins, IconTrophy } from "@tabler/icons-react";

export default function LeagueLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const hidden = useAppSelector((state) => state.menu.hidden);
  const dispatch = useAppDispatch();

  const links: Link[] = [];

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
            <Burger opened={hidden} onClick={() => dispatch(setHidden(!hidden))} size="sm" />
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
