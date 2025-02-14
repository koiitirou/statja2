import {
  memo,
  useMemo,
  Fragment,
  useState,
  useEffect,
  React,
  useRef,
} from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  getFilteredRowModel,
  getFacetedRowModel,
  getColumnCanGlobalFilter,
} from "@tanstack/react-table";
import Link from "next/link";
import Image from "next/image";
import { Box, Typography, Slider, Chip } from "@mui/material";
import classes from "components/css/prefecture.module.css";
import { rankItem } from "@tanstack/match-sorter-utils";
import { useVirtualizer } from "@tanstack/react-virtual";

const App = (props) => {
  console.log(props);
  const marks = props.marks;
  const ssg1 = props.ssg1;
  var init1 = [];
  const [value, setValue] = useState(useMemo(() => ssg1.def.tmx));
  const [sorting, setSorting] = useState([]);
  const [data, setData] = useState(useMemo(() => ssg1.tab[ssg1.def.tmx].data));
  useEffect(() => {
    if (props.isfetch) {
      setData(ssg1.tab[value].data);
    }
  }, [ssg1, value]);
  const column0 = ssg1.tab[ssg1.def.tmx].columns;

  const columns = column0.map((item) => ({
    header: item.Header,
    accessorKey: item.accessor,
  }));
  console.log(columns);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const { rows } = table.getRowModel();

  const parentRef = useRef(null);

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 34,
    overscan: 20,
  });

  return (
    <div ref={parentRef} className="container">
      <div style={{ height: `${virtualizer.getTotalSize()}px` }}>
        <table>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {virtualizer.getVirtualItems().map((virtualRow, index) => {
              const row = rows[virtualRow.index];
              return (
                <tr
                  key={row.id}
                  style={{
                    height: `${virtualRow.size}px`,
                    tranform: `translateY(${
                      virtualRow.start - index * virtualRow.size
                    }px)`,
                  }}
                >
                  {row.getVisibleCells().map((cell) => {
                    return (
                      <td key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default memo(App);
