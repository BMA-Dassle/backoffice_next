"use client";

import "@mantine/core/styles.css";
import "@mantine/dates/styles.css"; //if using mantine date picker features
import "mantine-react-table/styles.css"; //make sure MRT styles were imported in your app root (once)
import { useEffect, useMemo, useState } from "react";
import {
  MantineReactTable,
  useMantineReactTable,
  type MRT_ColumnDef,
  type MRT_ColumnFiltersState,
  type MRT_SortingState,
} from "mantine-react-table";
import { getShiftReport } from "../_actions/getShiftReport";
import { useAppSelector } from "@/lib/redux/hooks";
import dayjs from "dayjs";
import { CloseShiftModal } from "./shiftModal";

type ShiftApiResponse = {
  success: boolean;
  data: {
    conqueror: Array<ShiftData>;
    square: Array<ShiftData>;
  };
};

type ShiftData = {
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

interface CashTableProps {
  centerID: string;
}

export const CashTable = ({ centerID }: CashTableProps) => {
  //data and fetching state
  const [data, setData] = useState<ShiftData[]>([]);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefetching, setIsRefetching] = useState(false);
  const [rowCount, setRowCount] = useState(0);

  //table state
  const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<MRT_SortingState>([]);

  const date = useAppSelector((state) => state.report.date);

  //if you want to avoid useEffect, look at the React Query example instead
  useEffect(() => {
    const fetchData = async () => {
      if (!data.length) {
        setIsLoading(true);
      } else {
        setIsRefetching(true);
      }

      try {
        const jsonData = (await getShiftReport(
          centerID,
          dayjs(date).format("YYYY-MM-DD")
        )) as ShiftApiResponse;
        const combinedData = jsonData.data.conqueror.concat(jsonData.data.square);
        setData(combinedData);
        setRowCount(combinedData.length);
      } catch (error) {
        setIsError(true);
        console.error(error);
        return;
      }
      setIsError(false);
      setIsLoading(false);
      setIsRefetching(false);
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date]);

  const columns = useMemo<MRT_ColumnDef<ShiftData>[]>(
    () => [
      {
        accessorKey: "name",
        header: "First Name",
        enableColumnFilter: false,
      },
      {
        accessorKey: "cashTotal.amount",
        Cell: ({ cell }) => <>${cell.getValue<number>() / 100}</>,
        header: "Cash Total",
        enableColumnFilter: false,
      },
      {
        accessorKey: "refundTotal.amount",
        Cell: ({ cell }) => <>${cell.getValue<number>() / 100}</>,
        header: "Refund Total",
        enableColumnFilter: false,
      },
      {
        accessorKey: "shiftData.collectedCash",
        Cell: ({ cell }) => <>${cell.getValue<number>()}</>,
        header: "Cash Collected",
        enableColumnFilter: false,
      },
      {
        accessorFn: (row) => {
          row.center = centerID;
          return row;
        },
        Cell: ({ cell }) => <CloseShiftModal shift={cell.getValue()} />,
        header: "Close Shift Modal",
      },
    ],
    [centerID]
  );

  const table = useMantineReactTable({
    columns,
    data,
    getRowId: (row) => row.name,
    rowCount,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    state: {
      columnFilters,
      globalFilter,
      isLoading,
      showAlertBanner: isError,
      showProgressBars: isRefetching,
      sorting,
      pagination: {
        pageIndex: 0,
        pageSize: 50,
      },
    },
    mantineToolbarAlertBannerProps: isError
      ? { color: "red", children: "Error loading data" }
      : undefined,
  });

  return <MantineReactTable table={table} />;
};
