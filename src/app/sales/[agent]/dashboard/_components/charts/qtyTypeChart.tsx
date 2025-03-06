"use client";

import { BarChart } from "@mantine/charts";
import currency from "currency.js";
import React from "react";

export function QtyTypeChart({ data }: { data: any }) {
  return (
    <BarChart
      className="min-h-0 h-full"
      data={data}
      dataKey="state"
      orientation="vertical"
      type="stacked"
      valueFormatter={(value) => currency(value).format()}
      yAxisProps={{ width: 80 }}
      barProps={{ radius: 5 }}
      series={[
        { name: "New Lead", color: "blue.7", label: "Total" },
        { name: "Contacted", color: "blue.4", label: "Total" },
        { name: "Quote", color: "yellow.4", label: "Total" },
        { name: "Deposit Requested", color: "orange.5", label: "Total" },
        { name: "Confirmed", color: "green.5", label: "Total" },
      ]}
    />
  );
}
