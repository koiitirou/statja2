// src/theme.ts
"use client";
// import { Roboto } from "next/font/google";
import { createTheme } from "@mui/material/styles";

// const roboto = Roboto({
//   weight: ["300", "400", "500", "700"],
//   subsets: ["latin"],
//   display: "swap",
// });

const theme = createTheme({
  cssVariables: true,
  typography: {
    fontFamily: '"Noto Sans JP","Helvetica","Arial",sans-serif',
    // fontFamily: '"Noto Sans","Helvetica","Arial",sans-serif',
    h1: {
      fontSize: "1.6em",
      fontWeight: "bold",
      margin: "16px 0",
    },
    h2: {
      fontSize: "1.3em",
      fontWeight: "bold",
      margin: "16px 0",
      border: "0",
      borderLeft: "solid 5px dodgerblue",
      paddingLeft: "7px",
    },
    h3: {
      fontSize: "1.1em",
      fontWeight: "bold",
      margin: "16px 0",
      borderLeft: "solid 5px dodgerblue",
      backgroundColor: "#deebf7",
      display: "block",
      padding: "7px 10px",
    },
  },
  palette: {
    primary: {
      main: "#f5f5f5",
    },
    secondary: {
      main: "#2196f3",
    },
    // error: {
    //   main: red.A400,
    // },
  },
});

export default theme;
