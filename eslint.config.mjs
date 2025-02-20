import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
//

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [...compat.extends("next/core-web-vitals")];

// const eslintConfig = [
//   ...compat.extends("next/core-web-vitals"),
//   {
//     files: ["*.js", "*.jsx", "*.mjs", "*.cjs", "*.ts", "*.tsx"], // 全てのファイルを対象
//     languageOptions: {
//       parserOptions: {
//         project: null, // TypeScript の設定を無効化
//       },
//     },
//   },
// ];
export default eslintConfig;
