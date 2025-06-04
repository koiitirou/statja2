import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table";
import { useMemo, Fragment, useState, useEffect, memo, useRef } from "react";
import React from "react";
import { Box, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import classes from "components/css/world.module.css";
import Link from "next/link";
import { rankItem } from "@tanstack/match-sorter-utils";
import { server } from "components/data/config";
import Slider from "@mui/material/Slider";
import Chip from "@mui/material/Chip";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Surface,
  Symbols,
} from "recharts";
import Select from "react-select";
import palette1 from "components/data/palette.json";

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
const App = ({ ssg1, did1, marks, column0, graphList, time_list2 }) => {
  const [rowSelection, setRowSelection] = useState({});
  const [graph, setGraph] = useState(graphList[1]);
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [value, setValue] = useState(Number(ssg1.def.tmx));
  const [data, setData] = useState(ssg1.tab[ssg1.def.tmx].data);
  const [ydata, setYdata] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setRowSelection({});
  }, [value]);
  useEffect(() => {
    if (!isLoaded) {
      const fetchData = async () => {
        try {
          const response1 = await fetch(`${server}/citjson2/${did1}_int.json`);
          const json1 = await response1.json();
          setYdata(json1);
        } catch (error) {
          console.error("Error to fetch json");
        }
      };
      fetchData();
      setIsLoaded(true);
      setRowSelection({
        0: true,
        1: true,
        2: true,
      });
    }
  }, []);
  ///
  useEffect(() => {
    if (isLoaded & (ydata != null)) {
      setData(ydata.tab[value].data);
    }
  }, [ydata, value, isLoaded]);
  const handleChange = (event, value) => {
    if (typeof value === "number" && ydata.tab[value]) {
      setValue(value);
    }
  };
  ////////////
  /////
  // const [chartData, setChartData] = useState([]);
  const [did_list1, setDid] = useState([]);
  const [dis_list1, setDnm] = useState([]);

  ///////

  const column1 = column0.map((item, index) => ({
    header: item.Header,
    accessorKey: item.accessor,
    // enableSorting: true,
    sortingFn: (rowA, rowB, columnId) => {
      if (index === 1 || index === 2) {
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
      if (index == 1) {
        return (
          <Link prefetch={false} href={"/city/cinfo/" + col2Value[0]}>
            {col2Value[1]}
          </Link>
        );
      } else if (index == 2) {
        return (
          <div className={classes.p1}>
            <div className={classes.p2}>
              {Number(col2Value[0]).toLocaleString()}
              {ssg1.def.ut2}
            </div>
            <div className={classes.p4}>
              <div
                className={classes.p3}
                style={{
                  width: col2Value[1] == "" ? 0 : col2Value[1] + "%",
                  backgroundColor: col2Value[2],
                }}
              ></div>
            </div>
          </div>
        );
      } else if (index === 3) {
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
      } else {
        return col2Value; // それ以外はそのまま
      }
    },
  }));

  function IndeterminateCheckbox({ indeterminate, className = "", ...rest }) {
    const ref = useRef();
    useEffect(() => {
      if (typeof indeterminate === "boolean") {
        ref.current.indeterminate = !rest.checked && indeterminate;
      }
    }, [ref, indeterminate, rest]);

    return (
      <input
        type="checkbox"
        ref={ref}
        className={className + " cursor-pointer"}
        {...rest}
      />
    );
  }

  const columns = [
    {
      id: "select",
      header: ({ table }) => (
        <IndeterminateCheckbox
          {...{
            checked: table.getIsAllRowsSelected(),
            indeterminate: table.getIsSomeRowsSelected(),
            onChange: table.getToggleAllRowsSelectedHandler(),
          }}
        />
      ),
      cell: ({ row }) => (
        <div className="px-1">
          <IndeterminateCheckbox
            {...{
              checked: row.getIsSelected(),
              disabled: !row.getCanSelect(),
              indeterminate: row.getIsSomeSelected(),
              onChange: row.getToggleSelectedHandler(),
            }}
          />
        </div>
      ),
    },
    ...column1,
  ];
  ////

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter,
      rowSelection,
    },
    initialState: {
      pagination: { pageSize: 100 },
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
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

  /////
  //
  /////////////
  const check_length = Object.keys(rowSelection).length;
  useEffect(() => {
    if (ydata) {
      var did_list2 = [];
      var dis_list2 = [];
      Object.keys(rowSelection).forEach((v, i) => {
        if (i > 10) {
          return;
        }
        did_list2.push(data[v].s[0]);
        dis_list2.push(data[v].s[1]);
      });
      setDid(did_list2);
      setDnm(dis_list2);
    }
  }, [check_length, ydata, rowSelection, data]);
  /////////////

  const chartData = useMemo(() => {
    if (ydata && did_list1 != undefined) {
      const child1 = [];
      time_list2.forEach((v0, i0) => {
        const child2 = { year: v0 };
        did_list1.forEach((v1, i1) => {
          const th_categories = ydata.tab[v0].data.find(
            (s0) => s0.s[0] === did_list1[i1]
          );
          const th_categories_base = ydata.tab[
            time_list2[time_list2.length - 1]
          ].data.find((s0) => s0.s[0] === did_list1[i1]);
          if (
            th_categories &&
            th_categories_base &&
            th_categories[graph.value] !== ""
          ) {
            child2[th_categories_base.s[1]] = Array.isArray(
              th_categories[graph.value]
            )
              ? Number(th_categories[graph.value][0])
              : Number(th_categories[graph.value]);
          }
        });
        child1.push(child2);
      });
      return child1;
    }
    return [];
  }, [did_list1, graph, ydata, time_list2]);

  return (
    <Box className={classes.retable}>
      {chartData != [] && isLoaded && (
        <Suiig
          ssg1={ssg1}
          graphList={graphList}
          graph={graph}
          setGraph={setGraph}
          dis_list1={dis_list1}
          chartData={chartData}
        />
      )}
      <Typography variant="h2" component="h2">
        {ssg1.def.tl1}の市区町村ランキング {value}
      </Typography>
      <Box padding="10px 50px" maxWidth="600px">
        <Typography display="inline" gutterBottom sx={{ paddingRight: "0px" }}>
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
        <Slider
          valueLabelDisplay="auto"
          value={value}
          aria-label="non-linear-slider"
          defaultValue={Number(ssg1.def.tmx)}
          min={Number(ssg1.def.tmn)}
          max={Number(ssg1.def.tmx)}
          step={null}
          marks={marks}
          onChange={handleChange}
        />
      </Box>
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
        <Grid container spacing={0.5} className={classes.pagination}>
          <Grid size={{ xs: 6, sm: 3 }}>
            <button
              // color='secondary'
              // variant='outlined'
              style={{ marginRight: "5px" }}
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              {"<<"}
            </button>
            <button
              style={{ marginRight: "5px" }}
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              {"<"}
            </button>
            <button
              style={{ marginRight: "5px" }}
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              {">"}
            </button>
            <button
              style={{ marginRight: "5px" }}
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              {">>"}
            </button>
          </Grid>
          <Grid size={{ xs: 6, sm: 3 }}>
            <span style={{ marginRight: "5px" }}>
              <span style={{ marginRight: "5px" }}>Page</span>
              <strong>
                {table.getState().pagination.pageIndex + 1} of{" "}
                {table.getPageCount()}
              </strong>
            </span>
          </Grid>
          <Grid size={{ xs: 6, sm: 3 }}>
            <span style={{ marginRight: "5px" }}>
              Go to:{" "}
              <input
                style={{ width: "60px" }}
                type="number"
                defaultValue={table.getState().pagination.pageIndex + 1}
                onChange={(e) => {
                  const page = e.target.value ? Number(e.target.value) - 1 : 0;
                  table.setPageIndex(page);
                }}
              />
            </span>
          </Grid>
          <Grid size={{ xs: 6, sm: 3 }}>
            <select
              style={{ marginRight: "5px" }}
              value={table.getState().pagination.pageSize}
              onChange={(e) => {
                table.setPageSize(Number(e.target.value));
              }}
            >
              {[100, 500, 2000].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  Show {pageSize}
                </option>
              ))}
            </select>
          </Grid>
          <Grid size={6}>
            <div>{table.getPrePaginationRowModel().rows.length} Rows</div>
          </Grid>
        </Grid>
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

