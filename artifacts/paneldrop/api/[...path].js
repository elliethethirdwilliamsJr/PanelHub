const VPS_API_URL = 'http://72.62.192.15:8000';

export default async function handler(req, res) {
  // Extract path from URL, not from query params
  const urlPath = req.url.replace(/^\/api\//, '').split('?')[0];
  
  // Get query params from URL
  const url = new URL(req.url, `https://${req.headers.host}`);
  const queryString = url.searchParams.toString();
  
  const targetUrl = `${VPS_API_URL}/${urlPath}${queryString ? `?${queryString}` : ''}`;
  
  console.log('Proxying to:', targetUrl);
  
  try {
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Vercel-Proxy/1.0',
      },
      body: req.method !== 'GET' && req.method !== 'HEAD' ? JSON.stringify(req.body) : undefined,
    });
    
    if (!response.ok) {
      console.error('Upstream error:', response.status, response.statusText);
      const text = await response.text();
      console.error('Response body:', text);
      return res.status(response.status).json({ error: `Upstream returned ${response.status}`, details: text });
    }
    
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error('Proxy error:', error.message, error.stack);
    res.status(500).json({ 
      error: 'Failed to fetch from upstream API',
      message: error.message,
      target: targetUrl
    });
  }
}
