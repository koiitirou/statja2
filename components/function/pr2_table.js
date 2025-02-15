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

const App = (props) => {
  console.log(props);
  const marks = props.marks;
  const ssg1 = props.ssg1;
  var init1 = [];
  const [value, setValue] = useState(useMemo(() => ssg1.def.tmx));
  const [sorting, setSorting] = useState([]);
  const [data, setData] = useState(useMemo(() => ssg1.tab[ssg1.def.tmx].data));
  const [globalFilter, setGlobalFilter] = useState("");
  console.log(data);
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

  column0[4] = { Header: "前年差", accessor: "f" };
  column0[5] = { Header: "順位差", accessor: "n" };
  const columns = column0.map((item, index) => ({
    header: item.Header,
    accessorKey: item.accessor,
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

      if (index === 1) {
        return (
          <Fragment>
            <img
              src={"/img/logo/" + col2Value[1] + ".png"}
              width={16}
              height={16}
              alt={col2Value[0]}
              className={classes.img1}
            />
            <Link
              prefetch={false}
              href={"/prefecture/info/" + col2Value[1] + "/category/"}
            >
              {col2Value[0]}
            </Link>
          </Fragment>
        );
      } else if (index === 2) {
        return (
          <div className={classes.p1}>
            <div className={classes.p2}>{col2Value[0].toLocaleString()}</div>
            <div className={classes.p4}>
              <div
                className={classes.p3}
                style={{
                  width: col2Value[1] + "%",
                  backgroundColor: ssg1.ref[col2Value[2]].color,
                }}
              ></div>
            </div>
          </div>
        );
      } else if (index === 3) {
        return (
          <span
            className={
              classes[
                Number(col2Value) < 0
                  ? "mi1"
                  : Number(col2Value) == 0
                  ? "ne1"
                  : "pl1"
              ]
            }
          >
            {Number(col2Value) < 0 ? "" : "+"}
            {Number(col2Value).toFixed(2)}%
          </span>
        );
      } else if (index === 4) {
        return value == Number(ssg1.def.tmn) ? (
          ""
        ) : (
          <span
            className={
              classes[
                Number(col2Value) < 0
                  ? "mi1"
                  : Number(col2Value) == 0
                  ? "ne1"
                  : "pl1"
              ]
            }
          >
            {Number(col2Value) < 0 ? "" : "+"}
            {Number(col2Value).toLocaleString()}
          </span>
        );
      } else if (index === 5) {
        return value == Number(ssg1.def.tmn) ? (
          ""
        ) : Number(col2Value) == 0 ? (
          ""
        ) : (
          <span
            className={
              classes[
                Number(col2Value * -1) < 0
                  ? "mi1"
                  : Number(col2Value) == 0
                  ? "ne1"
                  : "pl1"
              ]
            }
          >
            {Number(col2Value * -1) < 0 ? "" : "+"}
            {Number(col2Value * -1)}
          </span>
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
        <div>
          <DebouncedInput
            value={globalFilter ?? ""}
            onChange={(value) => setGlobalFilter(String(value))}
            placeholder="大阪..."
          />
        </div>
        <table className={[classes.table1, classes.shohou1].join(" ")}>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
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
