import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  getFilteredRowModel,
  // getPaginationRowModel, // 今回は未使用のためコメントアウト
} from "@tanstack/react-table";
import {
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
const App = ({ ssg1, did1, ssg2, kbn1, graphList }) => {
  const [graph, setGraph] = useState(
    // graphListの初期値と存在確認
    () =>
      graphList && graphList.length > 1
        ? graphList[1]
        : graphList && graphList.length > 0
        ? graphList[0]
        : undefined
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

  console.log(optionsForFilter);

  // (Appコンポーネントの外、またはAppコンポーネント内で定義)
  function DropdownColumnFilter({ column, options }) {
    const filterValue = column.getFilterValue() || ""; // 現在のフィルター値を取得 (未設定なら空文字)

    const handleFilterChange = (e) => {
      // 選択された値をフィルター値として設定。空文字（"全て"）の場合は undefined を設定してフィルターを解除
      column.setFilterValue(e.target.value === "" ? undefined : e.target.value);
    };

    // ヘッダーのソートイベントが誤って発動しないように、クリックイベントの伝播を停止
    const stopPropagation = (e) => e.stopPropagation();

    return (
      <div style={{ marginTop: "5px" }} onClick={stopPropagation}>
        <select
          value={filterValue}
          onChange={handleFilterChange}
          style={{
            width: "100%",
            fontSize: "12px",
            padding: "4px",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        >
          <option value="">全て</option> {/* "全て" を選択するオプション */}
          {options.map((option, i) => (
            <option key={i} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
    );
  }
  DropdownColumnFilter.displayName = "DropdownColumnFilter";

  // ドロップダウン用のフィルター関数 (完全一致)
  const dropdownFilterFn = (row, columnId, filterValue) => {
    // filterValueがundefined (つまり "全て" が選択されている)場合は、行を通過させる
    if (filterValue === undefined) {
      return true;
    }
    // 行の該当列の値を取得 (index == 7 のデータは [表示名, ID] の形式を想定)
    const rowValue = row.getValue(columnId)?.[0]; // 表示名を取得

    // フィルター値と行の値を文字列として比較
    return String(rowValue) === String(filterValue);
  };

  const marks = useMemo(() => {
    if (!ssg1?.def?.tml) return []; // ssg1と関連プロパティの存在確認
    return ssg1.def.tml.map((yearValue) => ({ value: yearValue }));
  }, [ssg1]);

  const column1 = useMemo(() => {
    if (!ssg1?.tab?.columns || !ssg1?.def?.shd) return [];
    return ssg1.tab.columns.map((item, index) => {
      let columnDefinition = {
        // ★ let に変更して後からプロパティを追加できるようにする
        accessorKey: item.accessor,
        // ★ 既存の sortingFn, cell の定義はここに統合、または共通化して別途設定
        // sortingFn: (rowA, rowB, columnId) => { /* ... */ },
        // cell: ({ cell }) => { /* ... */ },
        // ↓↓↓ 既存のソートとセル定義をここにコピー＆ペーストしてください ↓↓↓
        sortingFn: (rowA, rowB, columnId) => {
          if (index == 2 || index == 3) {
            return (
              Number(rowA.getValue(columnId)?.[0] ?? 0) -
              Number(rowB.getValue(columnId)?.[0] ?? 0)
            );
          } else if (index == 0 || index == 4 || index == 5) {
            return (
              Number(rowA.getValue(columnId) ?? 0) -
              Number(rowB.getValue(columnId) ?? 0)
            );
          } else if (index == 7) {
            const valA = rowA.getValue(columnId)?.[0];
            const valB = rowB.getValue(columnId)?.[0];
            const strValA = String(valA ?? "");
            const strValB = String(valB ?? "");
            return strValA.localeCompare(strValB, "ja-JP");
          } else {
            const valueA = String(rowA.getValue(columnId) ?? "");
            const valueB = String(rowB.getValue(columnId) ?? "");
            return valueA.localeCompare(valueB, "ja-JP");
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
                <div className={classes.p2}>{formatNumber(colValue[0])}</div>{" "}
                {/* toLocaleString -> formatNumber */}
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
          } else if (index == 5) {
            return <span>{formatNumber(colValue)}</span>;
          } else if (index == 7) {
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
          } else {
            return colValue ?? "";
          }
        },
        // ↑↑↑ 既存のソートとセル定義をここにコピー＆ペーストしてください ↑↑↑
      };

      // index == 7 の列にドロップダウンフィルターを適用
      if (index == 7) {
        columnDefinition.header = (
          { column } // ヘッダーのレンダリング関数
        ) => (
          <div>
            {item.Header} {/* 元の列ヘッダーのテキスト */}
            {column.getCanFilter() ? ( // この列がフィルター可能である場合にUIを表示
              <DropdownColumnFilter
                column={column}
                options={optionsForFilter}
              />
            ) : null}
          </div>
        );
        columnDefinition.filterFn = dropdownFilterFn; // ステップ2で定義したフィルター関数を指定
        // columnDefinition.enableColumnFilter = true; // 列フィルターを明示的に有効化 (多くの場合デフォルトで有効)
      } else {
        // 他の列のヘッダーは元のまま (もし他の列にもフィルターを付けたい場合は同様に設定)
        columnDefinition.header = item.Header;
      }

      return columnDefinition;
    });
  }, [ssg1, optionsForFilter]);

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
  // function SelectColumnFilter({
  //   // このコンポーネントは App の中で定義されているので、optionsForFilter を直接参照できる
  //   column: { filterValue, setFilter },
  // }) {
  //   return (
  //     <select
  //       value={filterValue || ""} // filterValueがundefinedの場合、空文字を選択
  //       onChange={(e) => {
  //         setFilter(e.target.value || undefined);
  //       }}
  //     >
  //       <option value="">全て</option>
  //       {optionsForFilter.map(
  //         (
  //           optionValue,
  //           i // 変数名を変更
  //         ) => (
  //           <option key={i} value={optionValue}>
  //             {optionValue}
  //           </option>
  //         )
  //       )}
  //     </select>
  //   );
  // }

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
            `${server}/shohou/${did1}_ind_int.json`
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

  const title1 = useMemo(
    () =>
      ssg1?.def && kbn1
        ? `${ssg1.def.enm}の処方薬ランキング${ssg1.def.tmn}〜${
            ssg1.def.tmx
          }【売上・処方数・薬価】 【${kbn1[ssg1.def.kbn]}】`
        : "",
    [ssg1, kbn1]
  );

  const description0 = useMemo(
    () =>
      ssg1?.def && kbn1
        ? `${ssg1.def.enm}の治療薬（${
            kbn1[ssg1.def.kbn]
          }）ランキング一覧です。くすりの処方数・売上・前年比の推移を比較。`
        : "",
    [ssg1, kbn1]
  );

  const description1 = useMemo(() => {
    if (!ssg1?.def?.ran) return "";
    let desc = "";
    ssg1.def.ran.forEach((v, i) => {
      desc += `${ssg1.def.rnk[i]}位は${ssg1.def.rre[i]}で${ssg1.def.ral[
        i
      ].toLocaleString()}`;
      if (i !== ssg1.def.ran.length - 1) {
        desc += "、";
      }
    });
    return `${desc}でした。`;
  }, [ssg1]);

  const description2 = useMemo(() => {
    if (!ssg2?.def?.ran || !kbn1 || !ssg1?.def) return "";
    let desc = `${ssg2.def.tmx}年の${ssg2.def.enm}（${
      kbn1[ssg1.def.kbn]
    }）の処方数`;
    ssg2.def.ran.forEach((v, i) => {
      desc += `${ssg2.def.rnk[i]}位は${ssg2.def.rre[i]}で${ssg2.def.ral[
        i
      ].toLocaleString()}`;
      if (i !== ssg2.def.ran.length - 1) {
        desc += "、";
      }
    });
    return `${desc}でした。`;
  }, [ssg1, ssg2, kbn1]);

  const [chartData, setChartData] = useState([]);
  const [did_list1, setDid] = useState([]);
  const [dis_list1, setDnm] = useState([]);
  const [unt_list1, setUnt] = useState([]);

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
    <Box>
      <Typography variant="h1" component="h1">
        {title1}
      </Typography>
      <Typography variant="body1">
        {"　"}
        {ssg1?.def?.tmn ?? ""}〜{ssg1?.def?.tmx ?? ""}年の
        {ssg1?.def?.enm ?? ""}
        の処方薬ランキング順位表です。くすりの売上、処方数、薬価の年度推移を比較できます。
        <a href="#ind">商品名</a>、<a href="#gen">一般名</a>
        （成分）別のデータがあります。
      </Typography>
      <Typography variant="body1">
        {"　"}
        <a href="#ind">商品名</a>
        別では、{description1}
      </Typography>
      <Typography variant="body1">
        {"　"}
        <a href="#gen">一般名</a>
        別では、{description2}
      </Typography>
      <Typography variant="body1">
        {"　"}売上は処方数×薬価で計算しています。
      </Typography>
      <Typography variant="h2" component="h2" id="ind">
        【商品名】{ssg1?.def?.enm ?? ""}の処方数・売上の推移グラフ【
        {kbn1 && ssg1?.def ? kbn1[ssg1.def.kbn] ?? "" : ""}
        】【{ssg1?.def?.tmn ?? ""}〜{ssg1?.def?.tmx ?? ""}年】
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
      <Typography variant="h2" component="h2">
        【商品名】{ssg1?.def?.enm ?? ""}の処方数・売上ランキング {value ?? ""}{" "}
        【{kbn1 && ssg1?.def ? kbn1[ssg1.def.kbn] ?? "" : ""}】
      </Typography>
      {ssg1?.def &&
        marks &&
        value !== undefined && ( // Slider関連のpropsの存在確認
          <Box padding="10px 50px" maxWidth="600px">
            <Typography
              display="inline"
              gutterBottom
              sx={{ paddingRight: "0px" }}
            >
              表示年度: <span style={{ fontWeight: "bold" }}>{value}</span>年　
            </Typography>
            <Chip
              label="－"
              size="small"
              variant="outlined"
              disabled={marks.findIndex((m) => m.value === value) === 0}
              onClick={() => {
                const currentIndex = marks.findIndex(
                  (ss) => ss.value === value
                );
                if (currentIndex > 0) {
                  setValue(marks[currentIndex - 1].value);
                }
              }}
            />{" "}
            <Chip
              label="＋"
              size="small"
              variant="outlined"
              disabled={
                marks.findIndex((m) => m.value === value) === marks.length - 1
              }
              onClick={() => {
                const currentIndex = marks.findIndex(
                  (ss) => ss.value === value
                );
                if (currentIndex < marks.length - 1) {
                  setValue(marks[currentIndex + 1].value);
                }
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
        )}
      {table && ( // tableオブジェクトの存在確認
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
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </Box>
      )}
    </Box>
  );
};
App.displayName = "App"; // デバッグ用にdisplayNameを設定

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

//eslint-disable-next-line react/display-name
const Suiig = memo((props) => {
  if (
    !props.chartData ||
    !props.dis_list1 ||
    !props.graphList ||
    !props.graph ||
    !props.ssg1 ||
    !props.unt_list1
  ) {
    // 必要なpropsが揃っていない場合は何も表示しないか、ローディング表示
    return <Typography>チャートデータを準備中です...</Typography>;
  }

  const CustomTooltip2 = ({ active, payload, label }) => {
    // props名を修正
    if (active && payload && payload.length) {
      return (
        <Box
          sx={{
            backgroundColor: "white",
            opacity: "0.9",
            padding: "5px 10px", // paddingを修正
            border: "1px solid #ccc", // ボーダー追加
            boxShadow: "2px 2px 5px rgba(0,0,0,0.1)", // シャドウ追加
          }}
        >
          <Typography
            style={{ fontSize: "14px", color: "dimgrey", marginBottom: "5px" }}
          >
            {label} {props.ssg1.def.tlj}
          </Typography>
          <table
            className={classes.tiptable}
            style={{ fontSize: "14px", width: "100%" }}
          >
            <thead>
              <tr>
                <th style={{ textAlign: "left" }}>薬剤名</th>
                <th style={{ textAlign: "right" }}>{props.graph.label}</th>
                {props.graph.value === "sum" && (
                  <th style={{ textAlign: "right" }}>単位</th>
                )}
              </tr>
            </thead>
            <tbody>
              {payload.map(
                (
                  pld,
                  i // 変数名をpldに変更
                ) => (
                  <tr key={`tooltip-item-${i}`}>
                    <td style={{ display: "flex", alignItems: "center" }}>
                      <Surface
                        width={10}
                        height={10}
                        style={{ marginRight: "5px" }}
                      >
                        <Symbols
                          cx={5}
                          cy={5}
                          type="circle"
                          size={50}
                          fill={pld.color}
                        />
                      </Surface>
                      {pld.dataKey}
                    </td>
                    <td style={{ textAlign: "right" }}>
                      {Number(pld.value).toLocaleString()}
                      {props.graph.value !== "sum" && props.graph.unit}
                    </td>
                    {props.graph.value === "sum" && (
                      // payload[i].unit ではなく pld.unit (Lineコンポーネントのunit propから渡ってくる)
                      // ただし、Lineコンポーネントのunit propは各Lineに設定されるので、payloadのunitは通常そのLineのunit
                      // ここでは、props.unt_list1から対応するunitを探す必要があるかもしれないが、
                      // LineコンポーネントのdataKeyとdis_list1のインデックスが一致すると仮定する
                      // もしくは、CustomTooltipに渡るpayloadの各要素にunitが含まれるようにする
                      <td style={{ textAlign: "right" }}>
                        {pld.payload[pld.dataKey + "_unit"] ||
                          props.unt_list1[
                            props.dis_list1.indexOf(pld.dataKey)
                          ] ||
                          ""}
                      </td>
                    )}
                  </tr>
                )
              )}
            </tbody>
          </table>
        </Box>
      );
    }
    return null;
  };

  return (
    <Box>
      <Box sx={{ maxWidth: "400px" }} paddingBottom={2}>
        <Select
          defaultValue={props.graphList[1] || props.graphList[0]} // デフォルト値のフォールバック
          options={props.graphList}
          onChange={props.setGraph} // props.setGraphを直接渡す
          isSearchable={false}
          id="selectbox3"
          instanceId="selectbox3" // instanceIdは一意性を保つために重要
        />
      </Box>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={props.chartData}
          margin={{
            top: 5,
            right: 20, // 右マージン調整
            left: 20, // 左マージン調整
            bottom: 5,
          }}
        >
          {props.dis_list1.map(
            (
              dataKeyName,
              i3 // 変数名をdataKeyNameに変更
            ) => (
              <Line
                key={`line-${dataKeyName}-${i3}`} // より一意なキー
                connectNulls
                type="monotone"
                dataKey={dataKeyName}
                stroke={palette1[i3 % palette1.length]} // palette1の長さを考慮
                dot={{ r: 1.5, fill: palette1[i3 % palette1.length] }}
                // unitをpayloadに含めるための工夫 (rechartsの標準機能ではない)
                // ここでunitを渡しても直接Tooltipのpayloadには入らないので、Tooltip側で工夫するか、
                // chartData自体にunit情報を含める必要がある。
                // 今回は CustomTooltip2 側で unt_list1 から取得する試みを入れた。
                // payload[dataKeyName + '_unit']: props.unt_list1[i3] のようにchartDataを加工するのが理想
              />
            )
          )}
          <XAxis dataKey="year" tick={{ fontSize: 12 }} />
          <YAxis
            tickMargin={5} // tickと軸の間のマージン
            tick={{ fontSize: 12 }}
            // orientation="left" // デフォルトでleftなので省略可
            tickFormatter={(tick) => {
              if (isNaN(tick)) return tick; // NaNならそのまま
              if (tick >= 1000000000)
                return `${(tick / 1000000000).toPrecision(3)}B`;
              if (tick >= 1000000) return `${(tick / 1000000).toPrecision(3)}M`;
              if (tick >= 1000) return `${(tick / 1000).toPrecision(3)}K`;
              return tick;
            }}
            domain={["auto", "auto"]} // domainは通常自動で良い
            reversed={props.graph.rev}
          />
          <Tooltip
            content={<CustomTooltip2 />}
            wrapperStyle={{ zIndex: 1000 }}
          />
          <Legend
            align="left" // または "center"
            verticalAlign="bottom" // 凡例の位置
            wrapperStyle={{ paddingLeft: "60px", paddingTop: "10px" }} // wrapperStyleを調整
            formatter={(value) => (
              <span style={{ color: "#555" }}>{value}</span>
            )} // 色などを調整
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
});
Suiig.displayName = "Suiig"; // デバッグ用にdisplayNameを設定

// Appコンポーネントの内部または外部に定義
function ColumnFilter({ column }) {
  const columnFilterValue = column.getFilterValue();

  return (
    <input
      type="text"
      value={columnFilterValue ?? ""} // 現在のフィルター値、未定義なら空文字
      onChange={(e) => column.setFilterValue(e.target.value)} //入力値でフィルターを更新
      onClick={(e) => e.stopPropagation()} // ヘッダーのソートイベントを抑制
      placeholder={`検索...`}
      style={{
        // 簡単なスタイル例
        width: "80%",
        marginTop: "8px",
        padding: "4px",
        fontSize: "12px",
        border: "1px solid #ccc",
        borderRadius: "4px",
      }}
    />
  );
}
