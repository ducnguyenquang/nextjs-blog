import Head from "next/head";
import Layout, { siteTitle } from "../components/layout";
import utilStyles from "../styles/utils.module.css";
import { getSortedPostsData } from "../lib/posts";
import Link from "next/link";
import { formatDistance, subDays } from "date-fns";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import useSWR from "swr";
// import * as uuid from 'uuid';
import { useRouter } from "next/navigation";

// const fetcher = (url) => fetch(url).then((res) => res.json());

export async function getServerSideProps({ req }) {
  // const currentHost = req.headers.referer || '';
  const currentHost =
    `${req.headers["x-forwarded-proto"]}://${req.headers.host}/` || "";

  const allPostsData = getSortedPostsData();
  return {
    props: {
      currentHost,
      allPostsData,
    },
  };
}

export default function Home({ allPostsData, currentHost }) {
  // let parser = new Parser();
  const router = useRouter();
  const [rssData, setRssData] = useState(null);
  const [pageId, setPageId] = useState("");
  const urlApi = `${currentHost}api/`;

  const itemApi = "/api/item";

  function removeAccents(text) {
    return text
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D")
      .replace(/\s/g, "-")
      .replace(/[^\w\s-]/g, "");
  }

  function generateSlug(name) {
    const sku = removeAccents(name).toLowerCase();
    return sku;
  }

  const getRssData = useCallback(async () => {
    const rssLink = "https://news.yahoo.com/rss/world";
    const feedUrl = `${urlApi}rss/?feedUrl=${encodeURI(rssLink)}`;

    const response = await fetch(feedUrl);
    const result = await response.json();
    setRssData(result.rss);
  });

  useEffect(() => {
    getRssData();
    // getItemDB();
  }, []);

  const getPageContents = useCallback(async (urlPage, title) => {
    const feedUrl = `${urlApi}getPageContent/?url=${encodeURI(
      urlPage
    )}&title=${title}`;

    const response = await fetch(feedUrl);
    const result = await response.json();
    const id = generateSlug(title);
    setPageId(id);
    await addItemDB(itemApi, {
      id: id,
      slug: id,
      title: title,
      content: result,
    }).then(() => {
      router.push(`pages/${id}`);
    });
  }, []);

  const addItemDB = useCallback((url, data) => {
    return fetch(url, {
      method: "PUT",
      body: JSON.stringify(data),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });
  }, []);

  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className={utilStyles.headingMd}>
        <p>[Your Self Introduction 111]</p>
      </section>

      {rssData && (
        <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
          <h2 className={utilStyles.headingLg}>{rssData?.channel.title}</h2>
          <ul className={utilStyles.list}>
            {/* {rssData?.channel.item.map(({ guid:{ _:id}, pubDate: date, title, link }) => ( */}
            {rssData?.channel.item.map((item) => {
              const {
                guid: { _: id },
                pubDate: date,
                title,
                link,
              } = item;
              const {
                url = "",
                width = 0,
                height = 0,
              } = item?.["media:content"]?.["$"] ?? {};
              return (
                <li className={utilStyles.listItem} key={id}>
                  <div
                    className={utilStyles.left}
                    width={width}
                    height={height}
                  >
                    <img height={height} width={width} src={url} />
                  </div>
                  <div className={utilStyles.right}>
                    <Link
                      href={"#"}
                      onClick={() => getPageContents(link, title)}
                    >
                      {title}
                    </Link>
                    <br />
                    <small className={utilStyles.lightText}>
                      {date &&
                        formatDistance(new Date(date), new Date(), {
                          addSuffix: true,
                        })}
                      {/* <Date dateString={date} /> */}
                    </small>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {allPostsData && (
        <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
          <h2 className={utilStyles.headingLg}>Blog</h2>
          <ul className={utilStyles.list}>
            {allPostsData.map(({ id, date, title }) => (
              <li className={utilStyles.listItem} key={id}>
                <Link href={`/posts/${id}`}>{title}</Link>
                <br />
                <small className={utilStyles.lightText}>
                  {date}
                  {/* <Date dateString={date} /> */}
                </small>
              </li>
            ))}
          </ul>
        </section>
      )}
    </Layout>
  );
}
