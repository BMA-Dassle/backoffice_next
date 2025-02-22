"use client";

import { Text, Anchor, Center, Container, Drawer, Flex, Stack, Title } from "@mantine/core";
import classes from "./css/drawer.module.css";
import { useAppSelector } from "@/lib/redux/hooks";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getFlaggedPosts } from "../_actions/getFlagged";
import dayjs from "dayjs";
import { useDisclosure } from "@mantine/hooks";
import { useEffect, useState } from "react";

export function FlaggedDrawer() {
  const date = useAppSelector((state) => state.report.date);
  const params = useParams<{ centerID: string }>();
  const [opened, { open, close }] = useDisclosure(false);
  const [logLink, setLogLink] = useState("");

  const useFlaggedPosts = (centerID: string, date: string) => {
    return useQuery({
      queryKey: ["flaggedTransactions", centerID, date],
      queryFn: () => getFlaggedPosts(centerID, dayjs(date).format("YYYY-MM-DD")),
      staleTime: 10 * (60 * 1000),
      initialData: {
        count: 0,
      },
      select: (data) => data,
    });
  };

  const { data, isError, isFetching, isLoading, refetch } = useFlaggedPosts(params.centerID, date);

  useEffect(() => {
    if (!isLoading && data.length > 0) {
      open();
      setLogLink(
        `https://app.7shifts.com/log_book?date=${data[0].date}&group_id=${data[0].location_id}`
      );
    } else {
      close();
    }
  }, [data]);

  return (
    <Drawer
      opened={opened}
      onClose={close}
      position="top"
      classNames={{ content: classes.inner }}
      size={"10%"}
      overlayProps={{ backgroundOpacity: 0.5, blur: 4 }}
      withCloseButton={false}
    >
      <Flex mih={50} gap="md" justify="center" align="center" direction="row" wrap="wrap">
        <Text size="xl" fw={700} c="white">
          You have {data.length} unresponded flagged transactions. Click{" "}
          <Anchor fw={700} c="blue.5" underline="always" href={logLink}>
            here
          </Anchor>{" "}
          to view them.
        </Text>
      </Flex>
    </Drawer>
  );
}
