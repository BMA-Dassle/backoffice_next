import { getLocations } from "@/app/_actions/getLocations";
import { Location } from "square/legacy";
import { SquareClient } from "square";
import { runQuery } from "@/lib/firebird";
import dayjs from "dayjs";

const squareClientV40 = new SquareClient({
  token: process.env["SQUARE_TOKEN"]!,
});

export async function getTotalEvents(plannerName: string) {
  const locations: Location[] = (await getLocations()).data;
  const bmiIPs: string[] = await Promise.all(
    locations.map(async (location): Promise<string> => {
      return String(
        (
          await squareClientV40.locations.customAttributes.get({
            locationId: location.id!,
            key: "bmiAddress",
          })
        ).customAttribute?.value
      );
    })
  );

  let confirmedEventTotal = 0;
  let otherEventTotal = 0;

  for (const bmiIP of bmiIPs) {
    confirmedEventTotal =
      confirmedEventTotal +
      (
        await runQuery(
          bmiIP,
          `SELECT
        COUNT(*) AS TOTAL
        FROM T_PROJECT project
        INNER JOIN T_PROJECT_STATE state ON state.F_PRJS_ID = project.F_PRJS_ID
        WHERE
           EXTRACT(YEAR FROM F_PRJ_DATE) = ? AND
           EXTRACT(MONTH FROM F_PRJ_DATE) = ? AND
           state.CF_PRJS_NAME IN ('Confirmation', 'Confirmation + Waiver') AND
           F_US_ID = (SELECT F_US_ID FROM T_USER
                                     WHERE F_US_USERNAME LIKE ?)`,
          [dayjs().year(), dayjs().month() + 1, plannerName]
        )
      )[0]["TOTAL"];

    otherEventTotal =
      otherEventTotal +
      (
        await runQuery(
          bmiIP,
          `SELECT
        COUNT(*) AS TOTAL
        FROM T_PROJECT project
        INNER JOIN T_PROJECT_STATE state ON state.F_PRJS_ID = project.F_PRJS_ID
        WHERE
           EXTRACT(YEAR FROM F_PRJ_DATE) = ? AND
           EXTRACT(MONTH FROM F_PRJ_DATE) = ? AND
           state.CF_PRJS_NAME IN ('New Lead', 'Contacted', 'Deposit Requested', 'Quote', 'Confirmation', 'Confirmation + Waiver', 'Cancellation') AND
           F_US_ID = (SELECT F_US_ID FROM T_USER
                                     WHERE F_US_USERNAME LIKE ?)`,
          [dayjs().year(), dayjs().month() + 1, plannerName]
        )
      )[0]["TOTAL"];
  }

  return { confirmed: confirmedEventTotal, other: otherEventTotal };
}
