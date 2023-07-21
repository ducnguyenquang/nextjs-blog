import fetch from 'node-fetch';

export default async function handler(req, res) {
  const { feedUrl } = req.query;

  try {
    const url = decodeURI(feedUrl).trim();
    console.log('==== rss feedUrl', url);
    const response = await fetch(url);
    const data = await response;
    console.log('==== rss data', data.body);

    res.setHeader('Content-Type', 'application/xml');
    // res.status(200).json(data);

    res.send(data);
  } catch (error) {
    console.error('Error fetching RSS feed:', error);
    res.status(500).json({ error: 'Failed to fetch RSS feed' });
  }
}