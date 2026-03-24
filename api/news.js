const DB_ID = '4505f7875598469fbc7eb75a4529c271';

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

    const data = await notionRes.json();

    // ステータスとレスポンス全体をログに出す
    console.log('Notion status:', notionRes.status);
    console.log('Notion response:', JSON.stringify(data));

    if (!notionRes.ok) {
      return res.status(notionRes.status).json({ 
        error: 'Notion API error', 
        status: notionRes.status,
        detail: data 
      });
    }

    return res.status(200).json(data);

  } catch (e) {
    console.log('Exception:', e.message);
    return res.status(500).json({ error: e.message });
  }
}
