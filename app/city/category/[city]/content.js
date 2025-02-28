"use client";

import HideBar from "components/layout/hidebar";
import NextBreadcrumbs from "components/function/bcv15";
import { Typography, Box } from "@mui/material";
import Cit_windowed from "components/function/cit_windowed";
import PopularClient from "components/function/popularClient.js";
import Retable from "components/function/city_retable";

const Content = ({ title, description, ssg1, city }) => {
  const rep1 = {
    city: "市区町村ランキング",
    category: "カテゴリー",
    [city]: ssg1.def.tl1,
  };
  const did1 = city;
  const unit1 = ssg1.def.ut1;

  /////////////////
  const tml = Array.isArray(ssg1.def.tml) ? ssg1.def.tml : [ssg1.def.tml];
  const marks = [];
  for (let i = 0; i < tml.length; i++) {
    var thisYear = {};
    thisYear["value"] = Number(tml[i]);
    marks.push(thisYear);
  }

  //////////////
  const column0 = ssg1.tab[ssg1.def.tmx].columns;
  ////
  //////////////
  const graphList = [
    { value: "r", label: "順位", unit: "位", rev: true },
    {
      value: "v",
      label: `${ssg1.def.tl1}`,
      unit: `${ssg1.def.ut1}`,
      rev: false,
    },
    { value: "d", label: "前年比", unit: "%", rev: false },
  ];
  const time_list2 = Array.isArray(ssg1.def.tml)
    ? ssg1.def.tml
    : [ssg1.def.tml];

  return (
    <HideBar>
      <NextBreadcrumbs rep1={rep1} />
      <Typography variant="h1">{title}</Typography>
      <Cit_windowed />
      <Typography variant="body1">
        {"　"}
        {ssg1.def.tmn}〜{ssg1.def.tmx}年の
        {ssg1.def.tl1}
        について、市区町村ランキングを表形式にして、順位をまとめました。
      </Typography>
      <Typography variant="body1">
        {"　"}
        {description}
      </Typography>
      <Typography variant="h2">よく見られている項目</Typography>
      <PopularClient path="city" />
      <Typography variant="h2">よく見られている市区町村</Typography>
      <PopularClient path="cinfo" />
      <Retable
        did1={did1}
        ssg1={ssg1}
        marks={marks}
        column0={column0}
        graphList={graphList}
        time_list2={time_list2}
      />
    </HideBar>
  );
};

export default Content;
