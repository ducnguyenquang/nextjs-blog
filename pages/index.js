import Head from 'next/head'
import Layout, { siteTitle } from '../components/layout'
import utilStyles from '../styles/utils.module.css'
import { getSortedPostsData } from '../lib/posts'
import Link from 'next/link';
import Date from '../components/date';
import Parser from 'rss-parser';



// export async function getStaticProps() {
//   const allPostsData = getSortedPostsData();

//   return {
//     props: {
//       allPostsData
//     }
//   }
// }

export async function getServerSideProps({ req }) {
  const currentHost = req.headers.host || ''; // Get the host from the request headers
  const allPostsData = getSortedPostsData();

  return {
    props: {
      currentHost,
      allPostsData,
    },
  };
}

export default function Home({ allPostsData, currentHost }) {
  let parser = new Parser();
  const feedUrl = `${currentHost}/api/rss?feedUrl=https://news.yahoo.com/rss/world`;
  console.log('==== feedUrl', feedUrl);
  const getRss = (async () => {
    let feed = await parser.parseURL(feedUrl);
    console.log(feed.title);
  
    feed.items.forEach(item => {
      console.log(item.title + ':' + item.link)
    });
  
  });
  getRss();

  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className={utilStyles.headingMd}>
        <p>[Your Self Introduction 111]</p>
      </section>
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h2 className={utilStyles.headingLg}>Blog</h2>
        <ul className={utilStyles.list}>
          {allPostsData.map(({ id, date, title }) => (
            <li className={utilStyles.listItem} key={id}>
              <Link href={`/posts/${id}`}>{title}</Link>
              <br />
              <small className={utilStyles.lightText}>
                <Date dateString={date} />
              </small>
            </li>
          ))}
        </ul>
      </section>
    </Layout>
  )
}


