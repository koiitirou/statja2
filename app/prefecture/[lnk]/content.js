"use client";
import HideBar from "components/layout/hidebar";
import { Typography } from "@mui/material";
// import { useState, useEffect, React, Fragment } from "react";
// import { server } from "components/data/config";
// import Pr2_map from "components/function/pr2_map";
// import Pr2_line from "components/function/pr2_line";
// import Pr2_table from "components/function/pr2_table";
// import Link from "next/link";
import NextBreadcrumbs from "components/function/bcv15";
import Pr2_windowed from "components/function/pr2_windowed";
import Pr2_link from "components/function/pr2_link";

const Content = ({ ref1, json1, ref2, array4, title, description, rep1 }) => {
  return (
    <HideBar>
      <NextBreadcrumbs rep1={rep1} />
      <Pr2_windowed />
      <Pr2_link
        ref1={ref1}
        json1={json1}
        array4={array4}
        ref2={ref2}
        title={title}
        description={description}
        rep1={rep1}
      />
      <Typography
        variant="body2"
        fontStyle="italic"
        color="dimgrey"
        align="right"
        display="block"
      >
        出典：「政府統計の総合窓口(e-Stat)」
      </Typography>
    </HideBar>
  );
};
export default Content;
