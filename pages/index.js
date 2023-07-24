import Head from 'next/head'
import Layout, { siteTitle } from '../components/layout'
import utilStyles from '../styles/utils.module.css'
import { getSortedPostsData } from '../lib/posts'
import Link from 'next/link';
// import Date from '../components/date';
// import Parser from 'rss-parser';
import { formatDistance, subDays } from 'date-fns'
import React, { useState , useEffect, useCallback } from 'react';
// import { fetchRss } from '../utils/rss';
// export async function getStaticProps() {
//   const allPostsData = getSortedPostsData();

//   return {
//     props: {
//       allPostsData
//     }
//   }
// }

export async function getServerSideProps({ req }) {
  const currentHost = req.headers.referer || ''; 
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
  const [rssData, setRssData] = useState(null);

  const rssLink = 'https://news.yahoo.com/rss/world';
  const feedUrl = `${currentHost}api/rss/?feedUrl=${encodeURI(rssLink)}`;

  const getRssData = useCallback(async () => {
    const response = await fetch(feedUrl);
    const result = await response.json();
    setRssData(result.rss);
  })

  useEffect(() => {
    getRssData();
  }, []);

  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className={utilStyles.headingMd}>
        <p>[Your Self Introduction 111]</p>
      </section>

      {rssData && <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h2 className={utilStyles.headingLg}>{rssData?.channel.title}</h2>
        <ul className={utilStyles.list}>
          {/* {rssData?.channel.item.map(({ guid:{ _:id}, pubDate: date, title, link }) => ( */}
          {rssData?.channel.item.map((item) => {
            const { guid:{ _:id}, pubDate: date, title, link } = item;
            const { url = '', width = 0, height = 0 } = item?.['media:content']?.['$'] ?? {}
            // console.log("==== item['media:content']", item['media:content']);
            return <li className={utilStyles.listItem} key={id}>
              <div className={utilStyles.left} width={width} height={height}>
                <img height={height} width={width} src={url}/>
              </div>
              <div className={utilStyles.right}>
                <Link href={link}>{title}</Link>
                <br />
                <small className={utilStyles.lightText}>
                  {date && formatDistance(new Date(date), new Date(), { addSuffix: true })}
                  {/* <Date dateString={date} /> */}
                </small>
              </div>
              
            </li>
          })}
        </ul>
      </section>}

      {allPostsData && <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
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
      </section>}
    </Layout>
  )
}


