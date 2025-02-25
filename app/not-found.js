import NotFoundContent from "./not-found-content";

const title = "404|This page could not be found";
const description = "404|This page could not be found";
export const metadata = {
  title: title,
  description: description,
  openGraph: {
    title: title,
    description: description,
  },
};

const notFound = () => {
  return (
    <>
      <NotFoundContent title={title} description={description} />{" "}
    </>
  );
};

export default notFound;
