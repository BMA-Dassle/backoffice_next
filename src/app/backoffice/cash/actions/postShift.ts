"use server";
import axios from "axios";

export async function postShift(
  shiftName: string,
  date: string,
  cash: number,
  cashCollected: number,
  refunds: number
) {
  console.log(
    JSON.stringify({
      name: shiftName,
      shift: 1,
      date: date,
      cash: cash,
      collectedCash: cashCollected,
      refunds: refunds,
    })
  );
  const url = new URL(
    `/v2/shifts`,
    process.env.NODE_ENV === "production"
      ? "https://bma-pandora-api.azurewebsites.net"
      : "https://parrot-secure-grizzly.ngrok-free.app"
  );

  axios.post(
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
