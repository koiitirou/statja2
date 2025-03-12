import Content from "./content";
import pre_path0 from "components/data/path_ndb/sum_prescription_path.json";
import { server } from "components/data/config";

export const dynamicParams = false;

const pre_path = pre_path0.path;

export async function generateStaticParams() {
  const res3 = pre_path.map((v) => v.params);
  return res3;
}

function generateTitleAndDescription(ssg1) {
  const con_name = ssg1.def.dn2;
  const d0 = ssg1.dat[0];
  const l0 = ssg1.dat[ssg1.dat.length - 1];
  const title = `${con_name}の売上・処方数・薬価${l0.yrs}~${d0.yrs}【${ssg1.def.kbd}】`;

  const description = `${con_name}の${l0.yrs}~${d0.yrs}年の売上、薬価、${ssg1.def.shn}処方数（年齢(5歳階級)、性別、都道府県別）をまとめました。`;

  return { title, description };
}

async function fetchAndProcessData(id2) {
  const res = await fetch(`${server}/prescription/${id2}.json`);
  const ssg1 = await res.json();
  return ssg1;
}

export async function generateMetadata({ params }) {
  const { id2 } = await params;
  const ssg1 = await fetchAndProcessData(id2);
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
  const { id2 } = await params;
  const ssg1 = await fetchAndProcessData(id2);
  const { title, description } = generateTitleAndDescription(ssg1);
  return (
    <>
      <Content title={title} description={description} ssg1={ssg1} />
    </>
  );
}
