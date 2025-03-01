"use server";

import { LeaguesApiResponse } from "../../../_types/leagues";

export async function listLeagues(): Promise<LeaguesApiResponse> {
  const url = new URL(`/v2/leagues/`, "https://bma-pandora-api.azurewebsites.net");

  const response = await fetch(url.href, {
    headers: {
      "ngrok-skip-browser-warning": "69420",
    },
  });

  return await response.json();
}
