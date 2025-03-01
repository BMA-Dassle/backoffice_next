"use server";

import { Card, CardSection, Group, Title } from "@mantine/core";
import { IconCalendarWeek } from "@tabler/icons-react";
import React from "react";

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
        <Title order={3} c="grape.4">
          N/A
        </Title>
      </CardSection>
    </Card>
  );
}
