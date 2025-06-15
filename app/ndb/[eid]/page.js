import Content from "./content";
import pre_path0 from "components/data/path_ndb/sum_prescription_path.json";
import { server } from "components/data/config";

export const dynamicParams = false;

const array4 = pre_path0.epath;

const kbn1 = {
  nai: "内服",
  gai: "外用",
  tyu: "注射",
};

export async function generateStaticParams() {
  const res3 = array4.map((v) => v.params);
  return res3;
}

function generateTitleAndDescription(ssg1) {
  const title = `${ssg1.def.enm}の処方薬ランキング${ssg1.def.tmn}〜${
    ssg1.def.tmx
  }【売上・処方数・薬価】 【${kbn1[ssg1.def.kbn]}】`;
  const description = `${ssg1.def.enm}の治療薬（${
    kbn1[ssg1.def.kbn]
  }）ランキング一覧です。くすりの処方数・売上・前年比の推移を比較。`;
  return { title, description };
}

async function fetchAndProcessData(eid) {
  const res = await fetch(`${server}/shohou/${eid}_ind_ssg.json`);
  //const res = await fetch(`${server}/wor/2_0_cov_Cel_int.json`);
  const ssg1 = await res.json();
  const res1 = await fetch(`${server}/shohou/${eid}_gen_ssg.json`);
  //const res = await fetch(`${server}/wor/2_0_cov_Cel_int.json`);
  const ssg2 = await res1.json();
  return { ssg1, ssg2 };
}

export async function generateMetadata({ params }) {
  const { eid } = await params;
  const { ssg1, ssg2 } = await fetchAndProcessData(eid);
  const { title, description } = generateTitleAndDescription(ssg1);
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
  const { eid } = await params;
  const { ssg1, ssg2 } = await fetchAndProcessData(eid);
  const { title, description } = generateTitleAndDescription(ssg1);
  return (
    <>
      <Content
        ssg1={ssg1}
        ssg2={ssg2}
        eid={eid}
        kbn1={kbn1}
        title={title}
        description={description}
      />
    </>
  );
}
