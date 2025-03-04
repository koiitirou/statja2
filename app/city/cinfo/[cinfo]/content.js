"use client";
import HideBar from "components/layout/hidebar";
import { Typography, Box } from "@mui/material";
import NextBreadcrumbs from "components/function/bcv15";
import Cit_windowed from "components/function/cit_windowed";
import Retable from "components/function/city_retable_cinfo";

const Content = ({
  // ssg1,
  data,
  columns,
  options_topic,
  cinfo,
  title,
  description,
  category1,
  th_prefec,
}) => {
  var rep1 = {
    city: "市区町村ランキング",
    cinfo: "市区町村一覧",
    [cinfo]: th_prefec.jln,
  };
  return (
    <HideBar>
      <NextBreadcrumbs rep1={rep1} />
      <Typography variant="h1">{title}</Typography>
      <Typography variant="body1">{description}</Typography>
      <Cit_windowed />
      <Typography variant="h2" component="h2">
        {th_prefec.jln}の市区町村ランキング
      </Typography>
      <Retable
        data={data}
        column0={columns}
        category1={category1}
        th_prefec={th_prefec}
        options_topic={options_topic}
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
