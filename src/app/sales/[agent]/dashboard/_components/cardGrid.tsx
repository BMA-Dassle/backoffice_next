"use server";

import { Grid, GridCol } from "@mantine/core";
import React from "react";
import { ConfirmedRevenueCard } from "./cards/confirmedCard";
import { ConfirmedEventsCard } from "./cards/confirmedEventsCard";
import { GoalCard } from "./cards/goalCard";
import { LiveRevenueCard } from "./cards/liveCard";
import { OtherEventsCard } from "./cards/otherEventsCard";
import { QuotedRevenueCard } from "./cards/quotedCard";
import { TotalRevenueCard } from "./cards/totalsCard";
import { ConversionRateCard } from "./cards/conversionRateCard";

export async function CardGrid({ agent }: { agent: string }) {
  return (
    <Grid columns={6}>
      <GridCol span={1}>
        <ConfirmedRevenueCard agent={agent} />
      </GridCol>
      <GridCol span={1}>
        <QuotedRevenueCard agent={agent} />
      </GridCol>
      <GridCol span={1}>
        <LiveRevenueCard agent={agent} />
      </GridCol>
      <GridCol span={1}>
        <OtherEventsCard agent={agent} />
      </GridCol>
      <GridCol span={1}>
        <ConfirmedEventsCard agent={agent} />
      </GridCol>
      <GridCol span={1}>
        <ConversionRateCard agent={agent} />
      </GridCol>
      <GridCol span={3}>
        <TotalRevenueCard agent={agent} />
      </GridCol>
      <GridCol span={3}>
        <GoalCard agent={agent} />
      </GridCol>
    </Grid>
  );
}
