import { Location } from "square/legacy";
import { SquareClient } from "square";
import { runQuery } from "@/lib/firebird";
import { getLocations } from "@/app/_actions/getLocations";
import currency from "currency.js";
import dayjs from "dayjs";

const squareClientV40 = new SquareClient({
  token: process.env["SQUARE_TOKEN"]!,
});

export async function getEventTotals(plannerName: string) {
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

  let confirmedEventsTotal = 0;
  let quotedEventsTotal = 0;

  for (const bmiIP of bmiIPs) {
    quotedEventsTotal =
      quotedEventsTotal +
      (
        await runQuery(
          bmiIP,
          `SELECT
        SUM(COALESCE((SELECT SUM(prjProduct.CF_PRJPR_TOTAL)
                      FROM T_PROJECT_PRODUCT prjProduct
                      INNER JOIN T_PRODUCT product ON product.F_PR_ID = prjProduct.F_PR_ID
                      WHERE prjProduct.F_PRJ_ID = project.F_PRJ_ID AND
                            product.CF_PR_NAME NOT LIKE 'Gratuity'
                      ), 0)) AS TOTAL
        FROM T_PROJECT project
        INNER JOIN T_PROJECT_STATE state ON state.F_PRJS_ID = project.F_PRJS_ID
        WHERE
           EXTRACT(YEAR FROM F_PRJ_DATE) = ? AND
           EXTRACT(MONTH FROM F_PRJ_DATE) = ? AND
           state.CF_PRJS_NAME IN ('Quote', 'Deposit Requested') AND
           F_US_ID = (SELECT F_US_ID FROM T_USER
                                     WHERE F_US_USERNAME LIKE ?)`,
          [dayjs().year(), dayjs().month() + 1, plannerName]
        )
      )[0]["TOTAL"];

    confirmedEventsTotal =
      confirmedEventsTotal +
      (
        await runQuery(
          bmiIP,
          `SELECT
            SUM(COALESCE((SELECT SUM(prjProduct.CF_PRJPR_TOTAL)
                      FROM T_PROJECT_PRODUCT prjProduct
                      INNER JOIN T_PRODUCT product ON product.F_PR_ID = prjProduct.F_PR_ID
                      WHERE prjProduct.F_PRJ_ID = project.F_PRJ_ID AND
                            product.CF_PR_NAME NOT LIKE 'Gratuity'
                      ), 0)) AS TOTAL
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
  }

  return { confirmed: currency(confirmedEventsTotal), quoted: currency(quotedEventsTotal) };
}
