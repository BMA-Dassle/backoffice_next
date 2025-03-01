"use server";

import { ProgressRoot, ProgressSection, Tooltip } from "@mantine/core";
import React, { cache } from "react";
import { getEventTotals } from "../_lib/getEventTotals";

const getTotals = cache(async (agent: string) => {
  return await getEventTotals(agent);
});

export async function RevenueBreakdownBar({ agent }: { agent: string }) {
  const totals = await getTotals(agent);
  const total = totals.quoted.add(totals.confirmed);
  const confirmedPercent = Math.round((totals.confirmed.intValue / total.intValue) * 100);
  const quotePercent = Math.round((totals.quoted.intValue / total.intValue) * 100);

  return (
    <ProgressRoot size={"100%"}>
      <Tooltip label={`Confirmed - ${totals.confirmed.format()} - ${confirmedPercent}%`}>
        <ProgressSection value={confirmedPercent} color="green.5"></ProgressSection>
      </Tooltip>

      <Tooltip label={`Quoted - ${totals.quoted.format()} - ${quotePercent}%`}>
        <ProgressSection value={quotePercent} color="yellow.4"></ProgressSection>
      </Tooltip>
    </ProgressRoot>
  );
}
