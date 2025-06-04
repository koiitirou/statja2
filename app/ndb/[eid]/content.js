"use client";

import HideBar from "components/layout/hidebar";
import NextBreadcrumbs from "components/function/bcv15";
import { Typography, Box } from "@mui/material";
import Windowed from "components/function/prescription_windowed";
import Retable from "components/function/shohou_retable";
import Retable_generic from "components/function/shohou_retable_generic";

const Content = ({ ssg1, ssg2, eid }) => {
  const rep1 = {
    ndb: "処方薬ランキング",
    prescription: "処方薬",
    [eid]: ssg1.def.enm,
  };
  const did1 = eid;
  const kbn1 = {
    nai: "内服",
    gai: "外用",
    tyu: "注射",
  };
  const graphList = [
    { value: "rnk", label: "順位", unit: "位", rev: true },
    { value: "sum", label: `処方数`, unit: `${ssg1.def.unt}`, rev: false },
    { value: "dpf", label: "前年比(処方数)", unit: "%", rev: false },
    { value: "dp2", label: "薬価", unit: "", rev: false },
    { value: "sls", label: "売上", unit: "円", rev: false },
  ];
  const graphLis2 = [
    { value: "rnk", label: "順位", unit: "位", rev: true },
    { value: "sum", label: `処方数`, unit: "", rev: false },
    { value: "dpf", label: "前年比(処方数)", unit: "%", rev: false },
    { value: "sls", label: "売上", unit: "円", rev: false },
    { value: "gum", label: "後発率", unit: "%", rev: false },
  ];
  console.log(ssg2);
  return (
    <HideBar>
      <NextBreadcrumbs rep1={rep1} />
      <Windowed />
      <Retable
        did1={did1}
        ssg1={ssg1}
        ssg2={ssg2}
        kbn1={kbn1}
        graphList={graphList}
      />
      <Retable_generic
        did1={did1}
        ssg1={ssg2}
        kbn1={kbn1}
        graphList={graphLis2}
      />
    </HideBar>
  );
};

export default Content;
