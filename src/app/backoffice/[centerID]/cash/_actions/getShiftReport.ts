"use server";

export async function getShiftReport(centerID: string, date: string) {
  const url = new URL(
    `/v2/shifts/${centerID}/${date}`,
    "https://bma-pandora-api.azurewebsites.net"
  );

  const response = await fetch(url.href, {
    headers: {
      "ngrok-skip-browser-warning": "69420",
    },
  });

  return await response.json();
}
