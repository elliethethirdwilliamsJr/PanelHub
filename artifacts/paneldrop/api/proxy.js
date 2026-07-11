const VPS_API_URL = 'http://72.62.192.15:8000';

export default async function handler(req, res) {
  // Extract path from URL (remove /api/)
  const urlPath = req.url.replace(/^\/api\/?/, '').split('?')[0];
  
  // Get query params
  const url = new URL(req.url, `https://${req.headers.host || 'localhost'}`);
  const queryString = url.searchParams.toString();
  
  const targetUrl = `${VPS_API_URL}/${urlPath}${queryString ? `?${queryString}` : ''}`;
  
  console.log('Proxying:', targetUrl);
  
  try {
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Vercel-Proxy/1.0',
      },
      body: req.method !== 'GET' && req.method !== 'HEAD' ? JSON.stringify(req.body) : undefined,
    });
    
    // Special check for sources endpoint if it returns 444
    if (urlPath === 'sources' && response.status === 444) {
      return res.status(444).json({
        error: 'Upstream service unavailable',
        detail: 'The video source provider returned a 444 error',
        statusCode: 444
      });
    }
    
    if (!response.ok) {
      const text = await response.text();
      console.error('Upstream error:', response.status, text.substring(0, 200));
      return res.status(response.status).json({ 
        error: `Upstream returned ${response.status}`, 
        details: text.substring(0, 200)
      });
    }
    
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('Proxy error:', error.message);
    res.status(500).json({ 
      error: 'Failed to fetch from upstream API',
      message: error.message,
      target: targetUrl
    });
  }
}
