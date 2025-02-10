import { Container, Box, Link } from "@mui/material";

const Footer = () => {
  return (
    <Container
      component="footer"
      sx={{
        borderTop: "1px solid rgba(0, 0, 0, 0.12)",
      }}
    >
      <Box textAlign="center" pt={{ xs: 2, md: 3 }}>
        <Link
          underline="none"
          color="rgba(0, 0, 0, 0.6)"
          href="/post/privacypolicy"
        >
          Privacy policy
        </Link>
      </Box>
      <Box textAlign="center">© 2024 アプリアル</Box>
    </Container>
  );
};

export default Footer;
