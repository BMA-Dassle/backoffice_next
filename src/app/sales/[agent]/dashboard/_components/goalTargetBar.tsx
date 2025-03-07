"use server";

import { ProgressRoot, ProgressSection, Tooltip } from "@mantine/core";
import React, { cache } from "react";
import { unstable_cache } from "next/cache";
import { getLiveTotal } from "../_lib/cards/getLiveTotal";
import dayjs from "dayjs";
import { getGoalData } from "../_lib/cards/getGoal";

export async function GoalTargetBar({ agent }: { agent: string }) {
  const liveTotal = await getLiveTotal(agent);
  const goalTotal = await getGoalData(agent, dayjs().year(), dayjs().month() + 1);
  const livePercent = Math.round((liveTotal.intValue / goalTotal.intValue) * 100);

  let color = "red.8";
  if (livePercent > 33 && livePercent <= 66) {
    color = "yellow.5";
  } else if (livePercent > 66) {
    color = "green.8";
  }

  return (
    <ProgressRoot size={"100%"}>
      <Tooltip label={`${liveTotal.format()} - ${livePercent}%`}>
        <ProgressSection value={livePercent} color={color}></ProgressSection>
      </Tooltip>
    </ProgressRoot>
  );
}
