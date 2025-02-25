import Content from "./content";
import yasai_path from "components/pr2_path/yasai_path.json";
import { server } from "components/data/config";

export const dynamicParams = false;

async function fetchAndProcessData(yasai) {
  const res = await fetch(`${server}/yasaijson/${yasai}_ssg.json`);
  const ssg1 = await res.json();
  return ssg1;
}

function generateTitleAndDescription(ssg1) {
  const title = `${ssg1.def.tl1}収穫量の都道府県ランキング【${ssg1.def.tmn}〜${ssg1.def.tmx}】`;
  var description = `${ssg1.def.tmx}年の${ssg1.def.tl1}の収穫量は日本全国で${ssg1.def.sum}${ssg1.def.ut0}で、都道府県別に`;

  const ranks = ssg1.def.rnk
    .slice(0, 3)
    .map(
      (v, i) =>
        `${ssg1.def.rnk[i]}位は${ssg1.def.pre[i]}で${ssg1.def.val[
          i
        ].toLocaleString()}${ssg1.def.ut0}（${ssg1.def.vlr[i] >= 0 ? "+" : ""}${
          ssg1.def.vlr[i]
        }%）`
    );

  description += ranks.join("、") + "でした。";

  return { title, description };
}

const array4 = yasai_path.path;

export async function generateStaticParams() {
  const res3 = array4.map((v) => v.params);
  return res3;
}

export default async function Page({ params }) {
  const { yasai } = await params;
  const ssg1 = await fetchAndProcessData(yasai);
  const { title, description } = generateTitleAndDescription(ssg1);
  return (
    <Content
      ssg0={ssg1}
      title={title}
      description={description}
      yasai={yasai}
    />
  );
}
