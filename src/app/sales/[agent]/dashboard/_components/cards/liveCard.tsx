"use server";

import { Card, CardSection, Group, Title } from "@mantine/core";
import { IconBoxModel2 } from "@tabler/icons-react";
import React, { Suspense } from "react";
import { getLiveTotal } from "../../_lib/cards/getLiveTotal";
import { unstable_cache } from "next/cache";

const getLive = unstable_cache(
  async (agent: string) => {
    return (await getLiveTotal(agent)).format();
  },
  ["dashboardLiveTotal"],
  { revalidate: 60, tags: ["dashboardLiveTotal"] }
);

async function DataTitle({ agent }: { agent: string }) {
  const total = await getLive(agent);

  return (
    <Title order={3} c="indigo.5">
      {total}
    </Title>
  );
}

export async function LiveRevenueCard({ agent }: { agent: string }) {
  return (
    <Card shadow="sm" padding="xl" radius="md" withBorder className="grow">
      <CardSection p="sm">
        <Group justify="space-between">
          <Title c="dimmed" order={5}>
            Live Revenue
          </Title>
          <IconBoxModel2 color="var(--mantine-color-dimmed)" />
        </Group>
      </CardSection>
      <CardSection p="sm">
        <Suspense
          fallback={
            <Title order={3} c="indigo.5">
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
