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

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  // 既存の設定
  siteUrl: "https://statja.com",
  generateRobotsTxt: true, // robots.txt を生成する
  sitemapSize: 7000, // 1つのサイトマップファイルに含めるURLの最大数

  // （オプション）サイトマップエントリのデフォルト値を設定
  // これらは transform 関数内で config オブジェクト経由で参照されます。
  // 設定しない場合は next-sitemap の内部デフォルト値が使用されます。
  // changefreq: 'daily',
  // priority: 0.7,
  // autoLastmod: true, // デフォルトでtrue。最終更新日時を自動で付与します。

  // このtransform関数は、静的ファイルから生成されたパス、
  // getServerSidePropsから生成されたパス（Pages Routerの場合）、
  // そしてadditionalPathsで追加されたパスなど、全てのパスに適用されます。
  transform: async (config, path) => {
    // path は '/ndb/prescription/xxxx' のようなサイトのルートからの相対パスです。

    // 特定のパスに対して優先度や更新頻度をカスタマイズする例：
    // if (path === '/') {
    //   return {
    //     loc: path,
    //     changefreq: 'daily',
    //     priority: 1.0,
    //     lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
    //   };
    // }

    // デフォルトの処理：設定された値またはnext-sitemapのデフォルト値を使用
    return {
      loc: path, // 必須: URLのロケーション
      changefreq: config.changefreq, // <changefreq>
      priority: config.priority, // <priority>
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined, // <lastmod>
      alternateRefs: config.alternateRefs || [], // 代替言語ページがない場合は空配列
    };
  },

  // 動的に生成されるページのパスをリストアップする非同期関数
  additionalPaths: async (config) => {
    const paths = [];

    if (prescriptionPathData && prescriptionPathData.path) {
      prescriptionPathData.path.forEach((entry) => {
        // JSONファイル内のデータ構造 (entry.params.id2) に合わせてパスを構築
        // 例: entry が { params: { id2: 'someValue' } } のようなオブジェクトであると仮定
        if (entry.params && entry.params.id2) {
          // ユーザー指定のURL形式: domain/ndb/prescription/**
          const actualPath = `/ndb/prescription/${entry.params.id2}`;
          paths.push(actualPath);
        }
      });
    }

    // ここではパス文字列の配列を返します。
    // これらのパスは上記の `transform` 関数によって処理され、
    // 完全なサイトマップエントリオブジェクトに変換されます。
    return paths;
  },
};
