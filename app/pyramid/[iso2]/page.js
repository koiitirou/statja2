import Content from "./content";
import pop_path0 from "components/data/pyramid/pop_path.json";
import pop_path11 from "components/data/pyramid/jpop_path1.json";
import pop_path12 from "components/data/pyramid/jpop_path2.json";
import { server } from "components/data/config";

const pop_path = pop_path0.concat(pop_path11).concat(pop_path12);

export const dynamicParams = false;

async function fetchAndProcessData(iso2) {
  const res1 = await fetch(`${server}/yr5out/${iso2}.json`);
  const res2 = await res1.json();
  return res2;
}

function generateTitleAndDescription(iso2, res2) {
  const res3 = pop_path.find((v) => v.params.iso2 == iso2);
  var con_name = "";
  if (res3.params.cl == "sh") {
    con_name = res3.params.jpni + "　" + res3.params.kata;
  } else {
    con_name = res3.params.jpni;
  }

  const e0 = res2;
  const d0 = e0[0];
  const l0 = e0[e0.length - 1];

  const title = `${con_name}の人口ピラミッド【${d0.yrs}~${l0.yrs}年】`;
  const description = `${con_name}の人口ピラミッド(5歳階級)、総人口推移、区分人口推移(年少人口、生産年齢人口、高齢者人口)の、${d0.yrs}~${l0.yrs}年の推移データをまとめました。`;
  return { title, description };
}

export function generateStaticParams() {
  const res3 = pop_path.map((v) => v.params);
  return res3;
}

export async function generateMetadata({ params }) {
  const { iso2 } = await params;
  const res2 = await fetchAndProcessData(iso2);
  const { title, description } = generateTitleAndDescription(iso2, res2);
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
  const { iso2 } = await params;
  const res2 = await fetchAndProcessData(iso2);
  const res3 = pop_path.find((v) => v.params.iso2 == iso2);
  var con_name = "";
  if (res3.params.cl == "sh") {
    con_name = res3.params.jpni + "　" + res3.params.kata;
  } else {
    con_name = res3.params.jpni;
  }

  const e0 = res2;
  const d0 = e0[0];
  const l0 = e0[e0.length - 1];
  const { title, description } = generateTitleAndDescription(iso2, res2);

  return (
    <Content
      iso2={iso2}
      res2={res2}
      res3={res3}
      title={title}
      description={description}
      con_name={con_name}
    />
  );
}
