"use client";
import HideBar from "components/layout/hidebar";
import NextBreadcrumbs from "components/function/bcv15";
import { Typography } from "@mui/material";
import Search_country from "components/function/search_country";

const Content = ({ iso2, res2, res3, title, description, con_name }) => {
  console.log(iso2);
  const rep1 = { pyramid: "人口ピラミッド", [iso2]: con_name };
  return (
    <HideBar>
      <NextBreadcrumbs rep1={rep1} />
      <Typography variant="h1">{title}</Typography>
      <Search_country res3={res3} />
    </HideBar>
  );
};
export default Content;
