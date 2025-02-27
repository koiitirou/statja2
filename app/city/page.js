import Content from "./content";

const title = "市区町村データランキング";
const description =
  "日本の市区町村データランキングの年次推移を、表・グラフ・地図でまとめました。人口、面積、密度、経済、行政、家計などの指標を調べることができます。";

export const metadata = {
  title: title,
  description: description,
  openGraph: {
    title,
    description,
  },
};

export default function Home() {
  return (
    <>
      <Content title={title} description={description} />
    </>
  );
}
