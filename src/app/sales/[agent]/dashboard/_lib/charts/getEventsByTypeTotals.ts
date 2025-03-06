import { Location } from "square/legacy";
import { runQuery } from "@/lib/firebird";
import { getLocations } from "@/app/_actions/getLocations";
import dayjs from "dayjs";
import { SquareClient } from "square";
import currency from "currency.js";
import { LiveLocation, TypeTotal } from "../types";

const squareClientV40 = new SquareClient({
  token: process.env["SQUARE_TOKEN"]!,
});

export async function getEventsByTypeTotals(plannerName: string) {
  const locations: Location[] = (await getLocations()).data;
  const liveLocations: LiveLocation[] = await Promise.all(
    locations.map(async (location): Promise<any> => {
      return {
        bmiIP: String(
          (
            await squareClientV40.locations.customAttributes.get({
              locationId: location.id!,
              key: "bmiAddress",
            })
          ).customAttribute?.value
        ),
        location: location,
      };
    })
  );

  const typeTotals: { [state: string]: currency } = {
    "New Lead": currency(0),
    Contacted: currency(0),
    "Deposit Requested": currency(0),
    Quote: currency(0),
    Confirmed: currency(0),
  };

  for (const location of liveLocations) {
    const eventTotalTypes: TypeTotal[] = await runQuery(
      location.bmiIP,
      `SELECT
        state.CF_PRJS_NAME as STATE,
        SUM(COALESCE((SELECT SUM(product.CF_PRJPR_TOTAL) FROM T_PROJECT_PRODUCT product WHERE product.F_PRJ_ID = project.F_PRJ_ID), 0)) AS TOTAL
        FROM T_PROJECT project
        INNER JOIN T_PROJECT_STATE state ON state.F_PRJS_ID = project.F_PRJS_ID
        WHERE
           EXTRACT(YEAR FROM F_PRJ_DATE) = ? AND
           EXTRACT(MONTH FROM F_PRJ_DATE) = ? AND
           state.CF_PRJS_NAME IN ('New Lead', 'Contacted', 'Deposit Requested', 'Quote', 'Confirmation', 'Confirmation + Waiver') AND
           F_US_ID = (SELECT F_US_ID FROM T_USER
                                     WHERE F_US_USERNAME LIKE ?)
        GROUP BY state.CF_PRJS_NAME`,
      [dayjs().year(), dayjs().month() + 1, plannerName]
    );

    for (const type of eventTotalTypes) {
      if (type.STATE.includes("Confirmation")) {
        typeTotals["Confirmed"] = typeTotals["Confirmed"].add(currency(type.TOTAL));
      } else {
        typeTotals[type.STATE] = typeTotals[type.STATE].add(currency(type.TOTAL));
      }
    }
  }

  return Object.entries(typeTotals).map(([key, value]) => {
    return {
      state: key,
      [key]: value.value,
    };
  });
}
