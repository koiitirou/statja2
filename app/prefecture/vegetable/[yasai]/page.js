import Content from "./content";
import yasai_path from "components/pr2_path/yasai_path.json";

export const dynamicParams = false;

const array4 = yasai_path.path;

export async function generateStaticParams() {
  const res3 = array4.map((v) => v.params);
  return res3;
}

export default async function Page({ params }) {
  const { yasai } = await params;
  return <Content />;
}
