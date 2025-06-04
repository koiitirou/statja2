import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  getFilteredRowModel,
  // getPaginationRowModel, // 今回は未使用のためコメントアウト
} from "@tanstack/react-table";
import {
  Fragment,
  useMemo,
  useState,
  useEffect,
  memo,
  useRef,
  useCallback, // useCallbackフックをインポート
} from "react";
import { Box, Typography } from "@mui/material";
import classes from "components/css/ndb.module.css"; // CSSモジュールのパスを確認してください
import Link from "next/link";
import { rankItem } from "@tanstack/match-sorter-utils";
import { server } from "components/data/config"; // configのパスを確認してください
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
import palette1 from "components/data/palette.json"; // paletteのパスを確認してください

/////////////////////
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

///////////////都道府県 (options1 は App コンポーネント内で useMemo を使って生成します)

const formatNumber = (number) => {
  if (typeof number !== "number" || isNaN(number)) {
    // NaNチェックも追加
    return number;
  } else if (number >= 1000000000000) {
    return (number / 1000000000000).toFixed(1) + "兆";
  } else if (number >= 100000000) {
    return (number / 100000000).toFixed(1) + "億";
  } else if (number >= 10000) {
    return (number / 10000).toFixed(1) + "万";
  } else {
    // 小数点以下の表示を調整、整数ならそのまま
    return Number.isInteger(number) ? number.toString() : number.toFixed(1);
  }
};
////////////////App ()
const App = ({ ssg1, did1, kbn1, graphList }) => {
  const [graph, setGraph] = useState(graphList[1]);
  const marks = [];

  for (let i = 0; i < ssg1.def.tml.length; i++) {
    var thisYear = {};
    thisYear["value"] = ssg1.def.tml[i];
    marks.push(thisYear);
  }

  const column1 = useMemo(() => {
    if (!ssg1?.tab?.columns || !ssg1?.def?.shd) return [];
    return ssg1.tab.columns.map((item, index) => ({
      header: item.Header,
      accessorKey: item.accessor,
      // sortingFn: (rowA, rowB, columnId) => {
      //   const valA = rowA.getValue(columnId);
      //   const valB = rowB.getValue(columnId);
      //   if (index === 1 || index === 2) {
      //     return Number(valA?.[0] ?? 0) - Number(valB?.[0] ?? 0); // null/undefined時は0として比較
      //   } else {
      //     return Number(valA ?? 0) - Number(valB ?? 0);
      //   }
      // },
      sortingFn: (rowA, rowB, columnId) => {
        if (index == 2 || index == 3) {
          return (
            Number(rowA.getValue(columnId)[0]) -
            Number(rowB.getValue(columnId)[0])
          );
        } else if (index == 0 || index == 4 || index == 5) {
          return (
            Number(rowA.getValue(columnId)) - Number(rowB.getValue(columnId))
          );
        } else {
          const valueA = String(rowA.getValue(columnId));
          const valueB = String(rowB.getValue(columnId));
          return valueA.localeCompare(valueB);
        }
      },
      cell: ({ cell }) => {
        const colValue = cell.getValue();
        if (index == 1) {
          return colValue?.[1] ? (
            <Link
              prefetch={false}
              href={`/ndb/prescription/${ssg1.def.shd}_${colValue[1]}`}
            >
              {colValue[0]}
            </Link>
          ) : (
            colValue?.[0] ?? ""
          );
        } else if (index == 2) {
          return colValue?.[0] !== undefined &&
            colValue?.[1] !== undefined &&
            colValue?.[2] !== undefined ? (
            <div className={classes.p1}>
              <div className={classes.p2}>{colValue[0].toLocaleString()}</div>
              <div className={classes.p4}>
                <div
                  className={classes.p3}
                  style={{
                    width: `${colValue[1]}%`,
                    backgroundColor: colValue[2],
                  }}
                ></div>
              </div>
            </div>
          ) : null;
        } else if (index == 3) {
          return colValue?.[1] && colValue?.[2] !== undefined ? (
            <span className={classes[colValue[1]]}>
              {colValue[2]}
              {colValue[0]}%
            </span>
          ) : null;
        } else if (index == 4) {
          return <span>{formatNumber(colValue)}</span>;
        } else if (index == 5) {
          return <span>{colValue}%</span>;
        } else {
          return colValue ?? "";
        }
      },
    }));
  }, [ssg1]);

  function IndeterminateCheckbox({
    indeterminate,
    className = "",
    checked, // checked を明示的に props から受け取る
    ...rest
  }) {
    const ref = useRef(null);
    useEffect(() => {
      if (ref.current) {
        if (typeof indeterminate === "boolean") {
          ref.current.indeterminate = !checked && indeterminate;
        }
      }
    }, [ref, indeterminate, checked]); // 依存配列を修正

    return (
      <input
        type="checkbox"
        ref={ref}
        className={className + " cursor-pointer"}
        checked={checked} // checkedをinputに渡す
        {...rest}
      />
    );
  }

  const columns = useMemo(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <IndeterminateCheckbox
            checked={table.getIsAllRowsSelected()}
            indeterminate={table.getIsSomeRowsSelected()}
            onChange={table.getToggleAllRowsSelectedHandler()}
          />
        ),
        cell: ({ row }) => (
          <div className="px-1">
            <IndeterminateCheckbox
              checked={row.getIsSelected()}
              disabled={!row.getCanSelect()}
              indeterminate={row.getIsSomeSelected()}
              onChange={row.getToggleSelectedHandler()}
            />
          </div>
        ),
      },
      ...column1,
    ],
    [column1]
  );

  const optionsForFilter = useMemo(() => {
    // 変数名を options1 から変更
    if (!ssg1?.tab?.data) return [];
    const uniqueDngValues = new Set();
    ssg1.tab.data.forEach((v) => {
      if (v.dng?.[0] !== undefined) {
        uniqueDngValues.add(v.dng[0]);
      }
    });
    return [...uniqueDngValues];
  }, [ssg1]);

  function SelectColumnFilter({
    // このコンポーネントは App の中で定義されているので、optionsForFilter を直接参照できる
    column: { filterValue, setFilter },
  }) {
    return (
      <select
        value={filterValue || ""} // filterValueがundefinedの場合、空文字を選択
        onChange={(e) => {
          setFilter(e.target.value || undefined);
        }}
      >
        <option value="">全て</option>
        {optionsForFilter.map(
          (
            optionValue,
            i // 変数名を変更
          ) => (
            <option key={i} value={optionValue}>
              {optionValue}
            </option>
          )
        )}
      </select>
    );
  }

  const [rowSelection, setRowSelection] = useState({});
  const [data, setData] = useState(() => ssg1?.tab?.data || []);
  const [value, setValue] = useState(() => ssg1?.def?.tmx);
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [integ, setInteg] = useState(null);
  const [isfetch, setIsfetch] = useState(false);

  useEffect(() => {
    setRowSelection({});
  }, [value]);

  useEffect(() => {
    if (!isfetch && did1) {
      const fetchData = async () => {
        try {
          const response1 = await fetch(
            `${server}/shohou/${did1}_gen_int.json`
          );
          if (!response1.ok) {
            throw new Error(`HTTP error! status: ${response1.status}`);
          }
          const json1 = await response1.json();
          setInteg(json1);
          setIsfetch(true);
          setRowSelection({ 0: true, 1: true, 2: true });
        } catch (error) {
          console.error("Error fetching integ.json:", error);
          // エラー発生時 isfetch を true にしない、またはエラー状態を管理
        }
      };
      fetchData();
    }
  }, [did1, isfetch]); // isfetch を依存配列に含めることで、フェッチ失敗時の再試行ロジックを組みやすくなる

  useEffect(() => {
    if (isfetch && integ?.tab?.[value]?.data) {
      setData(integ.tab[value].data);
    } else if (isfetch) {
      setData([]); // 対応データがない場合は空配列に
    }
  }, [integ, value, isfetch]);

  const handleChange = useCallback(
    (event, newValue) => {
      if (integ?.tab?.[newValue]) {
        // newValueでチェック
        setValue(newValue);
      }
    },
    [integ] // integが変更されたら関数を再生成
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter,
      rowSelection,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: fuzzyFilter,
    onGlobalFilterChange: setGlobalFilter,
    getColumnCanGlobalFilter: (col) => col.columnDef.enableGlobalFilter ?? true,
  });

  const unit1 = "";
  const title1 = `${
    ssg1.def.enm +
    "の処方数ランキング" +
    ssg1.def.tmn +
    "〜" +
    ssg1.def.tmx +
    "【" +
    ssg1.def.kbn +
    "】"
  }`;

  const description1 = "";
  const rep1 = {
    ndb: "処方薬ランキング",
  };
  rep1[ssg1.def.did] = ssg1.def.dis;

  ////for Suiig
  const [chartData, setChartData] = useState([]);
  const [did_list1, setDid] = useState([]);
  const [dis_list1, setDnm] = useState([]);
  const [unt_list1, setUnt] = useState([]);

  /////

  useEffect(() => {
    if (!data || data.length === 0 || Object.keys(rowSelection).length === 0) {
      setDid([]);
      setDnm([]);
      setUnt([]);
      return;
    }
    const newDidList = [];
    const newDnmList = [];
    const newUntList = [];
    Object.keys(rowSelection).forEach((selectedIndexStr, i) => {
      if (i > 10) return; // 上位11件
      const rowIndex = parseInt(selectedIndexStr, 10);
      const selectedRowData = data[rowIndex];
      if (selectedRowData?.dnm?.length >= 2) {
        newDidList.push(selectedRowData.dnm[1]);
        newDnmList.push(selectedRowData.dnm[0]);
        newUntList.push(selectedRowData.unt);
      }
    });
    setDid(newDidList);
    setDnm(newDnmList);
    setUnt(newUntList);
  }, [data, rowSelection]);

  const processedIntegData = useMemo(() => {
    if (!integ?.tab) return null;
    const processed = {};
    for (const yearKey in integ.tab) {
      if (
        Object.prototype.hasOwnProperty.call(integ.tab, yearKey) &&
        integ.tab[yearKey]?.data
      ) {
        const dataMap = new Map();
        integ.tab[yearKey].data.forEach((item) => {
          if (item?.dnm?.[1] !== undefined) {
            dataMap.set(item.dnm[1], item);
          }
        });
        processed[yearKey] = { dataMap };
      }
    }
    return processed;
  }, [integ]);

  useEffect(() => {
    if (
      processedIntegData &&
      Array.isArray(did_list1) &&
      did_list1.length > 0 &&
      ssg1?.def?.tml &&
      graph?.value // graphとgraph.valueの存在確認
    ) {
      const newChartData = [];
      const baseYearKey = ssg1.def.tml[ssg1.def.tml.length - 1];
      const baseYearDataMap = processedIntegData[baseYearKey]?.dataMap;

      if (!baseYearDataMap) {
        setChartData([]);
        return;
      }

      ssg1.def.tml.forEach((yearValue) => {
        const chartEntry = { year: yearValue };
        const currentYearDataMap = processedIntegData[yearValue]?.dataMap;

        if (currentYearDataMap) {
          did_list1.forEach((didValue) => {
            // didValue は did_list1 の各要素
            const th_categories = currentYearDataMap.get(didValue);
            const th_categories_base = baseYearDataMap.get(didValue);

            if (
              th_categories &&
              th_categories_base?.dnm?.[0] && // th_categories_base.dnm[0] がキーとして使われるため存在確認
              th_categories[graph.value] !== "" &&
              th_categories[graph.value] !== undefined // undefinedもチェック
            ) {
              const graphVal = th_categories[graph.value];
              chartEntry[th_categories_base.dnm[0]] = Number(
                Array.isArray(graphVal) ? graphVal[0] : graphVal
              );
            }
          });
        }
        newChartData.push(chartEntry);
      });
      setChartData(newChartData);
    } else {
      setChartData([]);
    }
  }, [did_list1, graph, processedIntegData, ssg1]);

  const showChart = isfetch && chartData;

  return (
    <Box sx={{ flex: 1, alignSelf: "flex-start", alignItems: "flex-start" }}>
      <Typography variant="h2" component="h2" id="gen">
        【一般名・成分】{ssg1.def.enm}の処方数・売上の推移グラフ【
        {kbn1[ssg1.def.kbn]}】【
        {ssg1.def.tmn}〜{ssg1.def.tmx}年】
      </Typography>
      {showChart &&
        graph &&
        graphList &&
        dis_list1 &&
        unt_list1 && ( // Suiigに渡すpropsの存在確認
          <Suiig
            ssg1={ssg1}
            graphList={graphList}
            graph={graph}
            setGraph={setGraph}
            dis_list1={dis_list1}
            chartData={chartData}
            unt_list1={unt_list1}
          />
        )}
      <Typography variant="h2" component="h2" id="gen">
        【一般名・成分】{ssg1.def.enm}の処方数ランキング{value}【
        {kbn1[ssg1.def.kbn]}】
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
      <Box className={classes.retable}>
        <div>
          <DebouncedInput
            value={globalFilter ?? ""}
            onChange={(filterValue) => setGlobalFilter(String(filterValue))}
            placeholder="検索..." // プレースホルダー変更
          />
        </div>
        <table className={classes.table1}>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    {...(header.column.getCanSort() // ソート可能な場合のみonClickを設定
                      ? { onClick: header.column.getToggleSortingHandler() }
                      : {})}
                    style={{
                      cursor: header.column.getCanSort()
                        ? "pointer"
                        : "default",
                    }}
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

export default App;

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
  }, [value, debounce, onChange]); // debounceとonChangeも依存配列に追加

  return (
    <input
      {...props}
      value={value ?? ""} // valueがundefinedの場合空文字に
      onChange={(e) => setValue(e.target.value)}
    />
  );
}
DebouncedInput.displayName = "DebouncedInput";

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
                    <th>薬剤名</th>
                    <th>{props.graph.label}</th>
                  </tr>
                </thead>
                <tbody>
                  {payload.map((v, i) => {
                    return (
                      <Fragment key={"t" + i}>
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
                          <td
                          // style={{ color: payload[i].color }}
                          >
                            {Number(payload[i].value).toLocaleString()}
                            {props.graph.unit}
                          </td>
                        </tr>
                      </Fragment>
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
                dot={{ r: 1.5, fill: palette1[i3 % 100] }}
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
