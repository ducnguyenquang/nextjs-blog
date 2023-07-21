import fetch from 'node-fetch';

export default async function handler(req, res) {
  const { feedUrl } = req.query;

  try {
    const response = await fetch(feedUrl);
    const data = await response.text();

    res.setHeader('Content-Type', 'application/xml');
    res.send(data);
  } catch (error) {
    console.error('Error fetching RSS feed:', error);
    res.status(500).json({ error: 'Failed to fetch RSS feed' });
  }
}