"use server";

export async function getLeague(): Promise<any> {
  const url = new URL(`/v2/leagues/`, "https://bma-pandora-api.azurewebsites.net");

  const response = await fetch(url.href, {
    headers: {
      "ngrok-skip-browser-warning": "69420",
    },
  });

  return await response.json();
}
