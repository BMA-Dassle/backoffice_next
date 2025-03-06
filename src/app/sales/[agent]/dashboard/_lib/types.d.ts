import currency from "currency.js";
import { Location } from "square/legacy";

interface LiveLocation {
  bmiIP: string;
  location: Location;
}

interface BMIOrder {
  orderID: string;
  bmiID: string;
  orderLocation: string;
}

interface TypeTotal {
  STATE: string;
  TOTAL: number;
}

interface LiveDayTotal {
  DAY: number;
  TOTAL: currency;
}

interface DateTotal {
  DAY: number;
  TOTAL: number;
}
