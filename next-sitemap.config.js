// /** @type {import('next-sitemap').IConfig} */

// module.exports = {
//   siteUrl: 'https://statja.com',
//   generateRobotsTxt: true,
//   sitemapSize: 7000,
// };

// next-sitemap.config.js

// サイトマップに追加するパス情報が含まれるJSONファイルを読み込みます。
// このパスは、プロジェクトのルートディレクトリからの相対パスです。
const prescriptionPathData = require("./components/data/path_ndb/sum_prescription_path.json");

// --- 確認用コードここから ---
console.log("--- Checking prescriptionPathData ---");
if (prescriptionPathData) {
  console.log("prescriptionPathData loaded successfully.");
  // データ構造の確認 (例: path 配列が存在し、要素があるか)
  if (prescriptionPathData.path && Array.isArray(prescriptionPathData.path)) {
    console.log(`Number of items in path: ${prescriptionPathData.path.length}`);
    // 最初の数件のデータや、全体のキーなどを表示してみる
    console.log(
      "First few items (or keys):",
      JSON.stringify(prescriptionPathData.path.slice(0, 2), null, 2)
    );
  } else {
    console.error(
      'prescriptionPathData does not have the expected "path" array.'
    );
  }
  // 全体のデータ構造をざっくり確認したい場合 (データが大きい場合は注意)
  // console.log('Full data structure (summary):', Object.keys(prescriptionPathData));
} else {
  console.error(
    "Failed to load prescriptionPathData. It is undefined or null."
  );
}
console.log("--- End of check ---");
// --- 確認用コードここまで ---

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://statja.com",
  generateRobotsTxt: true,
  sitemapSize: 7000,

  // transform: async (config, path) => {
  //   // --- transform 関数の実行確認 (ステップ3用) ---
  //   console.log(`Transforming path: ${path}`);
  //   // ---
  //   return {
  //     loc: path,
  //     changefreq: config.changefreq,
  //     priority: config.priority,
  //     lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
  //     alternateRefs: config.alternateRefs || [],
  //   };
  // },

  // additionalPaths の戻り値をオブジェクトの配列に変更
  additionalPaths: async (config) => {
    console.log("--- Running additionalPaths (test with objects) ---");
    const currentDate = new Date().toISOString(); // lastmod 用に現在時刻を取得
    const testPaths = [
      {
        loc: "/ndb/prescription/test-page-1",
        lastmod: currentDate,
        changefreq: "daily", // 例
        priority: 0.7, // 例
      },
      {
        loc: "/ndb/prescription/test-page-2",
        lastmod: currentDate,
        changefreq: "weekly", // 例
        priority: 0.6, // 例
      },
    ];
    // 実際のデータを使う場合は以下のようにします
    // const paths = [];
    // if (prescriptionPathData && prescriptionPathData.path) {
    //   prescriptionPathData.path.forEach((entry) => {
    //     if (entry.params && entry.params.id2) {
    //       paths.push({
    //         loc: `/ndb/prescription/${entry.params.id2}`,
    //         lastmod: currentDate, // または実際の最終更新日
    //         changefreq: 'monthly', // 適宜設定
    //         priority: 0.5,         // 適宜設定
    //       });
    //     }
    //   });
    // }
    // console.log('[additionalPaths] Returning path objects:', JSON.stringify(paths.slice(0,5))); // データが多い場合は一部表示
    // return paths;

    console.log(
      "[additionalPaths] Returning test path objects:",
      JSON.stringify(testPaths)
    );
    return testPaths; // まずはテストパスで試します
  },

  // additionalPaths: async (config) => {
  //   console.log("--- Running additionalPaths (minimal test) ---");
  //   const testPaths = [
  //     "/ndb/prescription/test-page-1",
  //     "/ndb/prescription/test-page-2",
  //   ];
  //   console.log(
  //     "[additionalPaths] Returning test paths:",
  //     JSON.stringify(testPaths)
  //   );
  //   return testPaths;
  // },

  // additionalPaths: async (config) => {
  //   // --- additionalPaths 関数の実行確認と詳細ログ ---
  //   console.log("--- Running additionalPaths function ---");
  //   const paths = [];

  //   if (
  //     prescriptionPathData &&
  //     prescriptionPathData.path &&
  //     Array.isArray(prescriptionPathData.path)
  //   ) {
  //     console.log(
  //       `[additionalPaths] prescriptionPathData.path contains ${prescriptionPathData.path.length} items.`
  //     );
  //     prescriptionPathData.path.forEach((entry, index) => {
  //       console.log(
  //         `[additionalPaths] Processing entry ${index}:`,
  //         JSON.stringify(entry)
  //       );
  //       if (entry.params && entry.params.id2) {
  //         const actualPath = `/ndb/prescription/${entry.params.id2}`;
  //         console.log(`[additionalPaths] Adding path: ${actualPath}`);
  //         paths.push(actualPath);
  //       } else {
  //         console.warn(
  //           `[additionalPaths] Entry ${index} is missing params.id2 or params itself. Entry:`,
  //           JSON.stringify(entry)
  //         );
  //       }
  //     });
  //   } else {
  //     console.warn(
  //       "[additionalPaths] prescriptionPathData.path is not a valid array or prescriptionPathData is not loaded."
  //     );
  //   }
  //   console.log(
  //     `[additionalPaths] Returning ${paths.length} paths:`,
  //     JSON.stringify(paths)
  //   );
  //   // ---
  //   return paths;
  // },
};
