"use client";
import HideBar from "components/layout/hidebar";
import Search_dpc from "components/function/search_dpc";
import NextBreadcrumbs from "components/function/bcv15";
import { Box, Typography } from "@mui/material";
import Kihon from "components/function/hospital_kihon";
import { useState, useEffect, React } from "react";
import { server } from "components/data/config";
import Hospital from "components/function/hospital_category";

const Content = ({ hospital, ssg1, title, description }) => {
  const rep1 = {
    dpc: "病気名一覧",
    hospital: "病院一覧",
    [hospital]: ssg1.def.hospital,
  };

  const [isLoaded, setIsLoaded] = useState(false);
  const [ydata, setYdata] = useState(null);

  useEffect(() => {
    setIsLoaded(false);
  }, [hospital]);
  useEffect(() => {
    if (!isLoaded) {
      const fetchData = async () => {
        try {
          const response1 = await fetch(
            `${server}/hospital3/${hospital}_int.json`
          );
          const json1 = await response1.json();
          setYdata(json1);
        } catch (error) {
          console.error("Error to fetch json");
        }
      };
      fetchData();
      setIsLoaded(true);
    }
  }, [hospital, isLoaded]);

  return (
    <HideBar>
      <NextBreadcrumbs rep1={rep1} />
      <Search_dpc />
      <Typography variant="h1">{title}</Typography>
      <Typography variant="body1">
        　{ssg1.def.time}年の{description}
      </Typography>
      {ssg1.def.time_basic && (
        <Kihon
          hospital1={hospital}
          ssg2={ssg1}
          isLoaded={isLoaded}
          ydata={ydata}
        />
      )}
      {ssg1.def.time_category && (
        <Hospital
          hospital1={hospital}
          staticData={ssg1}
          isLoaded={isLoaded}
          timeSeriesData={ydata}
        />
      )}
    </HideBar>
  );
};
export default Content;
