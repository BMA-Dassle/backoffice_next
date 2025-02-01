"use client";

import "@mantine/core/styles.css";
import "@mantine/dates/styles.css"; //if using mantine date picker features
import "mantine-react-table/styles.css"; //make sure MRT styles were imported in your app root (once)
import { useEffect, useMemo, useRef, useState } from "react";
import {
  MantineReactTable,
  useMantineReactTable,
  type MRT_ColumnDef,
  type MRT_ColumnFiltersState,
  type MRT_SortingState,
} from "mantine-react-table";
import { listLeagues } from "../../../_actions/listLeagues";
import { IconCheck, IconX } from "@tabler/icons-react";
import { Center, ThemeIcon, Text, Button, Box } from "@mantine/core";
import { LeagueData, LeaguesApiResponse } from "@/_types/leagues";
import { EditLeagueModal } from "./editLeagueModal";

export const LeagueTable = () => {
  const childRef: any = useRef(null);

  //data and fetching state
  const [data, setData] = useState<LeagueData[]>([]);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefetching, setIsRefetching] = useState(false);
  const [rowCount, setRowCount] = useState(0);
  const [leagueSelected, setLeagueSelected] = useState(undefined);

  //table state
  const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<MRT_SortingState>([]);

  //if you want to avoid useEffect, look at the React Query example instead
  useEffect(() => {
    const fetchData = async () => {
      if (!data.length) {
        setIsLoading(true);
      } else {
        setIsRefetching(true);
      }

      try {
        const leagueData = (await listLeagues()) as LeaguesApiResponse;
        setData(leagueData.data);
        setRowCount(leagueData.data.length);
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
  }, []);

  const columns = useMemo<MRT_ColumnDef<LeagueData>[]>(
    () => [
      {
        accessorKey: "name",
        Cell: ({ cell }) => (
          <Text size="md" fw={500}>
            {cell.getValue<string>()}
          </Text>
        ),
        header: "League Name",
      },
      {
        accessorKey: "contracted",
        Cell: ({ cell }) => (
          <Center>
            {cell.getValue<boolean>() ? (
              <ThemeIcon radius="xl" size="md" color="green.6">
                <IconCheck />
              </ThemeIcon>
            ) : (
              <ThemeIcon radius="xl" size="md" color="red.6">
                <IconX />
              </ThemeIcon>
            )}
          </Center>
        ),
        header: "Contracted",
      },
      {
        accessorKey: "centerID",
        header: "Center",
      },
    ],
    []
  );

  const table = useMantineReactTable({
    columns,
    data,
    getRowId: (row) => row.name,
    rowCount,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    enableRowSelection: true,
    enableMultiRowSelection: false,
    //clicking anywhere on the row will select it
    mantineTableBodyRowProps: ({ row }) => ({
      onClick: row.getToggleSelectedHandler(),
      style: { cursor: "pointer" },
    }),
    enableColumnFilters: false,
    mantineTableHeadCellProps: {
      align: "center",
    },
    mantineTableBodyCellProps: {
      align: "center",
    },
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
    renderTopToolbarCustomActions: () => (
      <Box>
        <Button color="teal" onClick={() => childRef.current.openModal()} variant="filled">
          Create League
        </Button>
      </Box>
    ),
  });

  return (
    <>
      <EditLeagueModal ref={childRef} league={leagueSelected} />
      <MantineReactTable table={table} />
    </>
  );
};
