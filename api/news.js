export default async function handler(req, res) {
  const token = process.env.NOTION_TOKEN;
  const dbId  = process.env.NOTION_DB_ID;

  if (!token || !dbId) {
    return res.status(500).json({ error: 'Server configuration missing' });
  }

  try {
    const notionRes = await fetch(
      `https://api.notion.com/v1/databases/${dbId}/query`,
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

    const data = await notionRes.json();
    if (!notionRes.ok) return res.status(notionRes.status).json({ error: 'Notion API error', detail: data });
    return res.status(200).json(data);

  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
