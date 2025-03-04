"use client";
import HideBar from "components/layout/hidebar";
import NextBreadcrumbs from "components/function/bcv15";
import { Typography } from "@mui/material";
import Search_country from "components/function/search_country";
import Pyramid2 from "components/function/Pyramid2";

const Content = ({ iso2, res2, res3, title, description, con_name }) => {
  const rep1 = { pyramid: "人口ピラミッド", [iso2]: con_name };
  return (
    <HideBar>
      <NextBreadcrumbs rep1={rep1} />
      <Typography variant="h1">{title}</Typography>
      <Search_country res3={res3} />
      <Pyramid2 res2={res2} res3={res3} con_name={con_name} iso2={iso2} />
    </HideBar>
  );
};
export default Content;
