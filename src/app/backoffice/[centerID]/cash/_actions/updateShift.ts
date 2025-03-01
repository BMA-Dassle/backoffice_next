"use server";
import axios from "axios";

export async function updateShift(
  shiftID: any,
  center: string,
  shiftName: any,
  date: any,
  cash: number,
  cashCollected: number,
  refunds: number
) {
  const url = new URL(
    `/v2/shifts/${encodeURIComponent(shiftID)}`,
    "https://bma-pandora-api.azurewebsites.net"
  );

  axios.put(
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
