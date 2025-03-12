"use client";

import HideBar from "components/layout/hidebar";
import NextBreadcrumbs from "components/function/bcv15";
import Cit_windowed from "components/function/cit_windowed";
import Cit_link from "components/function/cit_link";

const Content = ({
  rep1,
  json1,
  ref1,
  ref2,
  array4,
  title,
  description,
  town,
}) => {
  return (
    <HideBar>
      <NextBreadcrumbs rep1={rep1} />
      <Cit_windowed />
      <Cit_link ref1={ref1} json1={json1} array4={array4} ref2={ref2} />
    </HideBar>
  );
};
export default Content;
