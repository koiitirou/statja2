"use client";
import HideBar from "components/layout/hidebar";
import Search_dpc from "components/function/search_dpc";
import PopularClient from "components/function/popularClient.js";
import NextBreadcrumbs from "components/function/bcv15";
import { Box, Typography } from "@mui/material";
import classes from "components/css/retable.module.css";
import Link from "next/link";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table";
import { useState, useEffect, React } from "react";
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

const rep1 = {
  dpc: "病気名一覧",
  hospital: "病院一覧",
};

const Content = ({ title, description, data, options1 }) => {
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [columnFilters, setColumnFilters] = useState([]);
  //   const [pagination, setPagination] = useState({
  //     pageIndex: 0, // Initial page index
  //     pageSize: 100, // Number of rows per page
  //   });　//pagination

  const columns = [
    columnHelper.accessor("nic", {
      header: "診断分類",
    }),
    columnHelper.accessor("di2", {
      header: "病気名",
      cell: (info) => (
        <Link prefetch={false} href={"/dpc/" + info.getValue()[1]}>
          {info.getValue()[0]}
        </Link>
      ),
    }),
    // '治療実績'のグループ
    columnHelper.group({
      header: "治療実績(件数)",
      columns: [
        columnHelper.accessor("kll", {
          header: "合計",
        }),
        columnHelper.accessor("kes", {
          header: "手術あり",
        }),
        columnHelper.accessor("kon", {
          header: "手術なし",
        }),
      ],
    }),
    // '在院日数'のグループ
    columnHelper.group({
      header: "在院日数(日)",
      columns: [
        columnHelper.accessor("zll", {
          header: "合計",
        }),
        columnHelper.accessor("zes", {
          header: "手術あり",
        }),
        columnHelper.accessor("zon", {
          header: "手術なし",
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
      //   pagination, //pagination
      columnFilters, // ▲ 追加
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    onColumnFiltersChange: setColumnFilters, // ▲ 追加
    // onPaginationChange: setPagination, //pagination
    // getPaginationRowModel: getPaginationRowModel(), //pagination
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
      <NextBreadcrumbs rep1={rep1} />
      <Search_dpc />
      <Typography variant="h2">よく見られている病院</Typography>
      <PopularClient path="hospital" />
      <Typography variant="h2">よく見られている疾患名・病気</Typography>
      <PopularClient path="dpc" />
      <Typography variant="h1">{title}</Typography>
      <Typography variant="body1">　{description}</Typography>
      <Typography variant="body1">
        　DPC診断病名分類の一覧から、全国・各都道府県の病院の診療実績（症例数、手術数、在院日数）のランキング、年次推移を比較することができます。
      </Typography>

      <Box className={classes.retable} sx={{ overflowX: "auto" }}>
        <Box sx={{ display: "flex", gap: 2, p: 1, alignItems: "center" }}>
          {/* 都道府県フィルター用のドロップダウン */}
          <select
            value={table.getColumn("nic")?.getFilterValue() ?? ""}
            onChange={(e) =>
              table.getColumn("nic")?.setFilterValue(e.target.value)
            }
          >
            <option value="">すべての診断分類</option>
            {options1?.map((pref) => (
              <option key={pref} value={pref}>
                {pref}
              </option>
            ))}
          </select>
          <DebouncedInput
            value={globalFilter ?? ""}
            onChange={(value) => setGlobalFilter(String(value))}
            placeholder="病気名..."
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
