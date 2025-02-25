import { memo, useMemo, Fragment, useState, useEffect, React } from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";
import Link from "next/link";
import { Box, Typography, Slider, Chip } from "@mui/material";
import classes from "components/css/prefecture.module.css";
import { rankItem } from "@tanstack/match-sorter-utils";
import { isArray } from "lodash";
///////////////都道府県

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

////////////////App ()
const App = (props) => {
  const ref1 = props.ref1;
  const marks = props.marks;
  const ssg1 = props.ssg1;
  const [value, setValue] = useState(useMemo(() => ssg1.def.tmx));
  const [sorting, setSorting] = useState([]);
  const [data, setData] = useState(useMemo(() => ssg1.tab[ssg1.def.tmx].data));
  const [globalFilter, setGlobalFilter] = useState("");

  useEffect(() => {
    if (props.isfetch) {
      setData(ssg1.tab[value].data);
    }
  }, [ssg1, value]);
  /////////////////

  const handleChange = (event, value) => {
    if (typeof value === "number" && ssg1.tab[value]) {
      setValue(value);
    }
  };

  ///convert column0
  const convertArray = (arr) => {
    return arr.map((item) => {
      if (item.columns) {
        // ネストされたカラムがある場合
        return {
          header: item.Header,
          columns: convertArray(item.columns), // 再帰的に変換
        };
      } else {
        // ネストされたカラムがない場合
        return {
          header: item.Header,
          accessorKey: item.accessor,
          sortingFn: (rowA, rowB, columnId) => {
            if (isArray(rowA.getValue(columnId))) {
              return (
                Number(rowA.getValue(columnId)[0]) -
                Number(rowB.getValue(columnId)[0])
              );
            } else {
              return (
                Number(rowA.getValue(columnId)) -
                Number(rowB.getValue(columnId))
              );
            }
          },

          cell: ({ cell }) => {
            const col2Value = cell.getValue(); // ここで一度だけ取得
            if (item.accessor === "p") {
              return (
                <Fragment>
                  <img
                    src={"/img/logo/" + col2Value + ".png"}
                    width={16}
                    height={16}
                    alt={col2Value}
                    className={classes.img1}
                  />
                  <Link
                    prefetch={false}
                    href={"/prefecture/info/" + col2Value + "/category/"}
                  >
                    {ref1[col2Value].tln}
                  </Link>
                </Fragment>
              );
            } else if (item.accessor == "v") {
              return (
                <div className={classes.p1}>
                  <div className={classes.p2}>
                    {Number(col2Value[0]).toLocaleString()}
                    {unit1}
                  </div>
                  <div className={classes.p4}>
                    <div
                      className={classes.p3}
                      style={{
                        width: (col2Value[1] == "" ? 0 : col2Value[1]) + "%",
                        backgroundColor: ref1[col2Value[2]].tcl,
                      }}
                    ></div>
                  </div>
                </div>
              );
            } else if (item.accessor == "d") {
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
                  {Number(col2Value).toFixed(2)}%
                </span>
              );
            } else if (item.accessor == "f") {
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
            } else if (item.accessor == "n") {
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
            } else if (item.accessor == "s") {
              return (
                <span>
                  {Number(col2Value).toLocaleString()}
                  {ssg1.def.ut1}
                </span>
              );
            } else if (item.accessor == "a") {
              return (
                <span>
                  {Number(col2Value).toLocaleString()}
                  {ssg1.def.ut2}
                </span>
              );
            } else if (item.accessor == "h") {
              return (
                <span>
                  {Number(col2Value).toLocaleString()}
                  {ssg1.def.ut3}
                </span>
              );
            } else {
              return col2Value; // それ以外はそのまま
            }
          },
        };
      }
    });
  };

  const column0 = ssg1.tab[ssg1.def.tmx].columns;
  const columns = convertArray(column0);
  /////////////////Filter option
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

  const unit1 = ssg1.def.ut0;
  return (
    <Box>
      <Typography variant="h2" component="h2" id="ind">
        {ssg1.def.tl1}収穫量の都道府県別のランキング順位表【{ssg1.def.tmn}〜
        {ssg1.def.tmx}】
      </Typography>
      <Box maxWidth="600px">
        <Typography fontWeight="bold" variant="body2" padding="10px">
          平均：{Number(ssg1.tab[value].def.mn).toLocaleString()}
          {ssg1.def.ut0}
          {"　"}
          {ssg1.tab[value].def.sv != ""
            ? `合計：${Number(ssg1.tab[value].def.sv).toLocaleString()}${
                ssg1.def.ut0
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
        <table className={[classes.table1, classes.yasai1].join(" ")}>
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
