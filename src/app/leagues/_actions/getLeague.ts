"use server";

export async function getLeague(): Promise<any> {
  const url = new URL(
    `/v2/leagues/`,
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
