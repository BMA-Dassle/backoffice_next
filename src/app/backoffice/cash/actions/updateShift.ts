"use server";
import axios from "axios";

export async function updateShift(
  shiftID: any,
  shiftName: any,
  date: any,
  cash: number,
  cashCollected: number,
  refunds: number
) {
  console.log(
    JSON.stringify({
      id: shiftID,
      name: shiftName,
      shift: 1,
      date: date,
      cash: cash,
      collectedCash: cashCollected,
      refunds: refunds,
    })
  );
  const url = new URL(
    `/v2/shifts/${encodeURIComponent(shiftID)}`,
    process.env.NODE_ENV === "production"
      ? "https://bma-pandora-api.azurewebsites.net"
      : "https://bma-pandora-api.azurewebsites.net"
  );

  axios.put(
    url.toString(),
    {
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
