import fetch from 'node-fetch';
import { parseString } from 'xml2js';

export async function fetchRss(url) {
  try {
    const response = await fetch(url);
    const xmlData = await response.text();
    const rssData = await parseXml(xmlData);
    return rssData;
  } catch (error) {
    console.error('Error fetching RSS feed:', error);
    return null;
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
