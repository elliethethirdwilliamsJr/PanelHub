const VPS_API_URL = 'http://72.62.192.15:8000';

export default async function handler(req, res) {
  // Extract path from URL, not from query params
  const urlPath = req.url.replace(/^\/api\//, '').split('?')[0];
  
  // Get query params from URL
  const url = new URL(req.url, `https://${req.headers.host}`);
  const queryString = url.searchParams.toString();
  
  const targetUrl = `${VPS_API_URL}/${urlPath}${queryString ? `?${queryString}` : ''}`;
  
  console.log('Proxying request:', {
    method: req.method,
    originalUrl: req.url,
    extractedPath: urlPath,
    queryString,
    targetUrl
  });
  
  try {
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Vercel-Proxy/1.0',
      },
      body: req.method !== 'GET' && req.method !== 'HEAD' ? JSON.stringify(req.body) : undefined,
    });
    
    console.log('Upstream response:', {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries())
    });
    
    if (!response.ok) {
      const text = await response.text();
      console.error('Upstream error body:', text);
      return res.status(response.status).json({ 
        error: `Upstream returned ${response.status}`, 
        details: text.substring(0, 500)
      });
    }
    
    const data = await response.json();
    console.log('Successfully proxied, response size:', JSON.stringify(data).length);
    res.status(200).json(data);
  } catch (error) {
    console.error('Proxy error:', {
      message: error.message,
      stack: error.stack,
      targetUrl
    });
    res.status(500).json({ 
      error: 'Failed to fetch from upstream API',
      message: error.message,
      target: targetUrl
    });
  }
}
