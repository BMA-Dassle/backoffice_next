"use server";

import { Card, CardSection, Group, Title } from "@mantine/core";
import { IconSquarePercentage } from "@tabler/icons-react";
import React, { cache, Suspense } from "react";
import { getTotalEvents } from "../../_lib/cards/getTotalEvents";

const getEvents = cache(async (agent: string) => {
  return await getTotalEvents(agent);
});

async function DataTitle({ agent }: { agent: string }) {
  const total = await getEvents(agent);

  return (
    <Title order={3} c="cyan.6">
      {Math.round((total.confirmed / total.other) * 100)}%
    </Title>
  );
}

export async function ConversionRateCard({ agent }: { agent: string }) {
  return (
    <Card shadow="sm" padding="xl" radius="md" withBorder className="grow">
      <CardSection p="sm">
        <Group justify="space-between">
          <Title c="dimmed" order={5}>
            Conversion Rate
          </Title>
          <IconSquarePercentage color="var(--mantine-color-dimmed)" />
        </Group>
      </CardSection>
      <CardSection p="sm">
        <Suspense
          fallback={
            <Title order={3} c="cyan.6">
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
