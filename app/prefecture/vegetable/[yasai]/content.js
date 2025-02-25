"use client";
import HideBar from "components/layout/hidebar";
import { Box, Typography } from "@mui/material";
import { useState, useEffect, Fragment } from "react";
import { server } from "components/data/config";
import Yasai_table from "components/function/yasai_table";
import Yasai_map from "components/function/yasai_map";
import Yasai_line from "components/function/yasai_line";
import NextBreadcrumbs from "components/function/bcv15";
import Pr2_windowed from "components/function/pr2_windowed";
import ref1 from "components/data/prefecture_list2.json";

const Content = ({ ssg0, title, description, yasai }) => {
  const unit1 = ssg0.def.ut0;
  const [ssg1, setSsg1] = useState(ssg0);
  const [isfetch, setIsfetch] = useState(false);

  useEffect(() => {
    if (!isfetch) {
      const fetchData = async () => {
        try {
          const response1 = await fetch(
            `${server}/yasaijson/${yasai}_int.json`
          );
          const json1 = await response1.json();
          setSsg1(json1);
        } catch (error) {
          console.error("Error to fetch json");
        }
      };

      fetchData();
      setIsfetch(true);
    }
  }, [yasai, isfetch]);
  const marks = ssg1.def.tml.map((value) => ({ value: Number(value) }));
  const rep1 = {
    prefecture: "都道府県ランキング",
    vegetable: "野菜・果物",
  };
  ///
  const graphList = [
    { value: "r", label: "順位", unit: "位", rev: true },
    { value: "v", label: "収穫量", unit: unit1, rev: false },
    { value: "d", label: "前年比", unit: "%", rev: false },
    { value: "f", label: "前年差", unit: unit1, rev: false },
    { value: "n", label: "順位差", unit: "位", rev: false },
    { value: "s", label: "作付面積", unit: "ha", rev: false },
    { value: "a", label: "10a収量", unit: "kg", rev: false },
    { value: "h", label: "出荷量", unit: "t", rev: false },
  ];

  ///
  return (
    <HideBar>
      <NextBreadcrumbs rep1={rep1} /> <Pr2_windowed />
      <Typography variant="h1" component="h1">
        {title}
      </Typography>
      <Typography variant="body1">
        {"　"}
        日本の各都道府県の{ssg1.def.tl1}収穫量ランキング・順位({ssg1.def.tmn}〜
        {ssg1.def.tmx}
        年)を表形式にしてまとめました。
      </Typography>
      <Typography variant="body1">
        {"　"}
        {ssg1.def.tl1}の収穫量は日本全国で
        <b>
          {ssg1.def.sum}
          {ssg1.def.ut0}
        </b>
        でした。
      </Typography>
      <Typography variant="body1">
        {"　"}
        {description}
      </Typography>
      <Yasai_map ssg1={ssg1} isfetch={isfetch} marks={marks} ref1={ref1} />
      <Yasai_line
        ssg1={ssg1}
        isfetch={isfetch}
        graphList={graphList}
        ref1={ref1}
      />
      <Yasai_table ssg1={ssg1} isfetch={isfetch} marks={marks} ref1={ref1} />
    </HideBar>
  );
};
export default Content;
