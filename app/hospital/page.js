import Content from "./content";
import array4 from "components/data/dpc_path/hospital_ssg_list.json";
import index_data from "components/data/prefecture/index_data.json";

const options2 = Object.values(index_data).flatMap((region) =>
  region.map((prefecture) => prefecture.short_name)
);

const data = array4.map((hospital) => hospital.params);

// 目的2: 病院リストから、重複しない都道府県の短縮名（short_name）のリストを作成する。

// `map`で全ての`short_name`を抽出し、`Set`オブジェクトを使って重複を削除します。
// その後、スプレッド構文(...)でSetを配列に戻します。
const uniquePrefecturesInarray4 = [
  ...new Set(array4.map((hospital) => hospital.params.short_name)),
];

const title = "病院の入院患者数ランキング（月平均数）｜DPCデータ";
const description = `入院患者数(月平均)ランキングの第1位は${data[0].hsn}で${data[0].apn}人、第2位は${data[1].hsn}で${data[1].apn}人、第3位は${data[2].hsn}で${data[2].apn}人、第4位は${data[3].hsn}で${data[3].apn}人でした。`;

export const metadata = {
  title: title,
  description: description,
  openGraph: {
    title,
    description,
  },
};

export default function Page() {
  return (
    <Content
      options2={options2}
      data={data}
      title={title}
      description={description}
    />
  );
}
