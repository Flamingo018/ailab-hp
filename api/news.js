const DB_ID = '6dbfb8210ab542539384685598d4c79b';

export default async function handler(req, res) {
  const token = req.query.token;
  if (!token) {
    return res.status(400).json({ error: 'token is required' });
  }

  try {
    const notionRes = await fetch(
      `https://api.notion.com/v1/databases/${DB_ID}/query`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Notion-Version': '2022-06-28',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filter: { property: 'Published', checkbox: { equals: true } },
          sorts: [{ property: 'Date', direction: 'descending' }],
        }),
      }
    );

    if (notionRes.status === 401) return res.status(401).json({ error: 'Unauthorized' });
    if (notionRes.status === 403) return res.status(403).json({ error: 'Forbidden' });
    if (!notionRes.ok) return res.status(notionRes.status).json({ error: 'Notion API error' });

    const data = await notionRes.json();
    return res.status(200).json(data);

  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
