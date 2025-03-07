"use server";

import { ProgressRoot, ProgressSection, Tooltip } from "@mantine/core";
import React, { cache } from "react";
import { unstable_cache } from "next/cache";
import { getLiveTotal } from "../_lib/cards/getLiveTotal";
import dayjs from "dayjs";
import { getGoalData } from "../_lib/cards/getGoal";

const getGoal = cache(async (agent: string) => {
  return await getGoalData(agent, dayjs().year(), dayjs().month() + 1);
});

const getLive = unstable_cache(
  async (agent: string) => {
    const live = await getLiveTotal(agent);
    return {
      value: live,
      display: live.format(),
    };
  },
  ["dashboardLiveProgressBar"],
  { revalidate: 1, tags: ["dashboardLiveProgressBar"] }
);

export async function GoalTargetBar({ agent }: { agent: string }) {
  const liveTotal = await getLive(agent);
  const goalTotal = await getGoal(agent);
  const livePercent = Math.round((liveTotal.value.intValue / goalTotal.intValue) * 100);

  let color = "red.8";
  if (livePercent > 33 && livePercent <= 66) {
    color = "yellow.5";
  } else if (livePercent > 66) {
    color = "green.8";
  }

  return (
    <ProgressRoot size={"100%"}>
      <Tooltip label={`${liveTotal.display} - ${livePercent}%`}>
        <ProgressSection value={livePercent} color={color}></ProgressSection>
      </Tooltip>
    </ProgressRoot>
  );
}
