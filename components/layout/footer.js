import { Container, Box, Link } from "@mui/material";

const footerLink = [
  { title: "人口ピラミッド", href: "/pyramid/JP" },
  { title: "世界ランキング", href: "/world" },
  { title: "都道府県ランキング", href: "/prefecture" },
  { title: "市区町村ランキング", href: "/city" },
  { title: "処方薬ランキング", href: "/ndb" },
  { title: "特定健診データ", href: "/ndb/checkup" },
  { title: "病院ランキング", href: "/hospital" },
  { title: "プライバシーポリシー", href: "/post/privacypolicy" },
];

const Footer = () => {
  return (
    <footer>
      <Container>
        <Box
          pt={{ xs: 1 }}
          textAlign="center"
          display="flex"
          flexWrap="wrap"
          justifyContent="center"
        >
          {footerLink.map((v, i) => (
            <Link
              key={"l" + i}
              underline="none"
              color="rgba(0, 0, 0, 0.6)"
              href={v.href}
              style={{ margin: "0 10px", whiteSpace: "nowrap" }}
            >
              {v.title}
            </Link>
          ))}
        </Box>
        <Box textAlign="center" p={{ xs: 1 }}>
          © 2022 統計リアル
        </Box>
      </Container>
    </footer>
  );
};

export default Footer;
