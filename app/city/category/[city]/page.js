import Content from "./content";
import cit_path from "components/data/cit_path/cit_path.json";
import { server } from "components/data/config";

export const dynamicParams = false;

const array4 = cit_path.path;

export async function generateStaticParams() {
  const res3 = array4.map((v) => v.params);
  return res3;
}

function generateTitleAndDescription(ssg1) {
  const unit1 = ssg1.def.ut1;
  const title = `${ssg1.def.tl1}の市区町村ランキング${ssg1.def.tmn}〜${ssg1.def.tmx}年【順位】`;
  const description = ` ${ssg1.def.tmx}年の1位は${ssg1.def.pre[0]}で${Number(
    ssg1.def.val[0]
  ).toLocaleString()}${unit1}、2位は${ssg1.def.pre[1]}で${Number(
    ssg1.def.val[1]
  ).toLocaleString()}${unit1}、3位は${ssg1.def.pre[2]}で${Number(
    ssg1.def.val[2]
  ).toLocaleString()}${unit1}でした。`;
  return { title, description };
}

async function fetchAndProcessData(city) {
  const res = await fetch(`${server}/citjson2/${city}_ssg.json`);
  const ssg1 = await res.json();
  return ssg1;
}

export async function generateMetadata({ params }) {
  const { city } = await params;
  const ssg1 = await fetchAndProcessData(city);
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
  const { city } = await params;
  const ssg1 = await fetchAndProcessData(city);
  const { title, description } = generateTitleAndDescription(ssg1);
  return (
    <>
      <Content
        title={title}
        description={description}
        ssg1={ssg1}
        city={city}
      />
    </>
  );
}
