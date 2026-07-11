import { Readable } from 'stream';

const VPS_API_URL = 'http://72.62.192.15:8000';

export default async function handler(req, res) {
  // Extract path from URL (remove /api/)
  const urlPath = req.url.replace(/^\/api\/?/, '').split('?')[0];
  
  // Get query params
  const url = new URL(req.url, `https://${req.headers.host || 'localhost'}`);
  const queryString = url.searchParams.toString();
  
  const targetUrl = `${VPS_API_URL}/${urlPath}${queryString ? `?${queryString}` : ''}`;
  
  console.log(`Proxying ${req.method} request to:`, targetUrl);
  
  // Build forward headers
  const forwardHeaders = {};
  const headersToForward = [
    'range', 
    'accept', 
    'accept-language', 
    'referer', 
    'origin',
    'content-type',
    'if-none-match',
    'if-modified-since'
  ];
  
  for (const header of headersToForward) {
    if (req.headers[header]) {
      forwardHeaders[header] = req.headers[header];
    }
  }
  forwardHeaders['User-Agent'] = 'Vercel-Proxy/1.0';

  // Handle HEAD requests by proxying as GET to the upstream VPS,
  // since the VPS (FastAPI) might not support HEAD natively.
  const proxyMethod = req.method === 'HEAD' ? 'GET' : req.method;
  
  try {
    const response = await fetch(targetUrl, {
      method: proxyMethod,
      headers: forwardHeaders,
      body: req.method !== 'GET' && req.method !== 'HEAD' ? JSON.stringify(req.body) : undefined,
    });
    
    // Forward response status
    res.status(response.status);
    
    // Check if the upstream response was compressed. Node fetch auto-decompresses,
    // so we must strip the content-encoding header and content-length header
    // to prevent encoding and truncation errors in the client browser.
    const isCompressed = response.headers.has('content-encoding');
    
    // Forward response headers
    for (const [key, value] of response.headers.entries()) {
      const lowerKey = key.toLowerCase();
      if (lowerKey === 'content-encoding') continue;
      if (lowerKey === 'content-length' && isCompressed) continue;
      
      res.setHeader(key, value);
    }
    
    // If it was a HEAD request, we terminate here and don't send the body
    if (req.method === 'HEAD') {
      return res.end();
    }
    
    if (response.body) {
      Readable.fromWeb(response.body).pipe(res);
    } else {
      res.end();
    }
  } catch (error) {
    console.error('Proxy error:', error.message);
    res.status(500).json({ 
      error: 'Failed to fetch from upstream API',
      message: error.message,
      target: targetUrl
    });
  }
}
