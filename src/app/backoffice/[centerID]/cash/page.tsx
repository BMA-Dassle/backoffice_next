"use client";

import { Alert, Box, Center, Portal, Stack, Title } from "@mantine/core";
import { CashTable } from "./_components/shiftsTable";
import { getLocation } from "@/app/_actions/getLocation";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useWindowScroll } from "@mantine/hooks";
import { FlaggedDrawer } from "./_components/drawer";
import { IconAlertCircle } from "@tabler/icons-react";
import { useAppSelector } from "@/lib/redux/hooks";
import { getOpenChecks } from "./_actions/getOpen";

function CashPage() {
  const params = useParams<{ centerID: string }>();

  const date = useAppSelector((state) => state.report.date);

  const { data: location } = useQuery({
    queryKey: ["locations"],
    queryFn: () => getLocation(params.centerID),
  });

  const { data: openOrders } = useQuery({
    queryKey: ["orders"],
    refetchInterval: 1 * (60 * 1000),
    queryFn: () => getOpenChecks(params.centerID, date),
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
        {/* <Center>
          <Alert
            variant="filled"
            color="red"
            title="Open Checks"
            icon={<IconAlertCircle />}
            w={"35%"}
          >
            You have {openOrders?.length} open checks. Please close them as soon as possible.
          </Alert>
        </Center> */}
        {params.centerID && <CashTable centerID={params.centerID} />}
        <FlaggedDrawer />
      </Stack>
    </>
  );
}

export default CashPage;
