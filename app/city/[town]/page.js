import Content from "./content";
import cit_path from "components/data/cit_path/cit_path.json";
import { server } from "components/data/config";

const ref2 = cit_path.pref;
var array4 = [];
Object.keys(cit_path.refs).forEach((v, i) => {
  array4.push(cit_path.refs[v]);
});

export const dynamicParams = false;

//////////
async function fetchAndProcessData(town) {
  const res1 = await fetch(`${server}/citcur/${town}.json`);
  const res2 = await res1.json();
  return res2;
}

function generateTitleAndDescription(town) {
  const name1 = array4.find((v) => v.params.town == town).params.nam;
  const title = `${name1}統計の市区町村ランキング一覧`;
  const description = `${name1}統計に関する市区町村ランキング・データを1ページに総まとめ。推移や前年比が一目で分かる表とグラフがあります。`;
  return { title, description };
}

/////////
export async function generateStaticParams() {
  const res3 = array4.map((v) => v.params);
  return res3;
}

export async function generateMetadata({ params }) {
  const { town } = await params;
  const { title, description } = generateTitleAndDescription(town);
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
  const { town } = await params;
  const json1 = await fetchAndProcessData(town);
  const { title, description } = generateTitleAndDescription(town);
  const ref1 = array4.find((v) => v.params.town == town).params;
  const name1 = ref1.nam;
  const rep1 = {
    city: "市区町村ランキング",
    category: "カテゴリー",
    [town]: ref1.nam,
  };
  return (
    <>
      <Content
        ref1={ref1}
        json1={json1}
        array4={array4}
        ref2={ref2}
        title={title}
        description={description}
        rep1={rep1}
      />
    </>
  );
}
