"use server";

import dayjs from "dayjs";
import { Client, Environment } from "square/legacy";

const squareClient = new Client({
  accessToken: process.env["SQUARE_TOKEN"]!,
  environment: Environment.Production,
  httpClientOptions: {
    timeout: 15000,
    retryConfig: {
      maxNumberOfRetries: 3,
      maximumRetryWaitTime: 30000,
    },
  },
});

export async function getOpenChecks(centerID: string, date: string) {
  const orders = await squareClient.ordersApi.searchOrders({
    limit: 1000,
    returnEntries: true,
    locationIds: [centerID],
    query: {
      filter: {
        stateFilter: {
          states: ["OPEN"],
        },
        dateTimeFilter: {
          createdAt: {
            startAt: dayjs(date).set("hour", 5).format(),
            endAt: dayjs(date).set("hour", 5).add(1, "day").format(),
          },
        },
      },
    },
  });
  return orders.result.orderEntries;
}
