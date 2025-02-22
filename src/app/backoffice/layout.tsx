"use client";

import { AppShell, Burger, Container, Drawer, Group, Paper } from "@mantine/core";
import { Link, Navbar } from "@/_components/ui/navbar";
import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks";
import { setHidden } from "@/lib/redux/reducers/menu";
import { useDocumentTitle } from "@mantine/hooks";
import { IconCash, IconPointerDollar } from "@tabler/icons-react";
import { useParams, usePathname } from "next/navigation";

export default function LeagueLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const hidden = useAppSelector((state) => state.menu.hidden);
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const params = useParams<{ centerID: string }>();

  const links: Link[] = [
    { link: `/backoffice/${params.centerID}/cash`, label: "Cash Management", icon: IconCash },
    {
      link: `/backoffice/${params.centerID}/expenses`,
      label: "Expense Form",
      icon: IconPointerDollar,
    },
  ];

  useDocumentTitle(links.find((link) => link.link == pathname)?.label || "None");

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
