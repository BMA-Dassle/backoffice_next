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
