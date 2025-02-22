import Content from "./content";

const title1 = "都道府県データランキング";
const description1 =
  "日本全国の都道府県データランキングの年次推移を、表・グラフ・地図でまとめました。人口、面積、密度、経済、行政、家計などの指標を調べることができます。";

export const metadata = {
  title: title1,
  description: description1,
  openGraph: {
    title: title1,
    description: description1,
  },
};

export default async function Page({ params }) {
  return <Content title1={title1} description1={description1} />;
}
