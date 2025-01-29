import { Button, Group, Modal, NumberInput, Stack } from "@mantine/core";
import classes from "./closeoutButton.module.css";
import { useDisclosure } from "@mantine/hooks";
import { Text } from "@mantine/core";
import { useState } from "react";
import { postShift } from "../actions/postShift";
import { useAppSelector } from "@/app/lib/redux/hooks";
import { updateShift } from "../actions/updateShift";
import { useRouter } from "next/navigation";

interface CloseShiftModalProps {
  shift: any;
}

export function CloseShiftModal({ shift }: CloseShiftModalProps) {
  const date = useAppSelector((state) => state.report.date);
  const [opened, { open, close }] = useDisclosure(false);
  const [value, setValue] = useState<string | number>(
    shift.shiftData ? shift.shiftData.collectedCash : ""
  );

  const router = useRouter();
  return (
    <>
      <Modal opened={opened} onClose={close} title={`Close Shift - ${shift.name}`} centered>
        <Stack align="center" justify="center" gap="md">
          <Group>
            <Text fw={700}>Expected Cash: </Text>
            <Text fw={500}>${shift.cashTotal.amount / 100}</Text>
          </Group>
          <Group>
            <Text fw={700}>Total Refunds: </Text>
            <Text fw={500}>${shift.refundTotal.amount / 100}</Text>
          </Group>
          <Group>
            <Text fw={700}>Cash Expected: </Text>
            <Text fw={500}>${(shift.refundTotal.amount + shift.cashTotal.amount) / 100}</Text>
          </Group>
          <Group>
            <Text fw={700}>Cash Collected: </Text>
            <NumberInput value={value} onChange={setValue} />
          </Group>
          <Group>
            <Text fw={700}>Over/Short: </Text>
            <Text
              fw={500}
              c={
                Number(value) - (shift.refundTotal.amount + shift.cashTotal.amount) / 100 >= 0
                  ? "green"
                  : "red"
              }
            >
              $
              {Math.round(
                Number(value) * 100 - (shift.refundTotal.amount + shift.cashTotal.amount)
              ) / 100}
            </Text>
          </Group>
          <Button
            variant="filled"
            onClick={async () => {
              try {
                if (shift.shiftData) {
                  await updateShift(
                    shift.shiftData.shiftID,
                    shift.name,
                    date,
                    shift.cashTotal.amount / 100,
                    Number(value),
                    shift.refundTotal.amount / 100
                  );
                } else {
                  await postShift(
                    shift.name,
                    date,
                    shift.cashTotal.amount / 100,
                    Number(value),
                    shift.refundTotal.amount / 100
                  );
                }
              } catch (e) {
                console.log(e);
              }

              close();
              window.location.reload();
            }}
          >
            Save
          </Button>
        </Stack>
      </Modal>

      <Button
        variant="outline"
        color={shift.shiftData ? "green" : "red"}
        className={classes.root}
        onClick={open}
      >
        {shift.shiftData ? "Modify" : "Close"} Shift
      </Button>
    </>
  );
}
