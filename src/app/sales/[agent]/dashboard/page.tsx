import { Grid, GridCol, Group } from "@mantine/core";
import { QuotedRevenueCard } from "./_components/cards/quotedCard";
import { ConfirmedRevenueCard } from "./_components/cards/confirmedCard";
import { TotalRevenueCard } from "./_components/cards/totalsCard";
import { GoalCard } from "./_components/cards/goalCard";
import { LiveRevenueCard } from "./_components/cards/liveCard";
import { QtyTypeChart } from "./_components/charts/qtyTypeChart";
import { OtherEventsCard } from "./_components/cards/otherEventsCard";
import { ConfirmedEventsCard } from "./_components/cards/confirmedEventsCard";
import { getEventsByTypeTotals } from "./_lib/getEventsByTypeTotals";
import { cache } from "react";
import { LiveRevChart } from "./_components/charts/liveRevChart";

export const revalidate = 300;
export const dynamicParams = true;

const getEventTotalByType = cache(async (agent: string) => {
  return await getEventsByTypeTotals(agent);
});

async function DashboardPage({ params }: { params: Promise<{ agent: string }> }) {
  const agent = (await params).agent;
  const data = await getEventTotalByType(agent);

  return (
    <div className="flex flex-col h-full gap-6">
      <Grid className="" columns={10}>
        <GridCol span={2}>
          <ConfirmedRevenueCard agent={agent} />
        </GridCol>
        <GridCol span={2}>
          <QuotedRevenueCard agent={agent} />
        </GridCol>
        <GridCol span={2}>
          <LiveRevenueCard agent={agent} />
        </GridCol>
        <GridCol span={2}>
          <OtherEventsCard agent={agent} />
        </GridCol>
        <GridCol span={2}>
          <ConfirmedEventsCard agent={agent} />
        </GridCol>
        <GridCol span={5}>
          <TotalRevenueCard agent={agent} />
        </GridCol>
        <GridCol span={5}>
          <GoalCard agent={agent} />
        </GridCol>
      </Grid>
      <div className="h-full">
        <Group grow className="h-full">
          <QtyTypeChart data={data} />
        </Group>
      </div>
    </div>
  );
}

export default DashboardPage;
