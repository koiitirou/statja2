import Content from "./content";
import cit_path from "components/data/cit_path/cit_path.json";

export const dynamicParams = false;

const array4 = cit_path.path;

export async function generateStaticParams() {
  const res3 = array4.map((v) => v.params);
  return res3;
}

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

export default async function Page({ params }) {
  const { city } = await params;
  return (
    <>
      <Content title={title} description={description} />
    </>
  );
}
