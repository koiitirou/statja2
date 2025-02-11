// import Image from "next/image";
// import styles from "./page.module.css";
import Content from "./content";
import { server } from "components/data/config";

const title = "世界・都道府県・市区町村・医療のデータランキング";
const description =
  "世界と日本・都道府県・市区町村のデータランキング、人口ピラミッド、全国の病院治療実績ランキング、処方薬ランキング、特定健診データをまとめています。";
export const metadata = {
  title: title,
  description: description,
};

export default function Home() {
  return (
    <>
      <Content title={title} description={description} />
    </>
  );
}
