import Content from "./content";

import pre_path0 from "components/data/path_ndb/sum_prescription_path.json";

// import pre_path0_simple from "components/data/path_ndb/sum_prescription_path_simple.json";

import { server } from "components/data/config";

import { notFound } from "next/navigation";

export const dynamicParams = true;

export const revalidate = false;

const pre_path = pre_path0.path;

const res3 = pre_path.map((v) => v.params);

//ビルド時に生成するページを指定

// export async function generateStaticParams() {

// return res3;

// }

// export async function generateStaticParams() {

// const pre_path0 = await fetch(

// `${server}/path/path_ndb/sum_prescription_path.json`

// ).then((res) => res.json());

// const res3 = pre_path0.path.map((v) => v.params);

// return res3;

// }

// ヘルパー関数: タイトルと説明を生成

function generateTitleAndDescription(ssg1) {
  if (!ssg1 || !ssg1.def || !ssg1.dat || ssg1.dat.length === 0) {
    return {
      title: "データが見つかりません",

      description: "要求されたデータは見つかりませんでした。",
    };
  }

  const con_name = ssg1.def.dn2;

  const d0 = ssg1.dat[0];

  const l0 = ssg1.dat[ssg1.dat.length - 1];

  const title = `${con_name}の売上・処方数・薬価${l0.yrs}~${d0.yrs}【${ssg1.def.kbd}】`;

  const description = `${con_name}の${l0.yrs}~${d0.yrs}年の売上、薬価、${ssg1.def.shn}処方数（年齢(5歳階級)、性別、都道府県別）をまとめました。`;

  return { title, description };
}

// ヘルパー関数: データをフェッチ

async function fetchAndProcessData(id2) {
  try {
    const res = await fetch(`${server}/prescription/${id2}.json`, {
      // revalidate = false の設定により、このfetchはデフォルトで永続キャッシュされる挙動を期待。
      // より明示的に制御したい場合は cache オプションも検討できます:
      // cache: 'force-cache'
    });

    if (!res.ok) {
      if (res.status === 404) {
        return null; // データが存在しない場合はnullを返す
      }

      throw new Error(`Failed to fetch data for id ${id2}: ${res.statusText}`);
    }

    const ssg1 = await res.json();

    return ssg1;
  } catch (error) {
    console.error("Error fetching data:", error);

    // エラーが発生した場合もnullを返すか、エラーをスローして上位で処理

    return null;
  }
}

// 4. メタデータ生成

export async function generateMetadata({ params }) {
  const { id2 } = await params;

  if (!id2) {
    return {
      title: "無効なパラメータ",

      description: "ページのIDが指定されていません。",
    };
  }

  const ssg1 = await fetchAndProcessData(id2);

  if (!ssg1) {
    return {
      title: "データが見つかりません",

      description: "指定されたIDのデータは見つかりませんでした。",
    };
  }

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
  const { id2 } = await params;

  if (!id2) {
    // 通常、Next.jsのルーティングで動的セグメント名はparamsに渡されるため、

    // ここでid2がundefinedになるケースは稀ですが、念のため。

    notFound();
  }

  const ssg1 = await fetchAndProcessData(id2);

  if (!ssg1) {
    // データが見つからなかった場合、404ページを表示

    notFound();
  }

  const { title, description } = generateTitleAndDescription(ssg1);

  if (!title || title.trim() === "") {
    console.warn(
      `Title could not be generated for id2: ${id2}. Marking as notFound.`
    );

    notFound();
  }

  return (
    <>
      <Content title={title} description={description} ssg1={ssg1} />{" "}
    </>
  );
}
