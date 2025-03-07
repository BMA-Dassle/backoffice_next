import { Center, Title } from "@mantine/core";
import { QtyTypeChart } from "./_components/charts/qtyTypeChart";
import { getEventsByTypeTotals } from "./_lib/charts/getEventsByTypeTotals";
import { cache, Suspense } from "react";
import { getCompositeBreakdownData } from "./_lib/charts/getCompositeBreakdown";
import { LiveRevChart } from "./_components/charts/liveRevChart";
import { CardGrid } from "./_components/cardGrid";

export const revalidate = 300;
export const dynamicParams = true;

const getEventTotalByType = cache(async (agent: string) => {
  return await getEventsByTypeTotals(agent);
});

const getCompositeBreakdown = cache(async (agent: string) => {
  return await getCompositeBreakdownData(agent);
});

async function DashboardPage({ params }: { params: Promise<{ agent: string }> }) {
  const agent = (await params).agent;
  const typeData = await getEventTotalByType(agent);
  const monthData = await getCompositeBreakdown(agent);

  return (
    <div className={`flex flex-col h-[calc((100dvh-60px-1rem)*2)] gap-[calc(2rem)]`}>
      <div className="flex flex-col min-h-0 h-1/2 gap-[calc(2rem)]">
        <CardGrid agent={agent} />
        <Center>
          <Title>Revenue by Status</Title>
        </Center>
        <Suspense>
          <QtyTypeChart data={typeData} />
        </Suspense>
      </div>
      <div className="flex flex-col min-h-0 h-1/2 gap-[calc(2rem)]">
        <Center>
          <Title>Live Revenue VS Expected</Title>
        </Center>
        <Suspense>
          <LiveRevChart data={monthData} />
        </Suspense>
      </div>
    </div>
  );
}

export default DashboardPage;
