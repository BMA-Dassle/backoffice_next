import { Anchor, Button, Group, Image, Text, TextInput, Title } from "@mantine/core";
import classes from "./css/expenseBanner.module.css";
import NextImage from "next/image";

export function ExpenseBanner() {
  return (
    <div className={classes.wrapper}>
      <Group justify="center" grow>
        <div className={classes.body}>
          <Title className={classes.title}>Need to upload an expense?</Title>
          <Text fw={500} fz="lg" mb={5}>
            Scan QR or use app on QPad.
          </Text>
          <Text fz="sm" c="dimmed">
            You can also click{" "}
            <Anchor fz="sm" c="blue.5" underline="always" href={""}>
              here
            </Anchor>
            {"."}
          </Text>
        </div>
        <Image src={"/expense-qr-code.png"} className={classes.image} alt={"QRCode"} radius="md" />
      </Group>
    </div>
  );
}
