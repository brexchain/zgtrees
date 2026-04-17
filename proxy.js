module.exports = async (req, res) => {
  // CORS zaglavlja
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Max-Age', '86400');

  // Preflight (OPTIONS) zahtjev
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Dohvati ciljani URL iz ?url=...
  const targetUrl = req.query.url;

  if (!targetUrl) {
    return res.status(400).json({ error: 'Nedostaje ?url= parametar' });
  }

  // Sigurnosna provjera – samo Zagreb geoportal
  if (!targetUrl.startsWith('https://geoportal.zagreb.hr')) {
    return res.status(403).json({ error: 'Dozvoljen je samo geoportal.zagreb.hr' });
  }

  try {
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: {
        ...req.headers,
        host: new URL(targetUrl).host, // važno za ArcGIS
      },
    });

    const data = await response.text();
    res.setHeader('Content-Type', response.headers.get('content-type') || 'application/json');
    return res.status(response.status).send(data);
  } catch (err) {
    return res.status(502).json({ error: 'Greška pri dohvaćanju: ' + err.message });
  }
};