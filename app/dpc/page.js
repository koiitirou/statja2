import Content from "./content";
import array4 from "components/data/dpc_path/dpc_ssg_list2.json";

var data = [];
array4.forEach((s, i1) => {
  data.push(s.params);
});

const options3 = {};
array4.forEach((v, i) => {
  options3[v.params.nid] = v.params.nic;
});

const options1 = Object.keys(options3)
  .sort()
  .map((v, i) => {
    return options3[v];
  });

const title = "DPC病名一覧【病院の手術件数・治療実績・在院日数ランキング】";
const description = `病気別の手術件数(年間)ランキングの第1位は${
  data[0].dis
}で${data[0].kes.toLocaleString()}件、第2位は${
  data[1].dis
}で${data[1].kes.toLocaleString()}件、第3位は${
  data[2].dis
}で${data[2].kes.toLocaleString()}件でした`;

export const metadata = {
  title: title,
  description: description,
  openGraph: {
    title,
    description,
  },
};

export default function Page() {
  return (
    <Content
      title={title}
      description={description}
      data={data}
      options1={options1}
    />
  );
}
