"use client";

import HideBar from "components/layout/hidebar";
import NextBreadcrumbs from "components/function/bcv15";
import { Typography, Box } from "@mui/material";
import Cit_windowed from "components/function/cit_windowed";
import PopularClient from "components/function/popularClient.js";
import Grid from "@mui/material/Grid2";
import cit_path from "components/data/cit_path/cit_path.json";
import Link from "next/link";
const rep1 = {
  city: "市区町村ランキング",
};
import { Fragment } from "react";

const Content = ({ title, description }) => {
  return (
    <HideBar>
      <NextBreadcrumbs rep1={rep1} />
      <Typography variant="h1">{title}</Typography>
      <Typography variant="body1">{description}</Typography>
      <Cit_windowed />
      <Typography variant="h2">よく見られている項目</Typography>
      <PopularClient path="city" />
      <Typography variant="h2">よく見られている市区町村</Typography>
      <PopularClient path="cinfo" />
      <Typography variant="h2">市区町村ランキングのカテゴリー一覧</Typography>
      <Typography variant="body1">
        　各市区町村の人口・面積・教育・財政などの統計データへのリンク一覧です。カッコ内の数字はそのカテゴリーのランキング数です。
      </Typography>
      <Grid container rowSpacing={0.5} columnSpacing={4}>
        {Object.keys(cit_path.refs).map((v0, i0) => {
          var params0 = cit_path.refs[v0].params;
          return (
            <Fragment key={"s" + i0}>
              {v0 != "Z" && (
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="h3">
                    <Link href={"/city/" + params0.town} prefetch={false}>
                      {params0.nam}
                    </Link>
                    （ {params0.url.length}）
                  </Typography>
                </Grid>
              )}
            </Fragment>
          );
        })}
      </Grid>
    </HideBar>
  );
};

export default Content;
