"use server";
import { CatalogObject, Client, Environment } from "square/legacy";

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

export async function getLineageKeys(): Promise<CatalogObject[]> {
  const priceKeys = await squareClient.catalogApi.searchCatalogItems({
    categoryIds: ["MDC7IY4DUIHYCVMTB5BE5GPL"],
    limit: 100,
  });

  return priceKeys.result.items ?? [];
}
