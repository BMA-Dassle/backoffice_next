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

async function get7ShiftsID(centerID: string) {
  return (
    await squareClient.locationCustomAttributesApi.retrieveLocationCustomAttribute(
      centerID,
      "7shifts"
    )
  ).result.customAttribute?.value;
}

export async function getFlaggedPosts(centerID: string, date: string) {
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      authorization: `Bearer ${process.env["7SHIFTS_TOKEN"]}`,
    },
  };

  console.log(process.env["7SHIFTS_TOKEN"], await get7ShiftsID(centerID));

  const response = await fetch(
    `https://api.7shifts.com/v2/company/265994/log_book_posts?location_id=${await get7ShiftsID(
      centerID
    )}&log_book_category_id=2851846&date=${date}&message=Flags`,
    options
  );

  const data = await response.json();

  console.log(data);

  return data.data.filter((post: any) => post.log_book_comment_count == 0);
}
