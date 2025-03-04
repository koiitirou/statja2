import { Typography, Button } from "@mui/material";
import Grid from "@mui/material/Grid2";
import Link from "next/link";
import AnalyticsRoundedIcon from "@mui/icons-material/AnalyticsRounded";
import React from "react";
import { memo } from "react";

const Link2 = ({ ref1, ref2, json1, array4 }) => {
  return (
    <>
      {array4.map((v, i) => {
        return (
          <React.Fragment key={"a" + i}>
            <Button
              color="secondary"
              variant={ref1.town == v.params.town ? "contained" : "outlined"}
              fontSize={{ xs: "13px", sm: "16px" }}
              // prefetch={false}
              href={"/city/" + v.params.town}
            >
              {v.params.nam}
            </Button>
          </React.Fragment>
        );
      })}
      <Typography variant="h1" component="h1">
        <AnalyticsRoundedIcon
          sx={{ verticalAlign: "middle", fill: "#007FFF" }}
          fontSize="large"
        />
        {ref1.nam}統計の市区町村ランキング
      </Typography>
      <Typography variant="body1">
        　{ref1.nam}
        統計に関する<b>{ref1.url.length}</b>の市区町村
        ランキング・データを1ページにまとめました。各リンク先では順位ランキング、経年推移、前年比が一目で分かる表とグラフでまとめています。
      </Typography>
      <Typography variant="h2" component="h2">
        {ref1.nam}統計の市区町村ランキング
      </Typography>
      <Grid container spacing={0.5}>
        <Grid size={{ xs: 6, sm: 5 }}>
          <Typography variant="body1" fontSize={{ xs: "13px", sm: "16px" }}>
            ランキング分類
          </Typography>
        </Grid>

        <Grid size={{ xs: 1.8, sm: 1.4 }}>
          <Typography variant="body1" fontSize={{ xs: "13px", sm: "16px" }}>
            1位
          </Typography>
        </Grid>
        <Grid size={{ xs: 1.8, sm: 1.4 }}>
          <Typography variant="body1" fontSize={{ xs: "13px", sm: "16px" }}>
            2位
          </Typography>
        </Grid>
        <Grid size={{ xs: 1.8, sm: 1.4 }}>
          <Typography variant="body1" fontSize={{ xs: "13px", sm: "16px" }}>
            3位
          </Typography>
        </Grid>
        <Grid size={{ xs: 1.8, sm: 1.4 }} display={{ xs: "none", sm: "block" }}>
          <Typography variant="body1" fontSize={{ xs: "13px", sm: "16px" }}>
            最下位
          </Typography>
        </Grid>
        <Grid size={{ xs: 1.3, sm: 0.9 }} display={{ xs: "none", sm: "block" }}>
          <Typography variant="body1" fontSize={{ xs: "13px", sm: "16px" }}>
            年度
          </Typography>
        </Grid>

        {ref1.url.map((v3, i3) => {
          var cur1 = json1.cur.find((s) => s.u == v3);
          return (
            <React.Fragment key={"e" + i3}>
              <Grid size={{ xs: 6, sm: 5 }} borderTop={1} borderColor="#ddd">
                <Typography
                  variant="body1"
                  fontSize={{ xs: "13px", sm: "16px" }}
                >
                  <AnalyticsRoundedIcon sx={{ verticalAlign: "bottom" }} />
                  <Link
                    href={"/city/category/" + v3}
                    prefetch={false}
                    style={{ textDecoration: "none" }}
                  >
                    {cur1.d}
                  </Link>
                </Typography>
              </Grid>
              <Grid
                size={{ xs: 1.8, sm: 1.4 }}
                borderTop={1}
                borderColor="#ddd"
              >
                {cur1 && (
                  <Typography
                    variant="body1"
                    fontSize={{ xs: "12px", sm: "14px" }}
                  >
                    <Link
                      prefetch={false}
                      href={"/city/cinfo/" + cur1.i[0]}
                      style={{ textDecoration: "none" }}
                    >
                      {ref2[cur1.i[0]].jln}
                    </Link>
                  </Typography>
                )}
              </Grid>

              <Grid
                size={{ xs: 1.8, sm: 1.4 }}
                borderTop={1}
                borderColor="#ddd"
              >
                {cur1 && (
                  <Typography
                    variant="body1"
                    fontSize={{ xs: "12px", sm: "14px" }}
                  >
                    <Link
                      prefetch={false}
                      href={"/city/cinfo/" + cur1.i[1]}
                      style={{ textDecoration: "none" }}
                    >
                      {ref2[cur1.i[1]].jln}
                    </Link>
                  </Typography>
                )}
              </Grid>

              <Grid
                size={{ xs: 1.8, sm: 1.4 }}
                borderTop={1}
                borderColor="#ddd"
              >
                {cur1 && (
                  <Typography
                    variant="body1"
                    fontSize={{ xs: "12px", sm: "14px" }}
                  >
                    <Link
                      prefetch={false}
                      href={"/city/cinfo/" + cur1.i[2]}
                      style={{ textDecoration: "none" }}
                    >
                      {ref2[cur1.i[2]].jln}
                    </Link>
                  </Typography>
                )}
              </Grid>

              <Grid
                size={{ xs: 1.8, sm: 1.4 }}
                borderTop={1}
                borderColor="#ddd"
                display={{ xs: "none", sm: "block" }}
              >
                {cur1 && (
                  <Typography
                    variant="body1"
                    fontSize={{ xs: "12px", sm: "14px" }}
                  >
                    <Link
                      prefetch={false}
                      href={"/city/cinfo/" + cur1.i[3]}
                      style={{ textDecoration: "none" }}
                    >
                      {ref2[cur1.i[3]].jln}
                    </Link>
                  </Typography>
                )}
              </Grid>
              <Grid
                size={{ xs: 1.9, sm: 1.4 }}
                borderTop={1}
                borderColor="#ddd"
                display={{ xs: "none", sm: "block" }}
              >
                <Typography
                  variant="body1"
                  fontSize={{ xs: "12px", sm: "14px" }}
                >
                  {cur1 ? cur1.y : ""}
                </Typography>
              </Grid>
            </React.Fragment>
          );
        })}
      </Grid>
    </>
  );
};

function SubCategory({ c2s, ref1, json1, ref2 }, i2) {
  return <React.Fragment key={"d" + i2}></React.Fragment>;
}

export default memo(Link2);
