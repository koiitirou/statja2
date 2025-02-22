"use client";
import HideBar from "components/layout/hidebar";
import NextBreadcrumbs from "components/function/bcv15";
import Pr2_windowed from "components/function/pr2_windowed";
import React from "react";
import Link from "next/link";
import { Typography, Box } from "@mui/material";
import Grid from "@mui/material/Grid2";
import PopularClient from "components/function/popularClient.js";
import pr2_path from "components/pr2_path/pr2_path.json";
import yasai_path from "components/pr2_path/yasai_path.json";

const region1 = [];
const prefec1 = [];
Object.keys(pr2_path.pref).forEach((v0, i0) => {
  region1.push(pr2_path.pref[v0].region);
  prefec1.push(pr2_path.pref[v0]);
});
const region2 = Array.from(new Set(region1));
const info3 = [];
region2.forEach((v0, i0) => {
  var prefec2 = prefec1.filter((s) => s.region == v0);
  info3.push([v0, prefec2]);
});

const rep1 = {
  prefecture: "都道府県ランキング",
  category: "カテゴリー",
};

var array4 = [...pr2_path.path, ...yasai_path.path];
var mer_refs = pr2_path.refs;
Object.keys(yasai_path.refs).forEach((v, i) => {
  mer_refs[v] = yasai_path.refs[v];
});
var len1s = [];
var len2s = [];
array4.map((s) => {
  len1s.push(s.params.c1);
  len2s.push(s.params.c2);
});

var len1_set = Array.from(new Set(len1s));
var len2_set = Array.from(new Set(len2s));
var len0 = array4.length;
var len1 = len1_set.length;
var len2 = len2_set.length;

const Content = ({ title1, description1 }) => {
  return (
    <HideBar>
      <NextBreadcrumbs rep1={rep1} />
      <Typography variant="h1">{title1}</Typography>
      <Typography variant="body1">{description1}</Typography>
      <Pr2_windowed />
      <Typography variant="h2">よく見られている項目</Typography>
      <PopularClient path="prefecture" />
      <Typography variant="h2">都道府県一覧</Typography>
      <Typography variant="body1">
        各都道府県の人口・面積・教育・財政などの統計データをまとめたページへのリンク一覧です。
      </Typography>
      <Grid container rowSpacing={0.5} columnSpacing={4}>
        {info3.map((s, index) => {
          return (
            <React.Fragment key={"s-" + index}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="h3">{s[0]}</Typography>

                <Grid container spacing={0.5}>
                  {s[1].map((t, index) => {
                    return (
                      <React.Fragment key={"t-" + index}>
                        <Grid size={3}>
                          <Link
                            href={"/prefecture/info/" + t.td_sq + "/category"}
                            prefetch={false}
                          >
                            {t.td_lt}
                          </Link>
                        </Grid>
                      </React.Fragment>
                    );
                  })}
                </Grid>
              </Grid>
            </React.Fragment>
          );
        })}
      </Grid>
      <Typography variant="h2">都道府県ランキングのカテゴリー一覧</Typography>
      <Typography variant="body1">
        　各都道府県の人口・面積・教育・財政などの統計データへのリンク一覧です。カッコ内の数字はそのカテゴリーのランキング数です。
      </Typography>
      <Typography variant="body1">
        　<b>{len1}</b>
        の大カテゴリー、<b>{len2}</b>の小カテゴリーに分類された
        <b>{len0}</b>
        の都道府県データランキングがあります。
      </Typography>
      <Grid container rowSpacing={0.5} columnSpacing={4}>
        {Object.keys(mer_refs).map((v0, i0) => {
          var params0 = mer_refs[v0].params;
          return (
            <React.Fragment key={"s" + i0}>
              {v0 != "Z" && (
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="h3">
                    <Link href={"/prefecture/" + params0.lnk} prefetch={false}>
                      {params0.nam}
                    </Link>
                    （ {len1s.filter((x) => x == v0).length}）
                  </Typography>
                  {Object.keys(params0.c2s).map((v1, i1) => {
                    return (
                      <Typography variant="body1" key={"p" + i1}>
                        <Link
                          href={"/prefecture/" + params0.lnk + "#grid" + i1}
                          prefetch={false}
                        >
                          {params0.c2s[v1].nm2}
                        </Link>
                        （{params0.c2s[v1].url.length}）
                      </Typography>
                    );
                  })}
                </Grid>
              )}
            </React.Fragment>
          );
        })}
      </Grid>
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
