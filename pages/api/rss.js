import fetch from 'node-fetch';
import { parseString } from 'xml2js';

export default async function handler(req, res) {
  const { feedUrl } = req.query;

  try {
    const url = decodeURI(feedUrl).trim();
    const response = await fetch(url);
    const data = await response.text();
    res.setHeader('Content-Type', 'application/xml');
    const rssData = await parseXml(data);
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