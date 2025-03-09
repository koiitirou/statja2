import Content from "./content";

const title = "処方薬データランキング検索";
const description =
  "処方薬の処方数・薬価のデータランキング推移を、性別・都道府県別・区分別(院外、院内、入院)別にまとめました。";

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
