"use client";

import { Button, Grid, Group, Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { forwardRef, useImperativeHandle } from "react";
import { LeagueData } from "@/app/leagues/definitions";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { NativeSelect, NumberInput, Switch, TextInput } from "react-hook-form-mantine";
import { useQuery } from "@tanstack/react-query";
import { getLineageKeys } from "../_actions/listLineageKeys";
import { getPrizefundKeys } from "../_actions/listPrizefundKeys";
import { getLocations } from "@/app/_actions/getLocations";
import { Location } from "square/legacy";

const schema = z.object({
  name: z.string().min(1),
  squarePK: z.string(),
  prizePK: z.string(),
  location: z.string(),
  contracted: z.any(),
  bowlers: z.number().optional(),
});

type FormSchemaType = z.infer<typeof schema>;

interface EditLeagueModalProps {
  league: LeagueData | undefined;
}

export const EditLeagueModal = forwardRef((props: EditLeagueModalProps, ref) => {
  const [opened, { open, close }] = useDisclosure(false);

  const { data: lineageKeys } = useQuery({
    queryKey: ["lineageKeys"],
    queryFn: () => getLineageKeys(),
    staleTime: 1 * (60 * 1000),
    select: (data) =>
      data.map((key) => {
        return {
          label: `${key.itemData!.name!} - $${
            Number(key.itemData!.variations![0].itemVariationData!.priceMoney!.amount) / 100
          }`,
          value: key.itemData!.variations![0].id,
        };
      }),
  });

  const { data: prizeKeys } = useQuery({
    queryKey: ["prizeKeys"],
    queryFn: () => getPrizefundKeys(),
    staleTime: 1 * (60 * 1000),
    select: (data) =>
      data.map((key) => {
        return {
          label: key.itemData!.name!,
          value: key.itemData!.variations![0].id,
        };
      }),
  });

  const { data: locations } = useQuery({
    queryKey: ["locations"],
    queryFn: () => getLocations(),
    staleTime: 1 * (60 * 1000),
    select: (data) =>
      data.data.map((key: Location) => {
        return {
          label: key.name,
          value: key.id,
        };
      }),
  });

  const { control, handleSubmit, watch, reset } = useForm<FormSchemaType>({
    resolver: zodResolver(schema),
  });

  useImperativeHandle(ref, () => ({
    openModal: () => {
      reset();
      open();
    },
  }));

  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        title={`${props.league ? "Edit" : "Create"} League`}
        centered
        closeOnClickOutside={false}
      >
        <form
          onSubmit={handleSubmit(
            (values) => console.log(values),
            (error) => console.log(error)
          )}
          onError={(e) => console.log(e)}
        >
          <Grid columns={3} align="flex-end">
            <Grid.Col span={3}>
              <TextInput
                placeholder="New League Name"
                label="Name"
                withAsterisk
                control={control}
                name="name"
              />
            </Grid.Col>
            <Grid.Col span={3}>
              <NativeSelect
                label="Center"
                withAsterisk
                control={control}
                name="location"
                data={[{ label: "", value: "" }].concat(locations)}
              />
            </Grid.Col>
            {lineageKeys && (
              <Grid.Col span={3}>
                <NativeSelect
                  label="Lineage Price Key"
                  withAsterisk
                  control={control}
                  name="squarePK"
                  data={[{ label: "", value: "" }].concat(lineageKeys)}
                />
              </Grid.Col>
            )}
            {prizeKeys && (
              <Grid.Col span={3}>
                <NativeSelect
                  label="Prize Fund Price Key"
                  withAsterisk
                  control={control}
                  name="prizePK"
                  data={[{ label: "", value: "" }].concat(prizeKeys)}
                />
              </Grid.Col>
            )}
            <Grid.Col span={3}>
              <Group grow>
                <Switch control={control} name="contracted" label="Contracted" />
                <NumberInput
                  control={control}
                  name="bowlers"
                  label="Bowler Count"
                  disabled={!watch("contracted")}
                />
              </Group>
            </Grid.Col>
            <Grid.Col span={3}>
              <Button size="sm" radius="md" type="submit">
                Create League
              </Button>
            </Grid.Col>
          </Grid>
        </form>
      </Modal>
    </>
  );
});

EditLeagueModal.displayName = "Edit League Modal";
