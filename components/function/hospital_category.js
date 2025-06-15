import { Box, Typography } from "@mui/material";
import classes from "components/css/retableh.module.css";
import Link from "next/link"; // Linkコンポーネントをインポート
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  getFilteredRowModel,
  createColumnHelper,
} from "@tanstack/react-table";
import { useMemo, useState, useEffect, memo, useRef, useCallback } from "react";
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
import palette1 from "components/data/palette.json";
import { rankItem } from "@tanstack/match-sorter-utils";

import dynamic from "next/dynamic";
const Select = dynamic(
  () => import("react-select").then((mod) => mod.default),
  {
    ssr: false,
    loading: () => null,
  }
);

const columnHelper = createColumnHelper();

const fuzzyFilter = (row, columnId, value, addMeta) => {
  const itemRank = Array.isArray(row.getValue(columnId))
    ? rankItem(row.getValue(columnId).join(" "), value)
    : rankItem(row.getValue(columnId), value);
  addMeta({ itemRank });
  return itemRank.passed;
};

// Helper Components
const IndeterminateCheckbox = ({
  indeterminate,
  className = "",
  checked,
  ...rest
}) => {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current) {
      if (typeof indeterminate === "boolean") {
        ref.current.indeterminate = !checked && indeterminate;
      }
    }
  }, [ref, indeterminate, checked]);

  return (
    <input
      type="checkbox"
      ref={ref}
      className={`${className} cursor-pointer`}
      checked={checked}
      {...rest}
    />
  );
};
IndeterminateCheckbox.displayName = "IndeterminateCheckbox";

const DebouncedInput = ({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}) => {
  const [value, setValue] = useState(initialValue);
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);
  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);
    return () => clearTimeout(timeout);
  }, [value, debounce, onChange]);
  return (
    <input
      {...props}
      value={value ?? ""}
      onChange={(e) => setValue(e.target.value)}
    />
  );
};
DebouncedInput.displayName = "DebouncedInput";

/**
 * Main Component
 */
