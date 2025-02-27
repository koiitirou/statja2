// import { components, createFilter } from "react-windowed-select";
import dynamic from "next/dynamic";
const WindowedSelect = dynamic(() => import("react-windowed-select"), {
  ssr: false,
});
import React, { useState, useEffect, memo } from "react";
import { useRouter } from "next/navigation";
import SearchIcon from "@mui/icons-material/Search";
import { Typography, Box } from "@mui/material";
import Grid from "@mui/material/Grid2";
import rsearch from "components/css/rsearch.module.css";
import Link from "next/link";
import pr2_path from "components/pr2_path/pr2_path.json";
import yasai_path from "components/pr2_path/yasai_path.json";

const App = () => {
  var options = [];

  pr2_path.path.map((s, i) => {
    var child1 = {};
    child1["value"] = s.params.id;
    child1["label"] = s.params.nm;
    child1["c"] = s.params.c1;
    child1["l"] = "category";
    options.push(child1);
  });
  yasai_path.path.map((s, i) => {
    var child1 = {};
    child1["value"] = s.params.yasai;
    child1["label"] = s.params.nm;
    child1["c"] = s.params.c1;
    child1["l"] = "vegetable";
    options.push(child1);
  });

  const router = useRouter();
  const [input, setInput] = useState("");
  const [inputSave, setSave] = useState("");
  const [query0, setQuery0] = useState();
  return (
    <>
      <Box
        border="solid 1px lightgrey"
        p={1}
        borderRadius={2}
        sx={{ backgroundColor: "#f2f2f2" }}
        marginTop="10px"
        marginBottom="15px"
      >
        <Typography variant="h1" component="h2">
          都道府県ランキングを調べる
        </Typography>
        <Typography variant="caption" paddingLeft="10px">
          ランキングの項目を検索する
        </Typography>
        <Grid container rowspacing={1} columnSpacing={1}>
          <Grid size={10}>
            <WindowedSelect
              className={rsearch.select1}
              placeholder={
                inputSave ? (
                  <span style={{ color: "rgba(0, 0, 0, 0.87)" }}>
                    {inputSave}
                  </span>
                ) : (
                  "人口..."
                )
              }
              value={inputSave}
              inputValue={input}
              onInputChange={setInput}
              onChange={(e) => {
                router.push(`/prefecture/${e.l}/${e.value}`);
              }}
              onMenuClose={() => setSave(input)}
              options={options}
              id="selectbox"
              instanceId="selectbox"
            />
          </Grid>
          <Grid size={2}>
            <SearchIcon
              sx={{
                borderRadius: "4px",
                padding: "3px",
                fontSize: "34px",
                height: "38px",
                width: "38px",
                background: "#2196f3",
                color: "#fff",
                verticalAlign: "text-bottom",
              }}
              onClick={() => {
                setQuery0(inputSave);
              }}
            ></SearchIcon>
          </Grid>
        </Grid>
        <Result1 query0={query0} options={options} />
      </Box>
    </>
  );
};
export default App;

const Result1 = memo(function Foo(props) {
  const query0 = props.query0;
  const options = props.options;
  const [res0, setRes0] = useState(options);

  useEffect(() => {
    setRes0(options.filter((s) => s.label.includes(query0)));
  }, [query0]);

  const Highlighted = ({ text = "", highlight = "" }) => {
    if (!highlight.trim()) {
      return <span>{text}</span>;
    }
    const regex = new RegExp(`(${highlight})`, "gi");
    const parts = text.split(regex);
    return (
      <span>
        {parts
          .filter((part) => part)
          .map((part, i) =>
            regex.test(part) ? (
              <mark key={i}>{part}</mark>
            ) : (
              <span key={i}>{part}</span>
            )
          )}
      </span>
    );
  };
  return (
    <>
      {query0 && (
        <Box>
          <Typography>
            <mark>{res0.length}件</mark>見つかりました
          </Typography>
          {res0.map((s, i1) => (
            <React.Fragment key={"s" + i1}>
              <Typography variant="body2" paddingTop={0.5}>
                ・
                <Link prefetch={false} href={`/prefecture/${s.l}/${s.value}`}>
                  <Highlighted text={s.label} highlight={query0} />
                </Link>
              </Typography>
            </React.Fragment>
          ))}
        </Box>
      )}
    </>
  );
});
