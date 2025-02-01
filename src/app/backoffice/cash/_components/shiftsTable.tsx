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
import { useQuery } from "@tanstack/react-query";
import { ShiftApiResponse, ShiftData } from "@/_types/shifts";
import { Tooltip, ActionIcon, Text } from "@mantine/core";
import { IconRefresh } from "@tabler/icons-react";

interface CashTableProps {
  centerID: string;
}

const useGetShifts = (centerID: string, date: string) => {
  return useQuery({
    queryKey: ["shifts"],
    queryFn: () => getShiftReport(centerID, dayjs(date).format("YYYY-MM-DD")),
    staleTime: 1 * (60 * 1000),
    initialData: {
      success: false,
      data: {
        conqueror: [],
        square: [],
      },
    },
    select: (data: ShiftApiResponse) => data.data.conqueror.concat(data.data.square),
  });
};

export const CashTable = ({ centerID }: CashTableProps) => {
  const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<MRT_SortingState>([]);
  const [totalCollected, setCollected] = useState(0);
  const date = useAppSelector((state) => state.report.date);

  const { data, isError, isFetching, isLoading, refetch } = useGetShifts(centerID, date);

  useEffect(() => {
    refetch();
  }, [date]);

  useEffect(() => {
    refetch();
    setCollected(
      data.reduce((acc, curr) => {
        if (curr.shiftData) {
          return acc + Number(curr.shiftData.collectedCash);
        } else {
          return acc;
        }
      }, 0)
    );
  }, [data]);

  const totalRefunds = useMemo(
    () => data!.reduce((acc, curr) => acc + curr.refundTotal.amount, 0) / 100,
    [data]
  );

  const totalNeeded = useMemo(
    () => data!.reduce((acc, curr) => acc + curr.cashTotal.amount, 0) / 100,
    [data]
  );

  const columns = useMemo<MRT_ColumnDef<ShiftData>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Shift Name",
        enableColumnFilter: false,
      },
      {
        accessorFn: (row) => {
          if (row.cashTotal && row.cashTotal.amount) {
            return `$${row.cashTotal.amount / 100}`;
          }

          return `$0`;
        },
        header: "Cash Total",
        enableColumnFilter: false,
        Footer: () => (
          <Text size="lg" fw={700}>
            ${totalNeeded}
          </Text>
        ),
      },
      {
        accessorFn: (row) => {
          if (row.refundTotal && row.refundTotal.amount) {
            return `$${row.refundTotal.amount / 100}`;
          }

          return `$0`;
        },
        header: "Refund Total",
        enableColumnFilter: false,
        Footer: () => (
          <Text size="lg" fw={700}>
            ${totalRefunds}
          </Text>
        ),
      },
      {
        accessorFn: (row) => {
          if (row.shiftData && row.shiftData.collectedCash) {
            return `$${row.shiftData.collectedCash}`;
          }

          return `$0`;
        },
        header: "Cash Collected",
        enableColumnFilter: false,
        Footer: () => (
          <Text size="lg" fw={700}>
            ${totalCollected}
          </Text>
        ),
      },
      {
        accessorKey: "center",
        header: "Center",
        enableColumnFilter: false,
      },
    ],
    [centerID, totalCollected, totalNeeded, totalRefunds]
  );

  const fetchedShifts = data ?? [];
  const totalRowCount = date.length ?? 0;

  const table = useMantineReactTable({
    columns,
    data: fetchedShifts,
    getRowId: (row) => row.name,
    rowCount: totalRowCount,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    enableHiding: false,
    enableRowActions: true,
    initialState: {
      columnVisibility: {
        center: false,
      },
    },
    renderRowActions: ({ row }) => (
      <CloseShiftModal shift={row.original} refetchFn={() => refetch()} />
    ),
    renderTopToolbarCustomActions: () => (
      <Tooltip label="Refresh Data">
        <ActionIcon onClick={() => refetch()}>
          <IconRefresh />
        </ActionIcon>
      </Tooltip>
    ),
    state: {
      columnFilters,
      globalFilter,
      isLoading,
      showAlertBanner: isError,
      showProgressBars: isFetching,
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
