"use client";

import { AppShell, Burger, Group } from "@mantine/core";
import { Link, Navbar } from "@/_components/ui/navbar";
import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks";
import { setHidden } from "@/lib/redux/reducers/menu";
import { IconHomeFilled } from "@tabler/icons-react";
import { useParams, usePathname } from "next/navigation";

export default function CustomAppShell({
  children,
  links,
}: Readonly<{
  children: React.ReactNode;
  links: any;
}>) {
  const hidden = useAppSelector((state) => state.menu.hidden);
  const dispatch = useAppDispatch();
  const pathname = usePathname();

  return (
    <>
      <title>{links.find((link: any) => link.link == pathname)?.label || "None"}</title>
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
          <Navbar linksData={links} noDatePicker />
        </AppShell.Navbar>
        <AppShell.Main>{children}</AppShell.Main>
      </AppShell>
    </>
  );
}
