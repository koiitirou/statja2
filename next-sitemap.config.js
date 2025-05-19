// next-sitemap.config.js

// サイトマップに追加するパス情報が含まれるJSONファイルを読み込みます。
// このパスは、プロジェクトのルートディレクトリからの相対パスです。
const prescriptionPathData = require("./components/data/path_ndb/sum_prescription_path.json");

// --- 確認用コード (開発中は有効にしておくと便利です) ---
// console.log("--- Checking prescriptionPathData ---");
// if (prescriptionPathData) {
//   console.log("prescriptionPathData loaded successfully.");
//   if (prescriptionPathData.path && Array.isArray(prescriptionPathData.path)) {
//     console.log(`Number of items in path: ${prescriptionPathData.path.length}`);
//     // console.log(
//     //   "First few items (or keys):",
//     //   JSON.stringify(prescriptionPathData.path.slice(0, 2), null, 2)
//     // );
//   } else {
//     console.error(
//       'prescriptionPathData does not have the expected "path" array.'
//     );
//   }
// } else {
//   console.error(
//     "Failed to load prescriptionPathData. It is undefined or null."
//   );
// }
// console.log("--- End of check ---");
// --- 確認用コードここまで ---

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://statja.com",
  generateRobotsTxt: true,
  sitemapSize: 7000, // 1つのサイトマップファイルに含めるURLの最大数

  // (オプション) サイトマップエントリのグローバルなデフォルト値を設定できます。
  // これらは `config.changefreq` や `config.priority` として transform 関数内で参照されます。
  // changefreq: 'daily',
  // priority: 0.7,
  // autoLastmod: true, // デフォルトでtrue。最終更新日時を自動で付与します。

  // このtransform関数は、静的ファイルから生成されたパスや、
  // additionalPathsから渡されたパス文字列など、全てのパスに適用されます。
  transform: async (config, path) => {
    // console.log(`Transforming path: ${path}`); // デバッグ時に有効化
    return {
      loc: path, // 必須: URLのロケーション
      changefreq: config.changefreq, // configからグローバル設定またはnext-sitemapのデフォルト値を取得
      priority: config.priority, // configからグローバル設定またはnext-sitemapのデフォルト値を取得
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined, // lastmodを自動生成
      alternateRefs: config.alternateRefs || [], // 代替言語ページがない場合は空配列
    };
  },

  // 動的に生成されるページのパスをリストアップする非同期関数
  additionalPaths: async (config) => {
    // console.log('--- Running additionalPaths to generate sitemap entries ---');
    const sitemapEntries = []; // ここには最終的なサイトマップエントリオブジェクトが入ります

    if (
      prescriptionPathData &&
      prescriptionPathData.path &&
      Array.isArray(prescriptionPathData.path)
    ) {
      // console.log(
      //   `[additionalPaths] prescriptionPathData.path contains ${prescriptionPathData.path.length} items.`
      // );

      // for...of ループを使って、ループ内で await を使用可能にします
      for (const entry of prescriptionPathData.path) {
        // console.log(
        //   `[additionalPaths] Processing entry:`,
        //   JSON.stringify(entry)
        // );
        if (entry.params && entry.params.id2) {
          const actualPath = `/ndb/prescription/${entry.params.id2}`;
          // 各パス文字列を transform 関数で処理してオブジェクトにし、配列に追加
          sitemapEntries.push(await config.transform(config, actualPath));
        } else {
          // console.warn(
          //   `[additionalPaths] Entry is missing params.id2 or params itself. Entry:`,
          //   JSON.stringify(entry)
          // );
        }
      }
    } else {
      // console.warn(
      //   "[additionalPaths] prescriptionPathData.path is not a valid array or prescriptionPathData is not loaded."
      // );
    }

    // console.log(
    //   `[additionalPaths] Returning ${sitemapEntries.length} sitemap entries. Sample:`,
    //   JSON.stringify(sitemapEntries.slice(0, 2)) // 最初の数件をログに出力
    // );
    return sitemapEntries; // 生成されたサイトマップエントリオブジェクトの配列を返す
  },
};
