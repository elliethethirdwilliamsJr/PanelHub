import type { VercelRequest, VercelResponse } from '@vercel/node';

const VPS_API_URL = 'http://72.62.192.15:8000';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { path } = req.query;
  const pathArray = Array.isArray(path) ? path : [path];
  const fullPath = pathArray.join('/');
  
  // Build the full URL with query params
  const queryString = new URLSearchParams(req.query as Record<string, string>).toString();
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
