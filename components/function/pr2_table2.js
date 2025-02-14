import {
  useTable,
  useSortBy,
  useGlobalFilter,
  usePagination,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import { memo, useMemo, Fragment, useState, useEffect, React } from "react";
import { Box, Typography } from "@mui/material";
// import classes from "components/css/prefecture.module.css";
// import Link from "next/link";
// import { matchSorter } from "match-sorter";
// import Slider from "@mui/material/Slider";
// import Chip from "@mui/material/Chip";
// import regeneratorRuntime from "regenerator-runtime";

// ... (GlobalFilter component and fuzzyTextFilterFn remain the same)

const App = (props) => {
  // ... (state and useEffect for data fetching remain the same)

  const columns = useMemo(() => {
    return [
      // ... (other column definitions)
      {
        accessorKey: "v.0",
        header: ssg1.def.tl1,
        // Add a filter function directly to the column
        filterFn: (row, columnId, filterValue) => {
          if (!filterValue) return true; // Show all rows if no filter

          const rowValue = row.getValue(columnId); // Get the cell value
          return String(rowValue)
            .toLowerCase()
            .includes(String(filterValue).toLowerCase());
        },
        Cell: ({ row }) => x, // ... (Cell rendering logic remains the same)
      },
      {
        accessorKey: "p.1", //Example for text filter on prefecture name
        header: "都道府県名",
        filterFn: (row, columnId, filterValue) => {
          if (!filterValue) return true; // Show all rows if no filter

          const rowValue = row.getValue(columnId); // Get the cell value
          return String(rowValue)
            .toLowerCase()
            .includes(String(filterValue).toLowerCase());
        },
        Cell: ({ row }) => (
          <Fragment>{/* ... (Link and image rendering logic) */}</Fragment>
        ),
      },
      // ... (other column definitions)
    ];
  }, [ssg1, value]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    preGlobalFilteredRows,
    setGlobalFilter,
    state,
    gotoPage,
    pageCount,
    setPageSize,
    state: { globalFilter, pageSize, pageIndex },
  } = useTable({
    columns,
    data,
    state: {
      globalFilter: "",
    },
    getCoreRowModel: getCoreRowModel(),
    // No useFilters needed here
    useGlobalFilter,
    useSortBy,
    usePagination,
  });

  // ... (rest of the component remains the same)

  return (
    <Box>
      {/* ... (table JSX) */}
      <tbody {...getTableBodyProps()}>
        {page.map((row) => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()} key={row.id}>
              {row.cells.map((cell) => {
                return (
                  <td {...cell.getCellProps()} key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}{" "}
                    {/* Use flexRender */}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
      {/* ... (pagination JSX) */}
    </Box>
  );
};

export default memo(App);
