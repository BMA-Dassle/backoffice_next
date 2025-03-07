"use server";

import { Card, CardSection, Container, Group, Title } from "@mantine/core";
import { IconCalendarWeek } from "@tabler/icons-react";
import React, { cache, Suspense } from "react";
import { getGoalData } from "../../_lib/cards/getGoal";
import dayjs from "dayjs";
import { GoalTargetBar } from "../goalTargetBar";

const getGoal = cache(async (agent: string) => {
  return (await getGoalData(agent, dayjs().year(), dayjs().month() + 1)).format();
});

async function DataTitle({ agent }: { agent: string }) {
  const goal = await getGoal(agent);

  return (
    <Title order={3} c="grape.4">
      {goal}
    </Title>
  );
}

export async function GoalCard({ agent }: { agent: string }) {
  return (
    <Card shadow="sm" padding="xl" radius="md" withBorder className="flex-grow">
      <CardSection p="sm">
        <Group justify="space-between">
          <Title c="dimmed" order={5}>
            Monthly Goal
          </Title>
          <IconCalendarWeek color="var(--mantine-color-dimmed)" />
        </Group>
      </CardSection>
      <CardSection p="sm">
        <Group grow gap="xl" justify="flex-start">
          <Suspense
            fallback={
              <Title order={3} c="grape.4">
                Loading...
              </Title>
            }
          >
            <DataTitle agent={agent} />
          </Suspense>
          <Container w="auto" h="2em">
            <Suspense>
              <GoalTargetBar agent={agent} />
            </Suspense>
          </Container>
        </Group>
      </CardSection>
    </Card>
  );
}
