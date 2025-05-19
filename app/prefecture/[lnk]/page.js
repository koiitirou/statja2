import Content from "./content";
import pr2_path from "components/pr2_path/pr2_path.json";
import yasai_path from "components/pr2_path/yasai_path.json";
import { server } from "components/data/config";
import ref2 from "components/data/prefecture_list2.json";

export const dynamicParams = false;

var array4 = [];
Object.keys(pr2_path.refs).forEach((v, i) => {
  array4.push(pr2_path.refs[v]);
});

Object.keys(yasai_path.refs).forEach((v, i) => {
  array4.push(yasai_path.refs[v]);
});

const res3 = array4.map((v) => v.params);

async function fetchAndProcessData(lnk) {
  const res = await fetch(`${server}/pr2cur/${lnk}.json`);
  const ssg1 = await res.json();
  return ssg1;
}

function generateTitleAndDescription(lnk) {
  const ref1 = array4.find((v) => v.params.lnk == lnk).params;
  const name1 = ref1.nam;

  const title = `${name1}統計の都道府県ランキング一覧`;
  const description = `${name1}統計に関する都道府県ランキング・データを1ページに総まとめ。推移や前年比が一目で分かる表とグラフがあります。`;
  return { title, description };
}

export function generateStaticParams() {
  return res3;
}

export async function generateMetadata({ params }) {
  const { lnk } = await params;
  const { title, description } = generateTitleAndDescription(lnk);
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
  const { lnk } = await params;
  const json1 = await fetchAndProcessData(lnk);
  const ref1 = array4.find((v) => v.params.lnk == lnk).params;
  const { title, description } = generateTitleAndDescription(lnk);
  const rep1 = {
    prefecture: "都道府県ランキング",
    [lnk]: ref1.nam,
  };
  return (
    <Content
      ref1={ref1}
      json1={json1}
      array4={array4}
      ref2={ref2}
      title={title}
      description={description}
      rep1={rep1}
    />
  );
}
