"use server";

import { Card, CardSection, Container, Group, Title } from "@mantine/core";
import { IconCoin } from "@tabler/icons-react";
import React, { cache, Suspense } from "react";
import { getEventTotals } from "../../_lib/cards/getEventTotals";
import { RevenueBreakdownBar } from "../revenueBreakdown";

const getTotals = cache(async (agent: string) => {
  return await getEventTotals(agent);
});

async function DataTitle({ agent }: { agent: string }) {
  const totals = await getTotals(agent);

  return (
    <Title order={3} c="blue">
      {totals.confirmed.add(totals.quoted).format()}
    </Title>
  );
}

export async function TotalRevenueCard({ agent }: { agent: string }) {
  return (
    <Card shadow="sm" padding="xl" radius="md" withBorder className="flex-grow">
      <CardSection p="sm">
        <Group justify="space-between">
          <Title c="dimmed" order={5}>
            Total Revenue
          </Title>
          <IconCoin color="var(--mantine-color-dimmed)" />
        </Group>
      </CardSection>
      <CardSection p="sm">
        <Group grow gap="xl" justify="flex-start">
          <Suspense
            fallback={
              <Title order={3} c="blue">
                Loading...
              </Title>
            }
          >
            <DataTitle agent={agent} />
          </Suspense>
          <Container w="auto" h="2em">
            <Suspense>
              <RevenueBreakdownBar agent={agent} />
            </Suspense>
          </Container>
        </Group>
      </CardSection>
    </Card>
  );
}
