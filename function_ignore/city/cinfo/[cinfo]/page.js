import Content from "./content";
import cit_path from "components/data/cit_path/cit_path.json";
import { server } from "components/data/config";

export const dynamicParams = false;
///array4
var array4 = [];
Object.keys(cit_path.pref).forEach((v, i) => {
  array4.push({ params: { cinfo: v } });
});
const res3 = array4.map((v) => v.params);
async function fetchAndProcessData(cinfo) {
  const res = await fetch(`${server}/citinf2/${cinfo}.json`);
  const ssg1 = await res.json();
  return ssg1;
}

function generateTitleAndDescription(cinfo) {
  const th_prefec = cit_path.pref[cinfo];
  const title = th_prefec.jln + "の統計ランキング";
  const description = `${th_prefec.jln}の統計データランキング・年次推移をまとめました。データの詳細・順位・前年比がわかるページへリンクしています。`;
  return { title, description };
}

export function generateStaticParams() {
  return res3;
}

export async function generateMetadata({ params }) {
  const { cinfo } = await params;
  const { title, description } = generateTitleAndDescription(cinfo);
  return {
    title: title,
    description: description,
    openGraph: {
      title: title,
      description: description,
    },
  };
}

export default async function Page({ params }) {
  const { cinfo } = await params;
  const ssg1 = await fetchAndProcessData(cinfo);
  const { title, description } = generateTitleAndDescription(cinfo);
  const th_prefec = cit_path.pref[cinfo];
  const columns = ssg1.columns;
  const data = ssg1.data;
  const category1 = ssg1.category;
  var options_topic = [];
  data.forEach((v) => {
    options_topic.push(v.s[1]);
  });
  options_topic = [...new Set(options_topic)];
  return (
    <Content
      // ssg1={ssg1}
      data={data}
      columns={columns}
      options_topic={options_topic}
      category1={category1}
      title={title}
      th_prefec={th_prefec}
      description={description}
      cinfo={cinfo}
    />
  );
}
