import Layout from "../../components/layout";
import Head from "next/head";
import Date from "../../components/date";
import utilStyles from "../../styles/utils.module.css";
// import useSWR, { unstable_serialize } from "swr";
import { useCallback, useEffect, useMemo, useState } from "react";

export async function getServerSideProps({ req }) {
  const currentHost =
    `${req.headers["x-forwarded-proto"]}://${req.headers.host}/` || "";
  const path = req.url.match(/\/pages(.*)\./g);
  const pageId = path
    ? path[0].replace(/\/pages\/|\./gi, "")
    : req.url.replace(/\/pages\/|\./gi, "");
  const itemApi = `${currentHost}api/item?id=${pageId}`;

  return {
    props: {
      itemApi,
    },
  };
}

export default function Page({ itemApi }) {
  const [pageData, setPageData] = useState();
  const getItemDB = useCallback(
    async (url) => {
      const data = await fetch(url).then(async (res) => {
        const result = await res.json();
        return result.data;
      });
      setPageData(data);
    },
    [pageData]
  );

  useEffect(() => {
    if (!pageData) {
      getItemDB(itemApi);
    }
  }, [pageData]);

  return (
    <Layout>
      <Head>
        <title>{pageData?.title.S}</title>
      </Head>
      <article>
        <h1 className={utilStyles.headingXl}>{pageData?.title.S}</h1>
        <div className={utilStyles.lightText}>
          {/* <Date dateString={pageData?.date} /> */}
        </div>
        <div dangerouslySetInnerHTML={{ __html: pageData?.content.S }} />
      </article>
    </Layout>
  );
}
