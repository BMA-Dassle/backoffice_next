"use server";

import { Card, CardSection, Group, Title } from "@mantine/core";
import { IconFileDollar } from "@tabler/icons-react";
import React, { cache, Suspense } from "react";
import { getEventTotals } from "../../_lib/getEventTotals";

const getQuoted = cache(async (agent: string) => {
  return await getEventTotals(agent);
});

async function DataTitle({ agent }: { agent: string }) {
  const total = await getQuoted(agent);

  return (
    <Title order={3} c="yellow.4">
      {total.quoted.format()}
    </Title>
  );
}

export async function QuotedRevenueCard({ agent }: { agent: string }) {
  return (
    <Card shadow="sm" padding="xl" radius="md" withBorder className="grow">
      <CardSection p="sm">
        <Group justify="space-between">
          <Title c="dimmed" order={5}>
            Quoted Revenue
          </Title>
          <IconFileDollar color="var(--mantine-color-dimmed)" />
        </Group>
      </CardSection>
      <CardSection p="sm">
        <Suspense
          fallback={
            <Title order={3} c="yellow.4">
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
