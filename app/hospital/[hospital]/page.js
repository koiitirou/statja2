import Content from "./content.js";
import array4 from "components/data/dpc_path/hospital_ssg_list.json";
import { server } from "components/data/config";

export const dynamicParams = false;

const res3 = array4.map((v) => v.params);
export async function generateStaticParams() {
  return res3;
}

async function fetchAndProcessData(hospital) {
  const res = await fetch(`${server}/hospital3/${hospital}_int.json`);
  const ssg1 = await res.json();
  return { ssg1 };
}

function generateTitleAndDescription(ssg1) {
  const title = `${ssg1.def.hospital}の手術件数・入院数・治療実績ランキング${
    ssg1.def.time_list2[0]
  }〜${ssg1.def.time_list2[ssg1.def.time_list2.length - 1]}`;
  const description = `${ssg1.def.hospital}の入院数(月平均)・手術件数・治療実績・在院日数・その他基本情報をDPCオープンデータをもとにまとめています。ランキング順位は全国、都道府県別に集計しています。`;
  return { title, description };
}

export async function generateMetadata({ params }) {
  const { hospital } = await params;
  const { ssg1 } = await fetchAndProcessData(hospital);
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
  const { hospital } = await params;
  const { ssg1 } = await fetchAndProcessData(hospital);
  const { title, description } = generateTitleAndDescription(ssg1);

  return (
    <Content
      hospital={hospital}
      ssg1={ssg1}
      title={title}
      description={description}
    />
  );
}
