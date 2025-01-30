"use server";
import axios from "axios";

export async function postShift(
  center: string,
  shiftName: string,
  date: string,
  cash: number,
  cashCollected: number,
  refunds: number
) {
  const url = new URL(
    `/v2/shifts`,
    process.env.NODE_ENV === "production"
      ? "https://bma-pandora-api.azurewebsites.net"
      : "https://bma-pandora-api.azurewebsites.net"
  );

  axios.post(
    url.toString(),
    {
      center: center,
      name: shiftName,
      shift: 1,
      date: date.split("T")[0],
      cash: cash,
      collectedCash: cashCollected,
      refunds: refunds,
    },
    {
      headers: {
        "ngrok-skip-browser-warning": "69420",
      },
    }
  );
}
