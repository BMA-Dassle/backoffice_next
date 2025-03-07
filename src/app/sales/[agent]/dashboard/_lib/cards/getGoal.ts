import currency from "currency.js";

export async function getGoalData(agent: string, year: number, month: number): Promise<any> {
  const url = new URL(`/v2/bmi/goals`, "https://bma-pandora-api.azurewebsites.net");

  url.searchParams.append("salesName", agent);
  url.searchParams.append("year", String(year));
  url.searchParams.append("month", String(month));

  const response = await fetch(url.href);

  const data = await response.json();

  if (!data.success || !data.data.length) {
    return currency(0);
  }

  return currency(data.data[0].goal);
}
