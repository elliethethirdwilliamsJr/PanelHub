const VPS_API_URL = 'http://72.62.192.15:8000';

export default async function handler(req, res) {
  const { path } = req.query;
  const pathArray = Array.isArray(path) ? path : [path];
  const fullPath = pathArray.join('/');
  
  // Build query string excluding the 'path' parameter
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(req.query)) {
    if (key !== 'path') {
      params.append(key, value);
    }
  }
  const queryString = params.toString();
  const targetUrl = `${VPS_API_URL}/${fullPath}${queryString ? `?${queryString}` : ''}`;
  
  try {
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: req.method !== 'GET' && req.method !== 'HEAD' ? JSON.stringify(req.body) : undefined,
    });
    
    const data = await response.json();
    
    // Forward the status and response
    res.status(response.status).json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: 'Failed to fetch from upstream API' });
  }
}
