import React, { Component, useState, useEffect, memo } from "react";
import dynamic from "next/dynamic";
const WindowedSelect = dynamic(() => import("react-windowed-select"), {
  ssr: false,
});
import array4 from "components/data/dpc_path/dpc_ssg_list2.json";
import array44 from "components/data/dpc_path/dpc_alternative_path.json";
import { Typography, Box } from "@mui/material";
import Grid from "@mui/material/Grid2";
import rsearch from "components/css/rsearch.module.css";
import SearchIcon from "@mui/icons-material/Search";
import Link from "@mui/material/Link";
import { useRouter } from "next/navigation";
// import { createFilter, components } from "react-windowed-select";
import array5 from "components/data/dpc_path/hospital_ssg_list.json";

var options2 = [];
array5.map((s) => {
  var child2 = {};
  child2["value"] = s.params.hospital;
  child2["label"] = s.params.hsn;
  child2["td_sq"] = s.params.td_sq;
  options2.push(child2);
});

var options1 = [];
array4.map((s) => {
  var child1 = {};
  child1["value"] = s.params.did;
  child1["label"] = s.params.dis;
  // child1['nid'] = s.params.nid;
  child1["icd"] = s.params.icd;
  options1.push(child1);
});
var options11 = [];
array44.map((s) => {
  var child1 = {};
  child1["value"] = "alternative/" + s.params.dhsh;
  child1["label"] = s.params.dext;
  // child1['nid'] = s.params.nid;
  // child1['icd'] = s.params.icdis;
  options11.push(child1);
});
options1 = options1.concat(options11);
// const customFilter = createFilter({
//   ignoreAccents: false,
// });
const customFilter = (option, searchText) => {
  const labelBoo = option.data.label
    .toLowerCase()
    .includes(searchText.toLowerCase());
  const valueBoo = option.data.value
    .toLowerCase()
    .includes(searchText.toLowerCase());
  const icdBoo = option.data.icd
    ? option.data.icd.toLowerCase().includes(searchText.toLowerCase())
    : false;
  if (labelBoo || valueBoo || icdBoo) {
    return true;
  } else {
    return false;
  }
};
// const customComponents = {
//   ClearIndicator: (props) => (
//     <components.ClearIndicator {...props}>clear</components.ClearIndicator>
//   ),
// };
const MyComponent = () => {
  const router = useRouter();
  const [input1, setInput1] = useState("");
  const [inputSave1, setSave1] = useState("");
  const [query1, setQuery1] = useState();
  // useEffect(() => {
  //   setSave1(router.query.i1);
  //   setQuery1(router.query.i1);
  // }, [router.query.i1]);

  const [input2, setInput2] = useState("");
  const [inputSave2, setSave2] = useState("");
  const [query2, setQuery2] = useState();

  // useEffect(() => {
  //   setSave2(router.query.i2);
  //   setQuery2(router.query.i2);
  // }, [router.query.i]);
  //const [op1, setOp1] = useState(options1);
  //const [op3, setOp3] = useState([]);
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
          治療実績を調べる
        </Typography>

        <Grid container rowspacing={1} columns={12}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="caption" paddingLeft="10px">
              病気名から調べる
            </Typography>
            <Grid container rowspacing={1} columns={12}>
              <Grid size={10}>
                <WindowedSelect
                  className={rsearch.select1}
                  //filterOption={false}
                  //filterOption={createFilter({ ignoreAccents: false })}
                  //components={{ MenuList }}
                  //components={{ Option: CustomOption }}
                  // placeholder={'狭心症...'}
                  options={options1}
                  // isSearchable={false}
                  //   defaultValue={op1.filter((s) => s.value == props.did1)}
                  onChange={(e) => {
                    // var e1 = options3.filter((s) => e.nid == s.value);
                    //  setOp3(e1[0]);
                    router.push(`/dpc/${e.value}`);
                  }}
                  // filterOption={customFilter}
                  // components={customComponents}
                  placeholder={
                    inputSave1 ? (
                      <span style={{ color: "rgba(0, 0, 0, 0.87)" }}>
                        {inputSave1}
                      </span>
                    ) : (
                      "狭心症..."
                    )
                  }
                  value={inputSave1}
                  inputValue={input1}
                  onInputChange={setInput1}
                  onMenuClose={() => setSave1(input1)}
                  // onFocus={() => {
                  //   setInput1(inputSave1);
                  //   setSave1("");
                  // }}
                  // blurInputOnSelect
                  id="selectbox1"
                  instanceId="selectbox1"
                />
              </Grid>
              <Grid size={2}>
                <SearchIcon
                  sx={{
                    borderRadius: "4px",
                    // border: '1px  solid',
                    // borderColor: 'hsl(0, 0%, 80%)',
                    padding: "3px",
                    fontSize: "34px",
                    height: "38px",
                    width: "38px",
                    background: "#2196f3",
                    color: "#fff",
                    // transform: 'translateY(5%)',

                    // fill: '#007FFF',
                  }}
                  //   color='secondary'
                  onClick={() => {
                    setQuery1(inputSave1);
                  }}
                ></SearchIcon>
              </Grid>
            </Grid>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="caption" paddingLeft="10px">
              病院名から調べる
            </Typography>
            <Grid container rowspacing={1} columns={12}>
              <Grid size={10}>
                <WindowedSelect
                  className={rsearch.select1}
                  // placeholder='...病院'
                  options={options2}
                  //components={{ Option: CustomOption }}
                  // filterOption={createFilter({ ignoreAccents: false })}
                  //components={{ MenuList }}
                  //filterOption={() => true}
                  //filterOption={false}
                  //filterOption={createFilter({ ignoreAccents: false })}
                  // isSearchable={false}
                  // defaultValue={op1.filter((s) => s.value == props.hospital1)}

                  onChange={(e) => {
                    // var e1 = options3.filter((s) => e.td_sq == s.value);
                    //  setOp3(e1[0]);
                    router.push(`/hospital/${e.value}`);
                  }}
                  // filterOption={customFilter}
                  // components={customComponents}
                  placeholder={
                    inputSave2 ? (
                      <span style={{ color: "rgba(0, 0, 0, 0.87)" }}>
                        {inputSave2}
                      </span>
                    ) : (
                      "病院..."
                    )
                  }
                  value={inputSave2}
                  inputValue={input2}
                  onInputChange={setInput2}
                  onMenuClose={() => setSave2(input2)}
                  // onFocus={() => {
                  //   setInput2(inputSave2);
                  //   setSave2("");
                  // }}
                  // blurInputOnSelect
                  id="selectbox2"
                  instanceId="selectbox2"
                />
              </Grid>
              <Grid size={2}>
                <SearchIcon
                  sx={{
                    borderRadius: "4px",
                    // border: '1px  solid',
                    // borderColor: 'hsl(0, 0%, 80%)',
                    padding: "3px",
                    fontSize: "34px",
                    height: "38px",
                    width: "38px",
                    background: "#2196f3",
                    color: "#fff",
                    // transform: 'translateY(5%)',
                    verticalAlign: "text-bottom",
                    // fill: '#007FFF',
                  }}
                  //   color='secondary'
                  onClick={() => {
                    setQuery2(inputSave2);
                    // setQuery1();
                    // router.push(
                    //   {
                    //     // pathname: router.asPath,
                    //     query: { i2: inputSave2 },
                    //   },
                    //   undefined,
                    //   { shallow: true }
                    // );
                  }}
                ></SearchIcon>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        {query1 && <Result1 query0={query1} options={options1} />}
        {query2 && <Result2 query0={query2} options={options2} />}
      </Box>
    </>
  );
};
export default MyComponent;

const Result1 = memo(function Foo(props) {
  const query0 = props.query0;
  const options = props.options;
  const [res0, setRes0] = useState(options);

  useEffect(() => {
    setRes0(
      options.filter(
        (s) =>
          s.label.includes(query0) || (s.icd ? s.icd.includes(query0) : false)
      )
    );
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
                <Link color="#nnn" href={`/dpc/${s.value}`}>
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
                <Link color="#nnn" href={`/hospital/${s.value}`}>
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
