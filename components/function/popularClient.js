import Link from "next/link";
import { useEffect, useState } from "react";
import { server } from "components/data/config";
const PopularClient = ({ path }) => {
  const [popular, setPopular] = useState();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response1 = await fetch(`${server}/gap/${path}.json`);
        const json1 = await response1.json();
        setPopular(json1);
      } catch (error) {
        console.error("Error to fetch json");
      }
    };

    fetchData();
  }, []);
  return (
    <>
      {popular &&
        popular.map((v, i) => {
          return (
            <Link
              key={"n" + i}
              href={v.p}
              prefetch={false}
              style={{
                margin: "0 10px",
                textDecoration: "none",
                color: "blue",
              }}
            >
              {v.t}
            </Link>
          );
        })}
    </>
  );
};

export default PopularClient;