// eslint-disable-next-line react/display-name
const Suiig = memo((props) => {
  ////////////
  const CustomTooltip2 = (prps2) => {
    const payload = prps2.payload;
    const label = prps2.label;

    if (prps2.active && payload && payload.length) {
      return (
        <>
          <div>
            <Box
              sx={{
                backgroundColor: "white",
                opacity: "0.9",
                padding: "5px 10px 5px 10px",
              }}
            >
              <Typography style={{ fontSize: "14px", color: "dimgrey" }}>
                {label} {props.ssg1.def.tlj}
              </Typography>
              <table className={classes.tiptable} style={{ fontSize: "14px" }}>
                <thead>
                  <tr>
                    <th>市区町村名</th>
                    <th>{props.graph.label}</th>
                  </tr>
                </thead>
                <tbody>
                  {payload.map((v, i) => {
                    return (
                      <React.Fragment key={"t" + i}>
                        <tr>
                          <td>
                            <Surface
                              width={10}
                              height={10} /* viewBox='0 0 10 10' */
                            >
                              <Symbols
                                cx={5}
                                cy={5}
                                type="circle"
                                size={50}
                                fill={payload[i].color}
                              />
                            </Surface>
                            {payload[i].dataKey}
                          </td>
                          <td style={{ color: payload[i].color }}>
                            {Number(payload[i].value).toLocaleString()}
                            {props.graph.unit}
                          </td>
                        </tr>
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </Box>
          </div>
        </>
      );
    }

    return null;
  };
  /////////////
  return (
    <Box>
      <Typography variant="h2" component="h2">
        {props.ssg1.def.tl1}の市区町村別の推移グラフ【{props.ssg1.def.tmn}〜
        {props.ssg1.def.tmx}年】
      </Typography>
      <Box sx={{ maxWidth: "400px" }} paddingBottom={2}>
        <Select
          defaultValue={props.graphList[1]}
          filterOption={false}
          options={props.graphList}
          onChange={(e) => {
            props.setGraph(e);
          }}
          isSearchable={false}
          id="selectbox3"
          instanceId="selectbox3"
        />
      </Box>
      <ResponsiveContainer height={400}>
        <LineChart
          width={600}
          height={400}
          data={props.chartData}
          margin={{
            top: 5,
            right: 5,
            left: -50,
            bottom: 5,
          }}
        >
          {props.dis_list1.map((v3, i3) => {
            return (
              <Line
                connectNulls
                type="monotone"
                dataKey={v3}
                stroke={palette1[i3 % 100]}
                dot={{ r: 0 }}
                key={"l" + i3}
              />
            );
          })}
          <XAxis dataKey="year" tick={{ fontSize: 12 }} />
          <YAxis
            domain={["auto", "auto"]}
            tickMargin={0}
            tick={{ fontSize: 12, dx: 43, dy: -7, width: 0 }}
            orientation="left"
            tickFormatter={(tick) => {
              if (tick >= 1000 && tick < 1000000)
                return Number(tick.toPrecision(3)) / 1000 + "K";
              else if (tick >= 1000000 && tick < 1000000000)
                return Number(tick.toPrecision(3)) / 1000000 + "M";
              else if (tick >= 1000000000)
                return Number(tick.toPrecision(3)) / 1000000000 + "B";
              else return tick;
            }}
            reversed={props.graph.rev}
          />
          <Tooltip content={CustomTooltip2} wrapperStyle={{ zIndex: 1000 }} />
          <Legend
            align="left"
            wrapperStyle={{ paddingLeft: "50px" }}
            formatter={(value, entry, index) => (
              <span className="text-color-class">{value}</span>
            )}
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
});