const App = ({ staticData, hospital1, isLoaded, timeSeriesData }) => {
  const columns = useMemo(() => {
    return [
      columnHelper.group({
        id: "select-group",
        header: () => null,
        columns: [
          {
            id: "select",
            enableSorting: false, // チェックボックスはソート不可
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
        ],
      }),
      columnHelper.group({
        id: "nic-group",
        header: () => null,
        columns: [
          // 【修正】Stringとしてソート
          columnHelper.accessor("nic", {
            header: () => "診断分類",
            sortingFn: "alphanumeric",
          }),
        ],
      }),
      columnHelper.group({
        id: "di2-group",
        header: () => null,
        columns: [
          // 【修正】配列の最初の要素（String）でソート
          columnHelper.accessor("di2", {
            header: () => "病気名",
            cell: (info) => {
              const [diseaseName, diseaseId] = info.getValue();
              return <Link href={`/dpc/${diseaseId}`}>{diseaseName}</Link>;
            },
            sortingFn: (rowA, rowB, columnId) => {
              const a = rowA.getValue(columnId)[0];
              const b = rowB.getValue(columnId)[0];
              return a.localeCompare(b);
            },
          }),
        ],
      }),
      columnHelper.group({
        header: "順位",
        columns: [
          // 【修正】Numberとしてソート
          columnHelper.accessor("prk", {
            header: () => staticData.def.short_name,
            sortingFn: "alphanumeric",
          }),
          columnHelper.accessor("ark", {
            header: () => "全国",
            sortingFn: "alphanumeric",
          }),
        ],
      }),
      columnHelper.group({
        header: "治療実績(件数)",
        columns: [
          // 【修正】Numberとしてソート
          columnHelper.accessor("kll", {
            header: () => "合計",
            sortingFn: "alphanumeric",
          }),
          columnHelper.accessor("kes", {
            header: () => "手術あり",
            sortingFn: "alphanumeric",
          }),
          columnHelper.accessor("kon", {
            header: () => "手術なし",
            sortingFn: "alphanumeric",
          }),
        ],
      }),
      columnHelper.group({
        header: "在院日数(日)",
        columns: [
          // 【修正】Numberとしてソート
          columnHelper.accessor("zll", {
            header: () => "合計",
            sortingFn: "alphanumeric",
          }),
          columnHelper.accessor("zes", {
            header: () => "手術あり",
            sortingFn: "alphanumeric",
          }),
          columnHelper.accessor("zon", {
            header: () => "手術なし",
            sortingFn: "alphanumeric",
          }),
        ],
      }),
    ];
  }, [staticData.def.short_name]);

  const graphList = useMemo(
    () => [
      {
        value: "prk",
        label: `順位(${staticData.def.short_name})`,
        unit: "位",
        rev: true,
      },
      { value: "ark", label: "順位(全国)", unit: "位", rev: true },
      { value: "kll", label: "治療実績(合計)", unit: "件", rev: false },
      { value: "kes", label: "治療実績(手術あり)", unit: "件", rev: false },
      { value: "kon", label: "治療実績(手術なし)", unit: "件", rev: false },
      { value: "zll", label: "在院日数(合計)", unit: "日", rev: false },
      { value: "zes", label: "在院日数(手術あり)", unit: "日", rev: false },
      { value: "zon", label: "在院日数(手術なし)", unit: "日", rev: false },
    ],
    [staticData.def.short_name]
  );

  const yearLatest =
    staticData.def.time_category[staticData.def.time_category.length - 1];
  const yearList = useMemo(
    () =>
      staticData.def.time_category.map((year) => ({
        value: year,
        label: year,
      })),
    [staticData.def.time_category]
  );

  // State
  const [graph, setGraph] = useState(graphList[2]);
  const [year, setYear] = useState(yearLatest);
  const [data, setData] = useState(staticData.category[yearLatest].categories);
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const [rowSelection, setRowSelection] = useState(() => {
    const initialData = staticData.category[yearLatest].categories;
    const initialSelection = {};
    initialData.slice(0, 3).forEach((row) => {
      if (row.did) {
        initialSelection[row.did] = true;
      }
    });
    return initialSelection;
  });

  const [chartData, setChartData] = useState([]);
  const [selectedDiseaseIds, setSelectedDiseaseIds] = useState([]);
  const [selectedDiseaseNames, setSelectedDiseaseNames] = useState([]);

  useEffect(() => {
    const newDataSource =
      isLoaded && timeSeriesData ? timeSeriesData : staticData;
    setData(newDataSource.category[year].categories);
  }, [timeSeriesData, isLoaded, year, staticData]);

  const table = useReactTable({
    data,
    columns,
    getRowId: (row) => row.did,
    state: { sorting, globalFilter, rowSelection },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: fuzzyFilter,
    onGlobalFilterChange: setGlobalFilter,
  });

  useEffect(() => {
    const selectedRows = table.getSelectedRowModel().flatRows;
    const newDidList = [];
    const newDnmList = [];
    selectedRows.forEach((row, i) => {
      if (i > 10) return;
      const originalData = row.original;
      if (originalData?.di2?.length >= 2) {
        newDidList.push(originalData.di2[1]);
        newDnmList.push(originalData.di2[0]);
      }
    });
    setSelectedDiseaseIds(newDidList);
    setSelectedDiseaseNames(newDnmList);
  }, [rowSelection, table]);

  useEffect(() => {
    if (
      !timeSeriesData ||
      !selectedDiseaseIds ||
      selectedDiseaseIds.length === 0
    ) {
      setChartData([]);
      return;
    }
    const newChartData = Object.entries(timeSeriesData.category).map(
      ([year, categoryData]) => {
        const categoryMap = new Map(
          categoryData.categories.map((cat) => [cat.did, cat])
        );
        const chartEntry = { year };
        selectedDiseaseIds.forEach((did) => {
          const diseaseInfo = categoryMap.get(did);
          if (
            diseaseInfo &&
            diseaseInfo[graph.value] != null &&
            diseaseInfo[graph.value] !== ""
          ) {
            chartEntry[diseaseInfo.dis] = Number(diseaseInfo[graph.value]);
          }
        });
        return chartEntry;
      }
    );
    setChartData(newChartData);
  }, [timeSeriesData, graph, selectedDiseaseIds]);

  const handleYearChange = useCallback((e) => setYear(e.value), []);
  const handleGlobalFilterChange = useCallback(
    (value) => setGlobalFilter(String(value)),
    []
  );

  return (
    <Box className={classes.retable}>
      <TrendsChart
        staticData={staticData}
        graphList={graphList}
        graph={graph}
        setGraph={setGraph}
        selectedDiseaseNames={selectedDiseaseNames}
        chartData={chartData}
      />
      <Typography variant="h2">
        {staticData.def.hospital}の症例数ランキング・手術件数・在院日数 {year}
      </Typography>
      <Box sx={{ maxWidth: "400px" }}>
        {isLoaded && (
          <Select
            placeholder={"年度を選択する"}
            options={yearList}
            onChange={handleYearChange}
            isSearchable={false}
            defaultValue={yearList.find((y) => y.value === year)}
            id="year-select"
            instanceId="year-select"
          />
        )}
      </Box>
      <Box
        sx={{ overflowX: "auto" }}
        className={`${classes.hospital1} ${classes.table4}`}
      >
        <div>
          <DebouncedInput
            value={globalFilter ?? ""}
            onChange={handleGlobalFilterChange}
            placeholder="病気名などで検索..."
          />
        </div>
        <table className={classes.table3}>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    style={{
                      cursor: header.column.getCanSort()
                        ? "pointer"
                        : "default",
                    }}
                    colSpan={header.colSpan}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    {{ asc: " ▲", desc: " ▼" }[header.column.getIsSorted()] ??
                      null}
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
    </Box>
  );
};
export default App;

/**
 * Chart Component
 */
const TrendsChart = memo(
  ({
    staticData,
    graphList,
    graph,
    setGraph,
    selectedDiseaseNames,
    chartData,
  }) => {
    const handleGraphChange = useCallback((e) => setGraph(e), [setGraph]);
    const CustomTooltip = useCallback(
      ({ active, payload, label }) => {
        if (active && payload && payload.length) {
          return (
            <Box
              sx={{
                backgroundColor: "white",
                opacity: 0.9,
                padding: "5px 10px",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            >
              <Typography
                style={{
                  fontSize: "14px",
                  color: "dimgrey",
                  marginBottom: "5px",
                }}
              >
                {label} {staticData.def.hospital}
              </Typography>
              <table className={classes.tiptable} style={{ fontSize: "14px" }}>
                <thead>
                  <tr>
                    <th>病気名</th>
                    <th>{graph.label}</th>
                  </tr>
                </thead>
                <tbody>
                  {payload.map((p, i) => (
                    <tr key={`tip-${i}`}>
                      <td style={{ padding: "2px 4px" }}>
                        <Surface
                          width={10}
                          height={10}
                          style={{
                            display: "inline-block",
                            marginRight: "4px",
                            verticalAlign: "middle",
                          }}
                        >
                          <Symbols
                            cx={5}
                            cy={5}
                            type="circle"
                            size={50}
                            fill={p.color}
                          />
                        </Surface>
                        {p.dataKey}
                      </td>
                      <td
                        style={{
                          color: p.color,
                          padding: "2px 4px",
                          textAlign: "right",
                          fontWeight: "bold",
                        }}
                      >
                        {p.value}
                        {graph.unit}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Box>
          );
        }
        return null;
      },
      [staticData.def.hospital, graph.label, graph.unit]
    );
    CustomTooltip.displayName = "CustomTooltip";

    const hasDataToShow =
      chartData.length > 0 && selectedDiseaseNames.length > 0;

    return (
      <Box>
        <Typography variant="h2" component="h2">
          {staticData.def.hospital}
          の症例数ランキング・手術件数・在院日数の推移グラフ
        </Typography>
        <Box sx={{ maxWidth: "400px" }} paddingBottom={2}>
          <Select
            defaultValue={graph}
            options={graphList}
            onChange={handleGraphChange}
            isSearchable={false}
            id="graph-select"
            instanceId="graph-select"
          />
        </Box>
        <Box sx={{ height: 400, position: "relative" }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 15, left: 5, bottom: 5 }}
            >
              {hasDataToShow &&
                selectedDiseaseNames.map((diseaseName, index) => (
                  <Line
                    key={`line-${diseaseName}`}
                    connectNulls
                    type="monotone"
                    dataKey={diseaseName}
                    stroke={palette1[index % palette1.length]}
                    dot={{ r: 2 }}
                    strokeWidth={2}
                  />
                ))}
              <XAxis dataKey="year" tick={{ fontSize: 12 }} />
              <YAxis
                tickMargin={5}
                tick={{ fontSize: 12 }}
                tickFormatter={(tick) => {
                  if (tick >= 1_000_000_000) return `${tick / 1_000_000_000}B`;
                  if (tick >= 1_000_000) return `${tick / 1_000_000}M`;
                  if (tick >= 1_000) return `${tick / 1_000}K`;
                  return tick;
                }}
                reversed={graph.rev}
              />
              <Tooltip
                content={<CustomTooltip />}
                wrapperStyle={{ zIndex: 1000 }}
              />
              <Legend
                align="center"
                verticalAlign="bottom"
                wrapperStyle={{ paddingTop: "20px" }}
              />
            </LineChart>
          </ResponsiveContainer>

          {!hasDataToShow && (
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "rgba(248, 249, 250, 0.7)",
                color: "grey.700",
                textAlign: "center",
                borderRadius: "4px",
                padding: 2,
              }}
            >
              <Typography>
                下の表から比較したい病気を
                <br />
                チェックボックスで選択してください。
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    );
  }
);
TrendsChart.displayName = "TrendsChart";
