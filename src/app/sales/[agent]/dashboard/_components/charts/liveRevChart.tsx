"use client";

import { CompositeChart } from "@mantine/charts";
import React from "react";
import { data } from "../../_lib/data";

export function LiveRevChart() {
  return (
    <CompositeChart
      className="h-full"
      data={data}
      dataKey="date"
      maxBarWidth={30}
      series={[
        { name: "Tomatoes", color: "rgba(18, 120, 255, 0.2)", type: "bar" },
        { name: "Apples", color: "red.8", type: "line" },
        { name: "Oranges", color: "yellow.8", type: "area" },
      ]}
      curveType="linear"
    />
  );
}
