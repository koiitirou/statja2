"use client";

import HideBar from "components/layout/hidebar";
import NextBreadcrumbs from "components/function/bcv15";
import Pr2_windowed from "components/function/pr2_windowed";
import { Typography, Button } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { Fragment } from "react";
import Link from "next/link";

const Content = ({
  prefec,
  res2,
  ref3,
  th_prefec,
  th_res,
  title,
  description,
}) => {
  const rep1 = {
    prefecture: "都道府県ランキング",
    info: "都道府県一覧",
    [th_res.lnk]: th_res.nam,
    [th_prefec.tsq]: th_prefec.tln,
  };
  return (
    <HideBar>
      <NextBreadcrumbs rep1={rep1} />
      <Pr2_windowed />
      <Typography variant="h1">{title}</Typography>
      {Object.keys(ref3).map((v, i) => {
        return (
          <Fragment key={"a" + i}>
            <Button
              color="secondary"
              variant={
                prefec[1] == ref3[v].params.lnk ? "contained" : "outlined"
              }
              fontSize={{ xs: "13px", sm: "16px" }}
              // prefetch={false}
              href={"/prefecture/info/" + prefec[0] + "/" + ref3[v].params.lnk}
            >
              {ref3[v].params.nam.split("・")[0]}
            </Button>
          </Fragment>
        );
      })}
      <Typography variant="body1">{description}</Typography>
      {Object.keys(th_res.c2s).map((v0, i0) => {
        // var th_url = th_res.c2s[v0].url;
        var th_url = Array.isArray(th_res.c2s[v0].url)
          ? th_res.c2s[v0].url
          : [th_res.c2s[v0].url];
        var th_items = [];
        th_url.forEach((vv, ii) => {
          var th_item0 = res2.find((zz) => zz.u == vv);
          if (th_item0 != undefined) {
            th_items.push(th_item0);
          }
        });

        return (
          <Fragment key={"b" + i0}>
            <Typography variant="h2">
              {th_prefec.tln}の{th_res.c2s[v0].nm2}ランキング
            </Typography>
            <Grid container spacing={0.5}>
              <Grid size={4.5}>
                <Typography
                  variant="body1"
                  fontSize={{ xs: "13px", sm: "16px" }}
                >
                  統計分類
                </Typography>
              </Grid>
              <Grid size={4.5}>
                <Typography
                  variant="body1"
                  fontSize={{ xs: "13px", sm: "16px" }}
                >
                  値
                </Typography>
              </Grid>
              <Grid size={1.5}>
                <Typography
                  variant="body1"
                  fontSize={{ xs: "13px", sm: "16px" }}
                >
                  順位
                </Typography>
              </Grid>
              <Grid size={1.5}>
                <Typography
                  variant="body1"
                  fontSize={{ xs: "13px", sm: "16px" }}
                >
                  年度
                </Typography>
              </Grid>
              {th_items.map((v1, i1) => {
                var v1 = v1;

                return (
                  <Fragment key={"c" + i1}>
                    <Grid size={4.5} borderTop={1} borderColor="#ddd">
                      <Typography
                        variant="body1"
                        fontSize={{ xs: "12px", sm: "14px" }}
                      >
                        {v1.n}
                      </Typography>
                    </Grid>
                    <Grid size={4.5} borderTop={1} borderColor="#ddd">
                      <Typography
                        variant="body1"
                        fontSize={{ xs: "12px", sm: "14px" }}
                      >
                        {Number(v1.v).toLocaleString()} {v1.t}
                      </Typography>
                    </Grid>
                    <Grid size={1.5} borderTop={1} borderColor="#ddd">
                      <Typography
                        variant="body1"
                        fontSize={{ xs: "12px", sm: "14px" }}
                      >
                        <Link
                          prefetch={false}
                          href={
                            prefec[1] == "vegetable"
                              ? `${"/prefecture/vegetable/"}${v1.u}`
                              : prefec[1] == "fruit"
                              ? `${"/prefecture/vegetable/"}${v1.u}`
                              : `${"/prefecture/category/"}${v1.u}`
                          }
                        >
                          {v1.r}
                        </Link>
                      </Typography>
                    </Grid>
                    <Grid size={1.5} borderTop={1} borderColor="#ddd">
                      <Typography
                        variant="body1"
                        fontSize={{ xs: "12px", sm: "14px" }}
                      >
                        {v1.i}
                      </Typography>
                    </Grid>
                  </Fragment>
                );
              })}
            </Grid>
          </Fragment>
        );
      })}
    </HideBar>
  );
};

export default Content;
