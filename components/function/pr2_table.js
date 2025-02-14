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
  const handleChange = (event, value) => {
    if (typeof value === "number" && ssg1.tab[value]) {
      setValue(value);
    }
  };
  const column0 = ssg1.tab[ssg1.def.tmx].columns;

  const columns = column0.map((item, index) => ({
    header: item.Header,
    accessorKey: item.accessor,
    ...(index === 1
      ? {
          cell: ({ cell }) => {
            const col2Value = cell.getValue();
            console.log(col2Value);
            if (Array.isArray(col2Value)) {
              return (
                <ul>
                  {col2Value.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              );
            } else {
              return col2Value;
            }
          },
        }
      : {}), //  <--- The key is this empty object for the else case
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

  // const parentRef = useRef(null);

  // const virtualizer = useVirtualizer({
  //   count: rows.length,
  //   getScrollElement: () => parentRef.current,
  //   estimateSize: () => 34,
  //   overscan: 20,
  // });

  return (
    <Box>
      <Typography variant="h2" component="h2" id="ind">
        {ssg1.def.tl1}の都道府県別のランキング順位表【{ssg1.def.tmn}〜
        {ssg1.def.tmx}】
      </Typography>
      <Box maxWidth="600px">
        <Typography fontWeight="bold" variant="body2" padding="10px">
          平均：{Number(ssg1.val[value].mn).toLocaleString()}
          {ssg1.def.ut1}
          {"　"}
          {ssg1.val[value].sv != ""
            ? `合計：${Number(ssg1.val[value].sv).toLocaleString()}${
                ssg1.def.ut1
              }`
            : ""}
        </Typography>
        <Typography display="inline" gutterBottom sx={{ paddingLeft: "10px" }}>
          表示年度: <span style={{ fontWeight: "bold" }}>{value}</span>年　
        </Typography>
        <Chip
          label="－"
          size="small"
          variant="outlined"
          onClick={() => {
            const ind1 = marks.findIndex((ss) => ss.value == value);
            marks[ind1 - 1] ? setValue(marks[ind1 - 1].value) : null;
          }}
        />{" "}
        <Chip
          label="＋"
          size="small"
          variant="outlined"
          onClick={() => {
            const ind1 = marks.findIndex((ss) => ss.value == value);
            marks[ind1 + 1] ? setValue(marks[ind1 + 1].value) : null;
          }}
        />
        <Box padding="0px 50px">
          <Slider
            valueLabelDisplay="auto"
            value={Number(value)}
            aria-label="non-linear-slider"
            defaultValue={Number(ssg1.def.tmx)}
            min={Number(ssg1.def.tmn)}
            max={Number(ssg1.def.tmx)}
            step={null}
            marks={marks}
            onChange={handleChange}
          />
        </Box>
      </Box>
      <Box className={classes.retable}>
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
export default memo(App);
