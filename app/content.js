"use client";
import { Box, Typography } from "@mui/material";
import HideBar from "components/layout/hidebar";

const Content = ({ title, description }) => {
  return (
    <>
      <HideBar>
        <Typography variant="h1">{title}</Typography>
        <Typography variant="h1">{title}</Typography>
        <Typography variant="h1">{title}</Typography>{" "}
        <Typography variant="h1">{title}</Typography>{" "}
        <Typography variant="h1">{title}</Typography>{" "}
        <Typography variant="h1">{title}</Typography>{" "}
        <Typography variant="h1">{title}</Typography>{" "}
        <Typography variant="h1">{title}</Typography>
        <Typography variant="body1">{description}</Typography>
      </HideBar>
    </>
  );
};

export default Content;
