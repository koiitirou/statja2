import { useMemo, useState, useEffect, memo } from "react";
import { geoCentroid } from "d3-geo";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from "react-simple-maps";
import { scaleQuantize } from "d3-scale";
//import { tsv, json } from 'd3-fetch';
import { Box, Typography, Stack } from "@mui/material";
import { Tooltip } from "react-tooltip";
import Slider from "@mui/material/Slider";
import Chip from "@mui/material/Chip";
import geoUrl from "components/data/map.json";
import ReactDOMServer from "react-dom/server";
const color1 = [
  "#F7FBFF",
  "#DEEBF7",
  "#C6DBEF",
  "#9ECAE1",
  "#6BAED6",
  "#4292C6",
  "#2171B5",
  "#08519C",
  "#08306B",
];
const color2 = [
  "black",
  "black",
  "black",
  "black",
  "black",
  "white",
  "white",
  "white",
  "white",
];
// const geoUrl = "/comp/uniq/map.json";

const MapChart = (props) => {
  const marks = props.marks;
  const ssg1 = props.ssg1;
  const [value, setValue] = useState(ssg1.def.tmx);
  const [data, setData] = useState(ssg1.tab[ssg1.def.tmx].data);
  const [gid, setGid] = useState(data[0].p[1]);
  // const [html1, setHtml1] = useState();
  //////////

  useEffect(() => {
    if (props.isfetch) {
      setData(ssg1.tab[value].data);
    }
  }, [ssg1, value]);

  const html2 = useMemo(() => {
    if (!props.isfetch) return null;
    var cur2 = ssg1.tab[value].data.find((s) => s.p[1] == gid);
    // var html2 = () => {
    return (
      <div>
        <Typography content="h6">
          {cur2 ? ssg1.ref[cur2.p[1]].td_name : ""} {value}
        </Typography>

        <Box sx={{ fontSize: { xs: "12px", sm: "14px" } }}>
          <table className="table">
            <tbody>
              <tr>
                <th>分類</th>
                <th>値</th>
              </tr>

              <tr>
                <td>{ssg1.def.tl1}</td>
                <td>
                  {cur2
                    ? Number(cur2.v[0]).toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                      })
                    : ""}
                  {ssg1.def.ut1}
                </td>
              </tr>
              <tr>
                <td>順位</td>
                <td>{cur2 ? cur2.r + "位" : ""}</td>
              </tr>
              <tr>
                <td>前年比</td>
                <td>
                  {ssg1.def.tmn != value && (
                    <span
                      className={
                        cur2.d < 0
                          ? "mi1"
                          : (cur2.d == 0) | (cur2.d == "NaN")
                          ? "ne1"
                          : "pl1"
                      }
                    >
                      {(cur2.d < 0) | (cur2.d == "NaN") ? "" : "+"}
                      {cur2.d == "NaN"
                        ? ""
                        : cur2.d == "Inf"
                        ? "Inf%"
                        : `${Number(cur2.d).toFixed(2)}%`}
                    </span>
                  )}
                </td>
              </tr>
              <tr>
                <td>前年差（値）</td>
                <td>
                  {ssg1.def.tmn != value && (
                    <span
                      className={
                        cur2.f < 0 ? "mi1" : cur2.f == 0 ? "ne1" : "pl1"
                      }
                    >
                      {cur2.f < 0 ? "" : "+"}
                      {cur2 ? Number(cur2.f).toLocaleString() : ""}
                      {ssg1.def.ut1}
                    </span>
                  )}
                </td>
              </tr>
              <tr>
                <td>前年差（順位）</td>
                <td>
                  {ssg1.def.tmn != value && (
                    <span
                      className={
                        cur2.n * -1 < 0 ? "mi1" : cur2.n == 0 ? "ne1" : "pl1"
                      }
                    >
                      {cur2.n * -1 < 0 ? "" : "+"}
                      {cur2 ? Number(cur2.n * -1) : ""}位
                    </span>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </Box>
      </div>
    );
  }, [value, gid]);
  const memoizedHtml = ReactDOMServer.renderToStaticMarkup(html2);
  // useEffect(() => {
  //   // setHtml1(html2);
  //   setContent(html2);
  // }, [value, gid]);

  const minmax1 = [ssg1.def.vmn, ssg1.def.vmx];

  // const [isMounted, setIsMounted] = useState(false); // Need this for the react-tooltip
  // useEffect(() => {
  //   setIsMounted(true);
  // }, []);

  // const [content, setContent] = useState("");
  const colorScale1 = useMemo(
    () => scaleQuantize().domain(minmax1).range(color1),
    [minmax1]
  );
  const colorScale2 = useMemo(
    () => scaleQuantize().domain(minmax1).range(color2),
    [minmax1]
  );

  const handleChange = (event, value1) => {
    if (typeof value1 === "number" && ssg1.tab[value1]) {
      setValue(value1);
    }
  };
  return (
    <>
      <Box
        sx={{
          p: 0,
        }}
      >
        <Typography variant="h2" component="h2">
          {ssg1.def.tl1}の都道府県別の地図ヒートマップ【{ssg1.def.tmn}〜
          {ssg1.def.tmx}】
        </Typography>

        <Box sx={{ maxWidth: "600px" }}>
          <Typography fontWeight="bold" variant="body2" padding="10px">
            平均：{Number(ssg1.val[value].mn).toLocaleString()}
            {ssg1.def.ut1}
            {"　"}
            {ssg1.val[value].sv != ""
              ? `合計：${Number(ssg1.val[value].sv).toLocaleString()}${
                  ssg1.def.ut1
                }`
              : ""}
          </Typography>
          <Typography
            display="inline"
            gutterBottom
            sx={{ paddingLeft: "10px" }}
          >
            表示年度: <span style={{ fontWeight: "bold" }}>{value}</span>年　
          </Typography>
          <Chip
            label="－"
            size="small"
            variant="outlined"
            onClick={() => {
              const ind1 = marks.findIndex((ss) => ss.value == value);
              marks[ind1 - 1] ? setValue(marks[ind1 - 1].value) : null;
              // setContent(html2);
            }}
          />{" "}
          <Chip
            label="＋"
            size="small"
            variant="outlined"
            onClick={() => {
              const ind1 = marks.findIndex((ss) => ss.value == value);
              marks[ind1 + 1] ? setValue(marks[ind1 + 1].value) : null;
              // setContent(html2);
            }}
          />
          <Box margin="auto" padding="0px 50px">
            <Slider
              value={Number(value)}
              aria-label="non-linear-slider"
              defaultValue={Number(value)}
              min={Number(ssg1.def.tmn)}
              max={Number(ssg1.def.tmx)}
              //valueLabelFormat={valueLabelFormat}
              //getAriaValueText={valuetext}
              step={null}
              valueLabelDisplay="auto"
              marks={marks}
              onChange={handleChange}
            />
          </Box>
          <Box sx={{ fontSize: { xs: "12px", sm: "14px" } }}>
            <Box
              sx={{
                padding: "10px",
                display: "flex",

                fontWeight: "bold",
              }}
            ></Box>

            <div className="legend legend-horizontal legend-scale">
              <span className="legend-value">
                {Number(minmax1[0]).toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                })}
              </span>
              <span
                className="legend-box"
                style={{ backgroundColor: "#f7fbff" }}
              ></span>
              <span
                className="legend-box"
                style={{ backgroundColor: "#deebf7" }}
              ></span>
              <span
                className="legend-box"
                style={{ backgroundColor: "#c6dbef" }}
              ></span>
              <span
                className="legend-box"
                style={{ backgroundColor: "#9ecae1" }}
              ></span>
              <span
                className="legend-box"
                style={{ backgroundColor: "#6baed6" }}
              ></span>
              <span
                className="legend-box"
                style={{ backgroundColor: "#4292c6" }}
              ></span>
              <span
                className="legend-box"
                style={{ backgroundColor: "#2171b5" }}
              ></span>
              <span
                className="legend-box"
                style={{ backgroundColor: "#08519c" }}
              ></span>
              <span
                className="legend-box"
                style={{ backgroundColor: "#08306b" }}
              ></span>
              <span className="legend-value">
                {Number(minmax1[1]).toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                })}{" "}
                {ssg1.def.unit2}
              </span>
            </div>
          </Box>
          <ComposableMap
            data-tip=""
            projectionConfig={{ scale: 2000, center: [13, 6.25] }}
            /*      width={400}*/
            height={500}
          >
            <Geographies geography={geoUrl}>
              {({ geographies }) => (
                <>
                  {geographies.map((geo) => {
                    const centroid = geoCentroid(geo);
                    const cur = data.find((s) => s.p[1] === geo.id);

                    return (
                      <g key={geo.rsmKey + "name"}>
                        <Geography
                          key={geo.rsmKey}
                          geography={geo}
                          stroke="#FFF"
                          fill={cur ? colorScale1(cur.v[0]) : "lightgrey"}
                          data-tooltip-id="map-tooltip"
                          data-tooltip-html={memoizedHtml}
                          onClick={() => {
                            setGid(geo.id);
                            // setContent(html1);
                          }}
                          onMouseEnter={() => {
                            setGid(geo.id);
                            // setContent(html1);
                          }}
                          style={{
                            default: {
                              /* fill: '#D6D6DA', */
                              outline: "none",
                            },
                            hover: {
                              fill: "#F58462",
                              outline: "none",
                            },
                            pressed: {
                              fill: "#F58462",
                              outline: "none",
                            },
                          }}
                        ></Geography>
                        <Marker coordinates={centroid} pointerEvents={"none"}>
                          <text
                            y="7"
                            fontSize={20}
                            textAnchor="middle"
                            fill={cur ? colorScale2(cur.v[0]) : "black"}
                          >
                            {cur ? ssg1.ref[cur.p[1]].short_name : ""}
                          </text>
                        </Marker>
                      </g>
                    );
                  })}
                </>
              )}
            </Geographies>
          </ComposableMap>
          {/* <Tooltip
            id="map-tooltip"
            content={content}
            effect="float"
            type="light"
            place="auto"
          /> */}
          <div id="custom-tooltip-toolbox" className="squaire-toolbox">
            <Box
              sx={{
                display: { xs: "none", sm: "block" },
              }}
            >
              <Tooltip
                id="map-tooltip"
                // content="hello"
                // effect="float"
                // data-tooltip-float={true}
                variant="light"
              />
            </Box>
            <Box sx={{ display: { xs: "block", sm: "none" } }}>{html2}</Box>
          </div>
        </Box>
      </Box>
    </>
  );
};

export default memo(MapChart);
