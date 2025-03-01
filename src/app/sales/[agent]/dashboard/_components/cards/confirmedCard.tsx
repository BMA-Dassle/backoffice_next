"use server";

import { Card, CardSection, Group, Skeleton, Title } from "@mantine/core";
import { IconCalendarDollar } from "@tabler/icons-react";
import React, { cache, Suspense } from "react";
import { getEventTotals } from "../../_lib/getEventTotals";

const getConfirmed = cache(async (agent: string) => {
  return await getEventTotals(agent);
});

async function DataTitle({ agent }: { agent: string }) {
  const total = await getConfirmed(agent);

  return (
    <Title order={3} c="green.5">
      {total.confirmed.format()}
    </Title>
  );
}

export async function ConfirmedRevenueCard({ agent }: { agent: string }) {
  return (
    <Card shadow="sm" padding="xl" radius="md" withBorder className="grow">
      <CardSection p="sm">
        <Group justify="space-between">
          <Title c="dimmed" order={5}>
            Confirmed Revenue
          </Title>
          <IconCalendarDollar color="var(--mantine-color-dimmed)" />
        </Group>
      </CardSection>
      <CardSection p="sm">
        <Suspense
          fallback={
            <Title order={3} c="green.5">
              Loading...
            </Title>
          }
        >
          <DataTitle agent={agent} />
        </Suspense>
      </CardSection>
    </Card>
  );
}
