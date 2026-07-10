const VPS_API_URL = 'http://72.62.192.15:8000';

export default async function handler(req, res) {
  // Extract path segments from query.slug
  const { slug = [], ...queryParams } = req.query;
  const pathSegments = Array.isArray(slug) ? slug : [slug];
  const urlPath = pathSegments.filter(Boolean).join('/');
  
  // Build query string
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(queryParams)) {
    if (Array.isArray(value)) {
      value.forEach(v => params.append(key, v));
    } else {
      params.append(key, value);
    }
  }
  const queryString = params.toString();
  
  const targetUrl = `${VPS_API_URL}/${urlPath}${queryString ? `?${queryString}` : ''}`;
  
  console.log('Proxying request:', {
    method: req.method,
    slug,
    urlPath,
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
      statusText: response.statusText
    });
    
    if (!response.ok) {
      const text = await response.text();
      console.error('Upstream error body:', text.substring(0, 500));
      return res.status(response.status).json({ 
        error: `Upstream returned ${response.status}`, 
        details: text.substring(0, 500)
      });
    }
    
    const data = await response.json();
    console.log('Successfully proxied');
    res.status(200).json(data);
  } catch (error) {
    console.error('Proxy error:', {
      message: error.message,
      targetUrl
    });
    res.status(500).json({ 
      error: 'Failed to fetch from upstream API',
      message: error.message,
      target: targetUrl
    });
  }
}
