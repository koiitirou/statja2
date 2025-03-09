import { components, createFilter } from "react-windowed-select";
import React, { useState, useEffect, memo, Fragment } from "react";
import dynamic from "next/dynamic";
const WindowedSelect = dynamic(() => import("react-windowed-select"), {
  ssr: false,
});
import array3 from "components/data/path_ndb/sum_prescription_path.json";
import { useRouter } from "next/navigation";
import SearchIcon from "@mui/icons-material/Search";
import { Typography, Box } from "@mui/material";
import Grid from "@mui/material/Grid2";
import rsearch from "components/css/rsearch.module.css";
import Link from "next/link";

var options = [];
const array4 = array3.path;
array4.map((s) => {
  var child1 = {};
  child1["value"] = s.params.id2;
  if (s.params.ei2 == "gen") {
    child1["label"] = "【一般名】" + s.params.dn2;
  } else {
    child1["label"] = s.params.dn2;
  }
  child1["eid"] = s.params.eid;
  options.push(child1);
});

var option2 = [];
const epath = array3.epath;
epath.map((s) => {
  var child1 = {};
  child1["value"] = s.params.eid;
  child1["label"] = s.params.enm;
  option2.push(child1);
});

const App = () => {
  const router = useRouter();
  const [input, setInput] = useState("");
  const [inputSave, setSave] = useState("");
  const [query0, setQuery0] = useState();
  //const [op1, setOp1] = useState(options1);
  //const [op3, setOp3] = useState([]);

  // useEffect(() => {
  //   setSave(router.query.i);
  //   setQuery0(router.query.i);
  // }, [router.query.i]);

  const [inpu2, setInpu2] = useState("");
  const [inputSav2, setSav2] = useState("");
  const [query2, setQuery2] = useState();

  // useEffect(() => {
  //   setSav2(router.query.i2);
  //   setQuery2(router.query.i2);
  // }, [router.query.i2]);
  // const title_list = {
  //   yak: "薬効分類",
  //   kkn: "効能・作用機序",
  //   ksk: "疾患・病気",
  // };
  // const kbn_list = { nai: "内服", gai: "外用", tyu: "注射" };
  // const kbn_length = ["yak", "kkn", "ksk"].map((v, i) => {
  //   const epath_child1 = epath.filter((vv, ii) => vv.params.cl2 == v);
  //   return epath_child1.length;
  // });
  return (
    <>
      <Box
        border="solid 1px lightgrey"
        p={1}
        borderRadius={2}
        sx={{ backgroundColor: "#f2f2f2" }}
        marginTop="10px"
      >
        <Typography variant="h1" component="h2">
          処方薬（内服・外用・注射）を調べる
        </Typography>
        <Grid container rowspacing={1} columnSpacing={1}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="caption" paddingLeft="10px">
              商品名/一般名から検索する
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
                      "ロキソニン..."
                    )
                  }
                  value={inputSave}
                  inputValue={input}
                  onInputChange={setInput}
                  onChange={(e) => {
                    router.push(`/ndb/prescription/${e.value}`);
                    // window.location.assign(`/ndb/prescription/${e.value}`);
                  }}
                  onMenuClose={() => setSave(input)}
                  options={options}
                  //   styles={{ option: styleFn }}
                  //   styles={customStyles}
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
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="caption" paddingLeft="10px">
              薬効分類/効能/病気・疾患名から検索する
            </Typography>
            <Grid container rowspacing={1} columnSpacing={1}>
              <Grid size={10}>
                <WindowedSelect
                  className={rsearch.select1}
                  placeholder={
                    inputSav2 ? (
                      <span style={{ color: "rgba(0, 0, 0, 0.87)" }}>
                        {inputSav2}
                      </span>
                    ) : (
                      "高血圧..."
                    )
                  }
                  value={inputSav2}
                  inputValue={inpu2}
                  onInputChange={setInpu2}
                  onChange={(e) => {
                    router.push(`/ndb/${e.value}`);
                  }}
                  onMenuClose={() => setSav2(inpu2)}
                  options={option2}
                  id="selectbo2"
                  instanceId="selectbo2"
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
                    setQuery2(inputSav2);
                  }}
                ></SearchIcon>
              </Grid>
            </Grid>
            <Result2 query2={query2} option2={option2} />
          </Grid>
        </Grid>
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
  //   return 'aa';

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
                <Link prefetch={false} href={`/ndb/prescription/${s.value}`}>
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

const Result2 = memo(function Foo(props) {
  const query0 = props.query2;
  const option2 = props.option2;
  const [res0, setRes0] = useState(option2);

  useEffect(() => {
    setRes0(option2.filter((s) => s.label.includes(query0)));
  }, [query0]);
  //   return 'aa';

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
                <Link prefetch={false} href={`/ndb/${s.value}`}>
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
