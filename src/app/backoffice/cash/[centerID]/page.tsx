"use client";

import { Box, Button, Center, Group, Portal, Stack, Title, Text } from "@mantine/core";
import { CashTable } from "../_components/shiftsTable";
import { getLocation } from "@/app/_actions/getLocation";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useHeadroom, useWindowScroll } from "@mantine/hooks";

export function CashPage() {
  const params = useParams<{ centerID: string }>();

  const { data: location } = useQuery({
    queryKey: ["locations"],
    queryFn: () => getLocation(params.centerID),
  });

  const [scroll] = useWindowScroll();

  return (
    <>
      <Portal>
        <Box
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            padding: "var(--mantine-spacing-xs)",
            height: 60,
            zIndex: 1000000,
            transform: `translate3d(0, ${scroll.y > 75 ? 0 : "-110px"}, 0)`,
            transition: "transform 400ms ease",
            backgroundColor: "var(--mantine-color-body)",
            borderBottom: "1px solid var(--mantine-color-dark-4)",
          }}
        >
          <Center>
            <Title order={3}>{location?.businessName}</Title>
          </Center>
        </Box>
      </Portal>
      <Stack align="stretch" justify="center" gap="md">
        <Center>
          <Title order={3}>{location?.businessName}</Title>
        </Center>
        {params.centerID && <CashTable centerID={params.centerID} />}
      </Stack>
    </>
  );
}

export default CashPage;
