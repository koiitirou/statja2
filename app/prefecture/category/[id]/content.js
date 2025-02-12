"use client";
import HideBar from "components/layout/hidebar";
import { Box, Typography } from "@mui/material";
import { useState, useEffect, React, Fragment } from "react";
import { server } from "components/data/config";
import Pr2_map from "components/function/pr2_map";

const Content = ({ ssg0, id, thisParams }) => {
  //   console.log(ssg0);
  ///marks
  const [ssg1, setSsg1] = useState(ssg0);
  const [isfetch, setIsfetch] = useState(false);
  useEffect(() => {
    setIsfetch(false);
  }, [id]);
  useEffect(() => {
    if (!isfetch) {
      const fetchData = async () => {
        try {
          const response1 = await fetch(`${server}/pr2json2/${id}_int.json`);
          const json1 = await response1.json();
          setSsg1(json1);
        } catch (error) {
          console.error("Error to fetch json");
        }
      };

      //   json(`${server}/pr2json2/${id}_int.json`).then((collection) => {
      //     setSsg1(collection);
      //   });
      //   setIsfetch(true);
      fetchData();
      setIsfetch(true);
    }
  }, [id, isfetch]);
  var marks = [];
  for (let i = 0; i < ssg1.def.tml.length; i++) {
    var thisYear = {};
    thisYear["value"] = Number(ssg1.def.tml[i]);
    marks.push(thisYear);
  }
  /////Description
  const unit1 = ssg1.def.ut1;
  const title1 = `${
    ssg1.def.tl1 +
    "の都道府県ランキング【" +
    ssg1.def.tmn +
    "〜" +
    ssg1.def.tmx +
    "】"
  }`;
  const dd1_rnk = ssg1.def.rnk.slice(-3);
  const dd1_pre = ssg1.def.pre.slice(-3);
  const dd1_val = ssg1.def.val.slice(-3);
  const dd1_lpr = ssg1.def.lpr.slice(-3);
  const dd1_prc = ssg1.def.prc.slice(-3);
  const Html1 = () => {
    return (
      <>
        {ssg1.def.rnk[0]}位は{ssg1.def.pre[0]}で
        {ssg1.def.val[0].toLocaleString()}
        {ssg1.def.unit2} (
        <span className={ssg1.def.prc[0]}>
          {ssg1.def.lpr[0] >= 0 ? "+" : ""}
          {ssg1.def.lpr[0]}%
        </span>
        )、
        {ssg1.def.rnk[1]}位は{ssg1.def.pre[1]}で
        {ssg1.def.val[1].toLocaleString()}
        {ssg1.def.unit2} (
        <span className={ssg1.def.prc[1]}>
          {ssg1.def.lpr[1] >= 0 ? "+" : ""}
          {ssg1.def.lpr[1]}%
        </span>
        )、{ssg1.def.rnk[2]}位は{ssg1.def.pre[2]}で
        {ssg1.def.val[2].toLocaleString()}
        {ssg1.def.unit2} (
        <span className={ssg1.def.prc[2]}>
          {ssg1.def.lpr[2] >= 0 ? "+" : ""}
          {ssg1.def.lpr[2]}%
        </span>
        )です。
      </>
    );
  };
  const Html2 = () => {
    return (
      <>
        {dd1_rnk[2]}位は{dd1_pre[2]}で{dd1_val[2].toLocaleString()}
        {ssg1.def.unit2} (
        <span className={dd1_prc[2]}>
          {dd1_lpr[2] >= 0 ? "+" : ""}
          {dd1_lpr[2]}%
        </span>
        )、 {dd1_rnk[1]}位は{dd1_pre[1]}で{dd1_val[1].toLocaleString()}
        {ssg1.def.unit2} (
        <span className={dd1_prc[1]}>
          {dd1_lpr[1] >= 0 ? "+" : ""}
          {dd1_lpr[1]}%
        </span>
        )、 {dd1_rnk[0]}位は{dd1_pre[0]}で{dd1_val[0].toLocaleString()}
        {ssg1.def.unit2} (
        <span className={dd1_prc[0]}>
          {dd1_lpr[0] >= 0 ? "+" : ""}
          {dd1_lpr[0]}%
        </span>
        )です。
      </>
    );
  };
  return (
    <HideBar>
      <Typography variant="h1" component="h1">
        {title1}
      </Typography>
      <Typography variant="body1">
        {"　"}
        日本の各都道府県の{ssg1.def.tl1}ランキング・順位({ssg1.def.tmn}〜
        {ssg1.def.tmx}
        年)を表形式にしてまとめました。
      </Typography>
      <Typography variant="body1">
        {"　"}
        上位から、
        <Html1 />{" "}
      </Typography>
      <Typography variant="body1">
        {"　"}最下位から、
        <Html2 />{" "}
      </Typography>
      <Pr2_map ssg1={ssg1} isfetch={isfetch} marks={marks} />
    </HideBar>
  );
};
export default Content;
