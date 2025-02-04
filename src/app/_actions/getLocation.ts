"use server";

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

export async function getLocation(centerID: string) {
  const location = await squareClient.locationsApi.retrieveLocation(centerID);

  return location.result.location;
}
