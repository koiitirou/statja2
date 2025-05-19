import Content from "./content";
import pr2_path from "components/pr2_path/pr2_path.json";
import { server } from "components/data/config";

export const dynamicParams = false;

async function fetchAndProcessData(id) {
  const res = await fetch(`${server}/pr2json2/${id}_ssg.json`);
  const ssg1 = await res.json();
  return ssg1;
}

// **title, description を生成する共通関数**
function generateTitleAndDescription(ssg1) {
  let description1 = `${ssg1.def.tmx}年の${ssg1.def.tl1}の都道府県ランキング`;
  ssg1.def.ran.forEach((_, i) => {
    description1 += `${ssg1.def.rnk[i]}位は${ssg1.def.pre[i]}で${ssg1.def.val[
      i
    ].toLocaleString()}${ssg1.def.ut1}（${ssg1.def.lpr[i] >= 0 ? "+" : ""}${
      ssg1.def.lpr[i]
    }%）`;
    if (i !== ssg1.def.ran.length - 1) description1 += "、";
  });
  description1 += "でした。";

  const title = `${ssg1.def.tl1}の都道府県ランキング【${ssg1.def.tmn}〜${ssg1.def.tmx}】`;

  return { title, description: description1 };
}

///
const res3 = pr2_path.path.map((v) => v.params);
export async function generateStaticParams() {
  return res3;
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const ssg1 = await fetchAndProcessData(id);
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
  const { id } = await params;
  const ssg1 = await fetchAndProcessData(id);
  const thisParams = pr2_path.path.find((v) => v.params.id == id);
  const thisRef0 = Object.entries(pr2_path.refs);
  const thisRef1 = pr2_path.refs[thisParams.params.c1];
  const thisRef2 = thisRef1.params.c2s[thisParams.params.c2];
  thisRef2.url = Array.isArray(thisRef2.url) ? thisRef2.url : [thisRef2.url];
  const thisRelated = thisRef2.url.map((v) => {
    return pr2_path.path.find((s) => s.params.id == v);
  });
  const { title, description } = generateTitleAndDescription(ssg1);

  return (
    <Content
      ssg0={ssg1}
      id={id}
      thisParams={thisParams}
      thisRef0={thisRef0}
      thisRef1={thisRef1}
      thisRelated={thisRelated}
      thisRef2={thisRef2}
      title1={title}
      description1={description}
    />
  );
}
