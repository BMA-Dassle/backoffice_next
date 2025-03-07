"use client";

import { Link } from "@/_components/ui/navbar";
import { IconHomeFilled } from "@tabler/icons-react";
import { useParams, usePathname } from "next/navigation";
import CustomAppShell from "@/_components/appshell";

export default function SalesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const params = useParams<{ agent: string }>();

  const links: Link[] = [
    { link: `/sales/${params.agent}/dashboard`, label: "Dashboard", icon: IconHomeFilled },
  ];

  return (
    <>
      <title>{links.find((link) => link.link == pathname)?.label || "None"}</title>
      <CustomAppShell links={links}>{children}</CustomAppShell>
    </>
  );
}
