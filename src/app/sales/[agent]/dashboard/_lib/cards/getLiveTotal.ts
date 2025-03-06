import { Location } from "square/legacy";
import { runQuery } from "@/lib/firebird";
import { getLocations } from "@/app/_actions/getLocations";
import { BMIOrder, LiveLocation } from "../types";
import dayjs from "dayjs";
import { SquareClient } from "square";
import currency from "currency.js";

const squareClientV40 = new SquareClient({
  token: process.env["SQUARE_TOKEN"]!,
});

async function getBMIOrders(location: string) {
  const url = new URL(`/v2/bmi/orders/${location}`, "https://bma-pandora-api.azurewebsites.net");

  const response = await fetch(url.href, {
    headers: {
      "ngrok-skip-browser-warning": "69420",
    },
  });

  return await response.json();
}

export async function getLiveTotal(plannerName: string) {
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

  let total = currency(0);

  for (const location of liveLocations) {
    const resIDs = (
      await runQuery(
        location.bmiIP,
        `SELECT
        project.F_PRJ_NUMBER as ID
        FROM T_PROJECT project
        INNER JOIN T_PROJECT_STATE state ON state.F_PRJS_ID = project.F_PRJS_ID
        WHERE
           EXTRACT(YEAR FROM F_PRJ_DATE) = ? AND
           EXTRACT(MONTH FROM F_PRJ_DATE) = ? AND
           F_US_ID = (SELECT F_US_ID FROM T_USER
                                     WHERE F_US_USERNAME LIKE ?)`,
        [dayjs().year(), dayjs().month() + 1, plannerName]
      )
    ).map((resID: any) => resID.ID);

    const bmiOrderIDs = (await getBMIOrders(location.location.id!)).data.filter(
      (bmiOrder: BMIOrder) => resIDs.includes(bmiOrder.bmiID)
    );

    if (bmiOrderIDs.length == 0) {
      return currency(0);
    }

    const orders = await squareClientV40.orders.batchGet({
      locationId: location.location.id!,
      orderIds: bmiOrderIDs.map((bmiOrder: BMIOrder) => bmiOrder.orderID),
    });

    total = total.add(
      orders.orders!.reduce((partialSum: currency, order: any) => {
        const totalOrder = currency(Number(order!.totalMoney!.amount!), { fromCents: true });
        const totalTax = currency(Number(order!.totalTaxMoney!.amount!), { fromCents: true });
        const totalTip = currency(Number(order!.totalTipMoney!.amount!), { fromCents: true });

        let totalDeposit = currency(0);
        let totalGratuity = currency(0);
        if (order.lineItems) {
          const orderLine = order!.lineItems.find((item: any) => item.name.includes("Gratuity"));

          if (orderLine) {
            totalGratuity = currency(Number(orderLine.basePriceMoney.amount), { fromCents: true });
          }
        }

        if (order.discounts) {
          const discountLine = order!.discounts.find((discount: any) =>
            discount.name.includes("Deposit")
          );

          if (discountLine) {
            totalDeposit = currency(Number(discountLine.appliedMoney!.amount!), {
              fromCents: true,
            });
          }
        }

        const orderTotal = totalOrder
          .subtract(totalTax)
          .subtract(totalTip)
          .add(totalDeposit)
          .subtract(totalGratuity);

        return partialSum.add(orderTotal);
      }, currency(0))
    );
  }

  return currency(total);
}
