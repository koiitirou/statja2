// React Imports
import { useState } from "react";
import React, { ReactNode } from "react";

import { usePathname } from "next/navigation";

// MUI Imports

import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
// import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

const Breadcrumb = ({
  rep1,
  //   homeElement,
  //   listClasses,
  //   activeClasses,
  //   capitalizeLinks,
  //   container,
}) => {
  const paths = usePathname();
  const pathNames = paths.split("/").filter((path) => path);

  // States
  //   const [open, setOpen] = useState(false);
  //   const [tooltipOpen, setTooltipOpen] = useState(false);

  //   const getModeIcon = () => {
  //     return "ri-arrow-right-s-fill";
  //   };
  console.log(rep1);
  return (
    <>
      {/* <Tooltip
        title={"Navigator"}
        onOpen={() => setTooltipOpen(true)}
        onClose={() => setTooltipOpen(false)}
        open={open ? false : tooltipOpen ? true : false}
        // PopperProps={{ className: "capitalize" }}
      >
        <i className={getModeIcon()} />
      </Tooltip> */}
      <Breadcrumbs
        aria-label="breadcrumb"
        //   className={container}
      >
        <Typography>
          <Link
            underline="hover"
            // className="text-slate-900 font-bold"
            href={"/"}
            color="rgba(0, 0, 0, 0.6);"
          >
            トップ
          </Link>
        </Typography>
        {pathNames.map((link, index) => {
          let href = `/${pathNames.slice(0, index + 1).join("/")}`;
          //   let itemClasses =
          //     paths === href ? `${listClasses} ${activeClasses}` : listClasses;
          //   let itemLink = capitalizeLinks
          //     ? link[0].toUpperCase() + link.slice(1)
          //     : link;
          let itemLink = rep1 && rep1[link] ? rep1[link] : link; // 置換ロジック
          return (
            <Typography key={index}>
              <Link
                underline="hover"
                href={href}
                // className={itemClasses}
                color="rgba(0, 0, 0, 0.6);"
              >
                {itemLink}
              </Link>
            </Typography>
          );
        })}
      </Breadcrumbs>
    </>
  );
};

export default Breadcrumb;
