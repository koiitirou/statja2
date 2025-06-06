import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import GoogleAnalytics from "components/google/googleanalytics";
import { ThemeProvider } from "@mui/material/styles";
import theme from "components/mui/theme";
import { Noto_Sans_JP } from "next/font/google";
import { Box } from "@mui/material";
import Footer from "components/layout/footer";
import "./globals.css";

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
});

const siteName = "統計リアル";
const description =
  "世界、日本、都道府県、市区町村、医療の統計データをランキング形式で比較！人口や面積、病院の症例手術数、処方薬などの推移をまとめました。";
const url = "https://statja.com";

export const metadata = {
  title: {
    template: `%s｜${siteName}`,
    default: `日本・世界・医療のデータランキング｜${siteName}`,
  },
  description: description,
  openGraph: {
    title: `%s｜${siteName}`,
    description: description,
    // url: url,
    siteName: siteName,
    locale: "ja_JP",
    type: "website",
    // images: "https://www.statja.com/icon.png",
  },
  twitter: {
    handle: "@statjacom",
    site: "@statjacom",
    cardType: "summary_large_image",
  },
  // twitter: {
  //   card: "summary",
  //   title: siteName,
  //   description: description,
  //   site: "@apreal111",
  //   creator: "@statja10",
  //   images: "https://www.statja.com/icon.png",
  // },
  // icons: {
  //   icon: [{ url: "fa1.png", type: "image/png" }],
  // },
};
export default function RootLayout({ children }) {
  return (
    <html lang="ja" className={notoSansJP.className}>
      {/* <GoogleAnalytics /> */}
      <body
        style={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          margin: 0,
        }}
        // className={`${geistSans.variable} ${geistMono.variable}`}
        // className={notoSansJP.variable}
      >
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <Box sx={{ flex: 1 }}>
              {/* <ResBar /> */}
              {children}
            </Box>
          </ThemeProvider>
        </AppRouterCacheProvider>
        <Footer sx={{ marginTop: "auto" }} />
      </body>
    </html>
  );
}
