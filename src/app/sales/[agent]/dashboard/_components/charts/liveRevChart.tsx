"use client";

import { CompositeChart } from "@mantine/charts";
import currency from "currency.js";
import React from "react";

export function LiveRevChart({ data }: { data: any }) {
  return (
    <CompositeChart
      className="min-h-0 h-full"
      data={data}
      dataKey="date"
      tooltipAnimationDuration={200}
      withLegend
      valueFormatter={(value) => currency(value).format()}
      maxBarWidth={30}
      curveType="natural"
      series={[
        { name: "live", color: "rgb(18, 120, 255)", type: "bar", label: "Actual" },
        { name: "expected", color: "orange.8", type: "line", label: "Expected" },
      ]}
    />
  );
}
