import { Location, Order } from "square/legacy";
import { runQuery } from "@/lib/firebird";
import { getLocations } from "@/app/_actions/getLocations";
import { BMIOrder, DateTotal, LiveDayTotal, LiveLocation } from "../types";
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
      "Authorization": `Bearer ${process.env["PANDORA_KEY"]}`,
    },
  });

  return await response.json();
}

function buildLiveData(orders: any[]) {
  const dayTotals: LiveDayTotal[] = [];

  orders.forEach((order) => {
    const orderDay = dayjs(order.closedAt).date();
    const dayObject = dayTotals.find((item) => item.DAY == orderDay);

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

    const orderActualTotal = totalOrder
      .subtract(totalTax)
      .subtract(totalTip)
      .add(totalDeposit)
      .subtract(totalGratuity);

    if (dayObject) {
      dayObject.TOTAL = dayObject.TOTAL.add(orderActualTotal);
    } else {
      dayTotals.push({
        DAY: orderDay,
        TOTAL: orderActualTotal,
      });
    }
  });

  return dayTotals;
}

async function getLiveTotals(plannerName: string, location: LiveLocation) {
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
               state.CF_PRJS_NAME IN ('Confirmation', 'Confirmation + Waiver') AND
               F_US_ID = (SELECT F_US_ID FROM T_USER
                                         WHERE F_US_USERNAME LIKE ?)`,
      [dayjs().year(), dayjs().month() + 1, plannerName]
    )
  ).map((resID: any) => resID.ID);

  const bmiOrderIDs = (await getBMIOrders(location.location.id!)).data.filter(
    (bmiOrder: BMIOrder) => resIDs.includes(bmiOrder.bmiID)
  );

  if (!bmiOrderIDs.length) {
    return [];
  }

  const orders = await squareClientV40.orders.batchGet({
    locationId: location.location.id!,
    orderIds: bmiOrderIDs.map((bmiOrder: BMIOrder) => bmiOrder.orderID),
  });

  if (!orders.orders) {
    return [];
  }

  const data = buildLiveData(orders.orders);

  return data;
}

async function getExpectedTotals(plannerName: string, location: LiveLocation) {
  const eventDateTotals: DateTotal[] = await runQuery(
    location.bmiIP,
    `SELECT
        EXTRACT(DAY FROM F_PRJ_DATE) AS "DAY",
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
                                     WHERE F_US_USERNAME LIKE ?)
        GROUP BY EXTRACT(DAY FROM F_PRJ_DATE)`,
    [dayjs().year(), dayjs().month() + 1, plannerName]
  );

  return eventDateTotals;
}

export async function getCompositeBreakdownData(plannerName: string) {
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

  const dateTotals = [];

  //Populate our date totals with all dates in month and 0's
  for (let day = 1; day <= dayjs().daysInMonth(); day++) {
    dateTotals.push({
      date: day,
      expected: currency(0),
      live: currency(0),
    });
  }

  for (const location of liveLocations) {
    const dayExpectedTotals = await getExpectedTotals(plannerName, location);
    const dayLiveTotals = await getLiveTotals(plannerName, location);

    for (const expectedTotal of dayExpectedTotals) {
      const outputObject = dateTotals.find((item) => item.date == expectedTotal.DAY);
      if (outputObject) {
        outputObject.expected = outputObject.expected.add(currency(expectedTotal.TOTAL));
      }
    }

    //Add our live totals by day.
    for (const liveTotal of dayLiveTotals) {
      const outputObject = dateTotals.find((item) => item.date == liveTotal.DAY);
      if (outputObject) {
        outputObject.live = outputObject.live.add(currency(liveTotal.TOTAL));
      }
    }
  }

  return Object.entries(dateTotals).map(([key, value]) => {
    return {
      date: `${dayjs().format("MMM")} ${value.date}`,
      ...(value.expected.value > 0 && { expected: value.expected.value }),
      ...(value.live.value > 0 && { live: value.live.value }),
    };
  });
}
