"use client";

import Grid from "@mui/material/Grid2";
import { Fragment } from "react";
import HideBar from "components/layout/hidebar";
import NextBreadcrumbs from "components/function/bcv15";
import { Typography } from "@mui/material";
import PopularClient from "components/function/popularClient.js";
import Windowed from "components/function/prescription_windowed";
import array3 from "components/data/path_ndb/sum_prescription_path.json";
import Link from "next/link";

var option2 = [];
const epath = array3.epath;
epath.map((s) => {
  var child1 = {};
  child1["value"] = s.params.eid;
  child1["label"] = s.params.enm;
  option2.push(child1);
});

const rep1 = {
  ndb: "処方薬ランキング",
};

const title_list = {
  yak: "薬効分類",
  kkn: "効能・作用機序",
  ksk: "疾患・病気",
};
const kbn_list = { nai: "内服", gai: "外用", tyu: "注射" };
const kbn_length = ["yak", "kkn", "ksk"].map((v, i) => {
  const epath_child1 = epath.filter((vv, ii) => vv.params.cl2 == v);
  return epath_child1.length;
});
const Content = ({ title, description }) => {
  return (
    <HideBar>
      <NextBreadcrumbs rep1={rep1} />
      <Typography variant="h1">{title}</Typography>
      <Typography variant="body1">{description}</Typography>
      <Typography variant="h2">よく見られている項目</Typography>
      <PopularClient path="ndb" />
      <Windowed />
      <Typography variant="body1">
        {kbn_length.map((v, i) => {
          return (
            <Fragment key={"f" + i}>
              <b>{v}</b>の
              <Link
                href={"#" + Object.entries(title_list)[i][0]}
                prefetch={false}
              >
                {Object.entries(title_list)[i][1]}リスト
              </Link>
              、
            </Fragment>
          );
        })}
        に分類された処方薬ランキングがあります。
      </Typography>
      {["yak", "kkn", "ksk"].map((v, i) => {
        const epath_child1 = epath.filter((vv, ii) => vv.params.cl2 == v);
        return (
          <Fragment key={"r" + i}>
            <Typography variant="h2" id={v}>
              {title_list[v]}リスト
            </Typography>
            {["nai", "gai", "tyu"].map((v0, i0) => {
              const epath_child2 = epath_child1.filter(
                (vvv, iii) => vvv.params.kbn == v0
              );
              return (
                <Fragment key={"s" + i0}>
                  <Typography variant="h3">{kbn_list[v0]}</Typography>
                  <Grid container rowSpacing={0.5} columnSpacing={4}>
                    {epath_child2.map((v1, i1) => {
                      return (
                        <Grid size={{ xs: 12, sm: 6 }} key={"t" + i1}>
                          <Typography variant="body1">
                            <Link
                              prefetch={false}
                              href={`/ndb/${v1.params.eid}`}
                            >
                              {v1.params.enm}
                            </Link>
                          </Typography>
                        </Grid>
                      );
                    })}
                  </Grid>
                </Fragment>
              );
            })}
          </Fragment>
        );
      })}
    </HideBar>
  );
};

export default Content;
