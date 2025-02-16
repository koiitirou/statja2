import Content from "./content";
// import pr2_path from "components/pr2_path/pr2_path.json";
import { server } from "components/data/config";

export async function generateStaticParams() {
  const res1 = await fetch(`${server}/path/pr2_path/pr2_path.json`);
  const res2 = await res1.json();
  const res3 = res2.path.map((v) => {
    return v.params;
  });
  return res3;
}

export default async function Page({ params }) {
  const { id } = await params;
  const res = await fetch(`${server}/pr2json2/${id}_ssg.json`);
  const ssg1 = await res.json();
  const res1 = await fetch(`${server}/path/pr2_path/pr2_path.json`);
  const pr2_path = await res1.json();
  const thisParams = pr2_path.path.find((v) => v.params.id == id);
  const thisRef0 = Object.entries(pr2_path.refs);
  const thisRef1 = pr2_path.refs[thisParams.params.c1];
  const thisRef2 = thisRef1.params.c2s[thisParams.params.c2];
  thisRef2.url = Array.isArray(thisRef2.url) ? thisRef2.url : [thisRef2.url];
  const thisRelated = thisRef2.url.map((v) => {
    return pr2_path.path.find((s) => s.params.id == v);
  });
  return (
    <Content
      ssg0={ssg1}
      id={id}
      thisParams={thisParams}
      thisRef0={thisRef0}
      thisRef1={thisRef1}
      thisRelated={thisRelated}
      thisRef2={thisRef2}
    />
  );
}
