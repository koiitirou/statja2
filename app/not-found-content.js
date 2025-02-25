"use client";

import HideBar from "components/layout/hidebar";
import { Typography } from "@mui/material";
const Content = ({ title, description }) => {
  return (
    <HideBar>
      <Typography variant="h1" component="h1">
        404 ERROR
      </Typography>
      <Typography variant="body1">This page could not be found</Typography>
    </HideBar>
  );
};
export default Content;
