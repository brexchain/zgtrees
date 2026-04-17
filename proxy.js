export default async function handler(req, res) {
  // === OBAVEZNA CORS ZAGLAVLJA ===
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Max-Age', '86400');

  // Preflight zahtjev (OPTIONS)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const targetUrl = req.query.url;

  if (!targetUrl || !targetUrl.startsWith('https://geoportal.zagreb.hr')) {
    return res.status(400).json({ error: 'Nedostaje ili neispravan ?url=' });
  }

  try {
    const response = await fetch(targetUrl);
    const data = await response.text();

    res.setHeader('Content-Type', response.headers.get('content-type') || 'application/json');
    return res.status(response.status).send(data);
  } catch (err) {
    return res.status(502).json({ error: err.message });
  }
}