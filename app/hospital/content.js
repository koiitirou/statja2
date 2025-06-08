"use client";
import HideBar from "components/layout/hidebar";
import Search_dpc from "components/function/search_dpc";
import PopularClient from "components/function/popularClient.js";
import { Box, Typography } from "@mui/material";
import classes from "components/css/retable.module.css";
import Link from "next/link";
import {
  createColumnHelper,
  SortingFn,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table";
import { memo, useMemo, Fragment, useState, useEffect, React } from "react";
import { rankItem } from "@tanstack/match-sorter-utils";

const fuzzyFilter = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = Array.isArray(row.getValue(columnId))
    ? rankItem(row.getValue(columnId).join(" "), value)
    : rankItem(row.getValue(columnId), value);

  // Store the itemRank info
  addMeta({
    itemRank,
  });

  // Return if the item should be filtered in/out
  return itemRank.passed;
};

const columnHelper = createColumnHelper();

const Content = ({ data, options2, title, description }) => {
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [columnFilters, setColumnFilters] = useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0, // Initial page index
    pageSize: 100, // Number of rows per page
  });

  const columns = [
    columnHelper.accessor("short_name", {
      header: "都道府県",
      enableGlobalFilter: false,
    }),
    columnHelper.accessor("hs2", {
      header: "病院名",
      cell: (info) => (
        <Link href={"/hospital/" + info.getValue()[1]}>
          {info.getValue()[0]}
        </Link>
      ),
    }),
    columnHelper.group({
      header: "病床数",
      columns: [
        columnHelper.accessor("bll", {
          header: "総病床",
        }),
        columnHelper.accessor("dpb", {
          header: "DPC病床",
        }),
      ],
    }),
    columnHelper.group({
      header: "入院患者数　月あたりの数",
      columns: [
        columnHelper.accessor("apn", {
          header: "全患者",
        }),
        columnHelper.accessor("amn", {
          header: "救急車搬送",
        }),
        columnHelper.accessor("e1n", {
          header: "予定外",
        }),
        columnHelper.accessor("e2n", {
          header: "救急医療",
        }),
        columnHelper.accessor("rfn", {
          header: "他院紹介",
        }),
      ],
    }),
  ];

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter,
      pagination,
      columnFilters, // ▲ 追加
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    onColumnFiltersChange: setColumnFilters, // ▲ 追加
    onPaginationChange: setPagination,
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    // globalFilterFn: "text",
    globalFilterFn: fuzzyFilter,
    onGlobalFilterChange: setGlobalFilter,
    getColumnCanGlobalFilter: (col) => {
      return col.columnDef.enableGlobalFilter ?? true;
    },
    // enableGlobalFilter: true,
  });

  return (
    <HideBar>
      <Search_dpc />
      <Typography variant="h2">よく見られている病院</Typography>
      <PopularClient path="hospital" />
      <Typography variant="h2">よく見られている疾患名・病気</Typography>
      <PopularClient path="dpc" />
      <Typography variant="h1">{title}</Typography>
      <Typography variant="body1">　{description}</Typography>
      <Typography variant="body1">
        　DPC病院一覧から、全国・各都道府県の病院の診療実績（症例数、手術数、在院日数）を比較することができます。
      </Typography>
      <Box className={classes.retable} sx={{ overflowX: "auto" }}>
        <Box sx={{ display: "flex", gap: 2, p: 1, alignItems: "center" }}>
          {/* 都道府県フィルター用のドロップダウン */}
          <select
            value={table.getColumn("short_name")?.getFilterValue() ?? ""}
            onChange={(e) =>
              table.getColumn("short_name")?.setFilterValue(e.target.value)
            }
          >
            <option value="">すべての都道府県</option>
            {options2?.map((pref) => (
              <option key={pref} value={pref}>
                {pref}
              </option>
            ))}
          </select>
          <DebouncedInput
            value={globalFilter ?? ""}
            onChange={(value) => setGlobalFilter(String(value))}
            placeholder="病院名..."
          />
        </Box>
        <table className={classes.table3}>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()} // ← クリックでソート
                    style={{ cursor: "pointer" }} // ← カーソルを変更（UX向上）
                    colSpan={header.colSpan} //nested columnsでcolSpanが必要
                  >
                    {header.isPlaceholder ? null : ( //nested columnsで必要
                      <div>
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {{
                          asc: " ▲",
                          desc: " ▼",
                        }[header.column.getIsSorted()] ?? null}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className={classes.tb}>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {/* ← ADDED: Pagination Controls UI */}
        <Box
          className="pagination-controls"
          sx={{
            p: 2,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 2,
          }}
        >
          <button
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            {"<<"}
          </button>
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            {"<"}
          </button>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            {">"}
          </button>
          <button
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            {">>"}
          </button>
          <Typography component="span" sx={{ mx: 1 }}>
            Page{" "}
            <strong>
              {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </strong>
          </Typography>
          <Typography component="span">
            | Go to page:
            <input
              type="number"
              defaultValue={table.getState().pagination.pageIndex + 1}
              onChange={(e) => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0;
                table.setPageIndex(page);
              }}
              style={{ width: "60px", marginLeft: "5px", marginRight: "5px" }}
            />
          </Typography>
          <select
            value={table.getState().pagination.pageSize}
            onChange={(e) => {
              table.setPageSize(Number(e.target.value));
            }}
          >
            {[100, 500, 1000, 5000, 10000].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </select>
        </Box>
      </Box>
    </HideBar>
  );
};

export default Content;

// A debounced input react component
function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}) {
  const [value, setValue] = useState(initialValue);
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [value]);

  return (
    <input
      {...props}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}
