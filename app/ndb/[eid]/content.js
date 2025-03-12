"use client";

import HideBar from "components/layout/hidebar";
import NextBreadcrumbs from "components/function/bcv15";
import { Typography, Box } from "@mui/material";
import Windowed from "components/function/prescription_windowed";

const rep1 = {
  ndb: "処方薬ランキング",
  prescription: "処方薬",
};

const Content = () => {
  return (
    <HideBar>
      <NextBreadcrumbs rep1={rep1} />
      <Windowed />
    </HideBar>
  );
};

export default Content;
