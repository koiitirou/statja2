"use client";

// import HideBar from "components/layout/hidebar";
// import NextBreadcrumbs from "components/function/bcv15";
// import { Typography, Box } from "@mui/material";
// import Windowed from "components/function/prescription_windowed";
// import Pyramid2 from "components/function/Prescription_pyramid";

// const rep1 = {
//   ndb: "処方薬ランキング",
//   prescription: "処方薬",
// };

const Content = () =>
  // { title, description, ssg1 }

  {
    // const con_name = ssg1.def.dn2;
    return (
      <>
        aa
        {/* <NextBreadcrumbs rep1={rep1} />
      <Windowed />
      <Typography variant="h1">{title}</Typography>
      <Typography variant="body1">
        {"　"}
        {description}
      </Typography>
      <Typography variant="body1">
        {"　"}
        {con_name}の売上は{ssg1.dat[0].val.sl.toLocaleString()}
        円、薬価は
        {ssg1.def.ei2 == "ind" && <>{ssg1.def.dp2}、</>}処方数は
        {ssg1.dat[0].val.pf}
        {ssg1.def.unt}でした。
      </Typography>
      <Pyramid2 res2={ssg1} con_name={con_name} /> */}
      </>
    );
  };

export default Content;
