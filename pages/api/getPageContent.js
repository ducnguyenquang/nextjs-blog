import fetch from 'node-fetch';
import { JSDOM } from 'jsdom';
import { parseString } from 'xml2js';

export default async function handler(req, res) {
  const { url, title } = req.query;
  // console.log('==== url', url);

  try {
    // const url = decodeURI(feedUrl).trim();
    const response = await fetch(decodeURI(url).trim());
    const data = await response.text();

    const doc = new JSDOM(data);
    // const doc = parser.parseFromString(data, 'text/html');
    // Get the <body> element content
    // const body = doc.window.document.querySelector('body');
    const article = doc.window.document.querySelector("article").innerHTML;
    // console.log('==== article', article);

    res.setHeader('Content-Type', 'application/json');
    // res.send(article);

    const rssData = JSON.stringify(article);
    // const rssData = await parseXml(article);
    // console.log('==== rssData', rssData);

    res.send(rssData);
  } catch (error) {
    console.error('Error fetching RSS feed:', error);
    res.status(500).json({ error: 'Failed to fetch RSS feed' });
  }
}

function parseXml(xmlData) {
  return new Promise((resolve, reject) => {
    parseString(xmlData, { trim: true, explicitArray: false }, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
}