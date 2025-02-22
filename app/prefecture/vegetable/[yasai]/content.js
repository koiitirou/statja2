"use client";
import HideBar from "components/layout/hidebar";
// import { Box, Typography } from "@mui/material";
// import { useState, useEffect, React, Fragment } from "react";
// import { server } from "components/data/config";
// import Pr2_map from "components/function/pr2_map";
// import Pr2_line from "components/function/pr2_line";
// import Pr2_table from "components/function/pr2_table";
// import Link from "next/link";
import NextBreadcrumbs from "components/function/bcv15";
import Pr2_windowed from "components/function/pr2_windowed";

const Content = () => {
  const rep1 = {
    prefecture: "都道府県ランキング",
    vegetable: "野菜・果物",
  };
  return (
    <HideBar>
      <NextBreadcrumbs rep1={rep1} /> <Pr2_windowed /> aa
    </HideBar>
  );
};
export default Content;
