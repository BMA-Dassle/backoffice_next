"use server";

export async function getShiftReport(centerID: string, date: string) {
  const url = new URL(
    `/v2/shifts/${centerID}/${date}`,
    process.env.NODE_ENV === "production"
      ? "https://bma-pandora-api.azurewebsites.net"
      : "https://parrot-secure-grizzly.ngrok-free.app"
  );

  const response = await fetch(url.href, {
    headers: {
      "ngrok-skip-browser-warning": "69420",
    },
  });

  return await response.json();
}
