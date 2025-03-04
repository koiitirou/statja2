import classes from "components/css/cinfo.module.css";
import { Typography, Box } from "@mui/material";
import Link from "next/link";
import { useMemo, Fragment, useState, useEffect, memo, useRef } from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";
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

const Retable = ({ data, column0, category1, th_prefec, options_topic }) => {
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);

  var columns = column0.map((item, index) => ({
    header: item.Header,
    accessorKey: item.accessor,
    filterFn: index === 0 ? "arrIncludes" : undefined,
    // enableSorting: true,
    sortingFn: (rowA, rowB, columnId) => {
      if (index == 2) {
        return (
          Number(rowA.getValue(columnId)[0]) -
          Number(rowB.getValue(columnId)[0])
        );
      } else {
        return (
          Number(rowA.getValue(columnId)) - Number(rowB.getValue(columnId))
        );
      }
    },

    cell: ({ cell }) => {
      const col2Value = cell.getValue(); // ここで一度だけ取得
      if (index === 0) {
        return col2Value[0];
      } else if (index === 1) {
        return Number(col2Value).toLocaleString();
      } else if (index === 2) {
        return (
          <Link prefetch={false} href={"/city/category/" + col2Value[1]}>
            {Number(col2Value[0])}位
          </Link>
        );
      } else {
        return col2Value; // それ以外はそのまま
      }
    },
  }));

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter,
      columnFilters,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    // globalFilterFn: "text",
    globalFilterFn: fuzzyFilter,
    onGlobalFilterChange: setGlobalFilter,
    getColumnCanGlobalFilter: (col) => {
      return col.columnDef.enableGlobalFilter ?? true;
    },
    // enableGlobalFilter: true,
    //filter
    onColumnFiltersChange: setColumnFilters,
  });

  return (
    <Box className={classes.retable}>
      <Box className={classes.world1}>
        <div>
          <DebouncedInput
            value={globalFilter ?? ""}
            onChange={(value) => setGlobalFilter(String(value))}
            placeholder="大阪市..."
          />
        </div>
        <table className={classes.table1}>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header, ih) => (
                  <th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()} // ← クリックでソート
                    style={{ cursor: "pointer" }} // ← カーソルを変更（UX向上）
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                    {{
                      asc: " ▲",
                      desc: " ▼",
                    }[header.column.getIsSorted()] ?? null}
                    {ih == 0 && header.column.getCanFilter() ? (
                      <div>
                        <SimpleFilte2
                          column={header.column}
                          table={table}
                          options_topic={options_topic}
                        />
                      </div>
                    ) : null}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
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
    </Box>
  );
};

export default Retable;

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

////
function SimpleFilte2({ column, table, options_topic }) {
  const firstValue = table
    .getPreFilteredRowModel()
    .flatRows[0]?.getValue(column.id);

  const columnFilterValue = column.getFilterValue();

  const sortedUniqueValues = options_topic;

  return (
    <>
      <select
        value={columnFilterValue ?? ""}
        onChange={(e) => {
          column.setFilterValue(e.target.value || undefined);
        }}
      >
        <option value="">All</option>
        {sortedUniqueValues.map((v, i) => {
          return (
            <option key={i} value={v}>
              {v}
            </option>
          );
        })}
      </select>
    </>
  );
}
