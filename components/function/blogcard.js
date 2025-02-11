import {
  Typography,
  Card,
  CardContent,
  CardHeader,
  CardActionArea,
} from "@mui/material";

const Blogcard = (props) => {
  return (
    <CardActionArea href={props.href1}>
      <Card sx={{ display: "flex", marginBottom: "15px" }}>
        <CardContent
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          {props.icon1}
        </CardContent>
        <CardHeader
          sx={{
            display: "flex",
            flex: "1",
          }}
          title={
            <Typography fontWeight="bold" fontSize={{ xs: "16px", md: "18px" }}>
              {props.title1}
            </Typography>
          }
          subheader={
            <Typography color="dimgrey" fontSize={{ xs: "12px", md: "14px" }}>
              {props.sub1}
            </Typography>
          }
        ></CardHeader>

        <CardContent
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <ArrowForwardIosIcon />
        </CardContent>
      </Card>
    </CardActionArea>
  );
};
