import Content from "./content";
import pr2_path from "components/pr2_path/pr2_path.json";
import yasai_path from "components/pr2_path/yasai_path.json";
import { server } from "components/data/config";
import ref2 from "components/data/prefecture_list2.json";

var pref1 = [];
Object.keys(ref2).forEach((v, i) => {
  if (v != "s00") {
    pref1[v] = ref2[v];
  }
});

const array6 = [];
Object.keys(pref1).forEach((v0, i0) => {
  Object.keys(pr2_path.refs).forEach((v1, i1) => {
    array6.push({ params: { prefec: [v0, pr2_path.refs[v1].params.lnk] } });
  });
});
Object.keys(pref1).forEach((v0, i0) => {
  Object.keys(yasai_path.refs).forEach((v1, i1) => {
    array6.push({ params: { prefec: [v0, yasai_path.refs[v1].params.lnk] } });
  });
});

var ref3 = pr2_path.refs;
Object.keys(yasai_path.refs).forEach((v1, i1) => {
  ref3[v1] = yasai_path.refs[v1];
});

//////////
async function fetchAndProcessData(prefec) {
  const res1 = await fetch(`${server}/pr2info/${prefec[0]}_${prefec[1]}.json`);
  const res2 = await res1.json();
  return res2;
}

function generateTitleAndDescription(th_res, th_prefec) {
  const title1 = th_prefec.tln + "の統計ランキング【" + th_res.nam + "】";
  const description1 =
    th_prefec.tln +
    "の統計データランキング・年次推移をまとめました。" +
    th_res.nam +
    "統計の詳細・順位・前年比がわかるページへリンクしています。";
  return { title: title1, description: description1 };
}

/////////
export async function generateStaticParams() {
  const res3 = array6.map((v) => v.params);
  return res3;
}

export async function generateMetadata({ params }) {
  const { prefec } = await params;
  const res2 = await fetchAndProcessData(prefec);
  const th_res = ref3[res2[0].c1].params;
  const th_prefec = pref1[prefec[0]];
  const { title, description } = generateTitleAndDescription(th_res, th_prefec);
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
  const { prefec } = await params;
  const res2 = await fetchAndProcessData(prefec);
  const th_res = ref3[res2[0].c1].params;
  const th_prefec = pref1[prefec[0]];
  const { title, description } = generateTitleAndDescription(th_res, th_prefec);

  return (
    <>
      <Content
        prefec={prefec}
        res2={res2}
        ref3={ref3}
        th_prefec={th_prefec}
        th_res={th_res}
        title={title}
        description={description}
      />
    </>
  );
}
