export type ShiftApiResponse = {
  success: boolean;
  data: {
    conqueror: ShiftData[];
    square: ShiftData[];
    bmi: ShiftData[];
  };
};

export type ShiftData = {
  name: string;
  cashTotal: {
    amount: number;
    currency: string;
    precision: number;
  };
  refundTotal: {
    amount: number;
    currency: string;
    precision: number;
  };
  shiftData: any;
  center: string;
};
