"use client";

import { ForwardRefExoticComponent, RefAttributes } from "react";
import { Group } from "@mantine/core";
import classes from "@/_components/ui/navbar.module.css";
import { Image } from "@mantine/core";
import dayjs from "dayjs";
import { IconProps, Icon } from "@tabler/icons-react";
import { usePathname, useRouter } from "next/navigation";
import NextImage from "next/image";
import { DatePickerInput } from "@mantine/dates";
import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks";
import { setDate } from "@/lib/redux/reducers/report";

interface NavbarProps {
  linksData: Link[];
  noDatePicker?: boolean;
}

export type Link = {
  link: string;
  label: string;
  icon: ForwardRefExoticComponent<IconProps & RefAttributes<Icon>>;
};

export function Navbar({ linksData, noDatePicker = false }: NavbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const date = useAppSelector((state) => state.report.date);
  const dispatch = useAppDispatch();

  const links = linksData.map((item) => (
    <a
      className={classes.link}
      data-active={item.link === pathname || undefined}
      key={item.label}
      onClick={(event) => {
        event.preventDefault();
        router.push(item.link);
      }}
    >
      <item.icon className={classes.linkIcon} stroke={1.5} />
      <span>{item.label}</span>
    </a>
  ));

  return (
    <nav className={classes.navbarMain}>
      <Group className={classes.header} justify="space-between">
        <Image
          component={NextImage}
          src={"/BOWL_HP_logo_Text.png"}
          alt="HP Logo"
          width={1080}
          height={1080}
          fit="contain"
        />
      </Group>
      {!noDatePicker && (
        <Group className={classes.header} justify="center">
          {!noDatePicker && (
            <DatePickerInput
              label="Pick date"
              placeholder="Pick date"
              value={dayjs(date).toDate()}
              onChange={(val) => dispatch(setDate(dayjs(val).format("YYYY-MM-DD")))}
              maxDate={dayjs(new Date()).toDate()}
            />
          )}
        </Group>
      )}
      {links}
    </nav>
  );
}
