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
    
    const contentType = response.headers.get('content-type') || '';
    const isM3U8 = contentType.toLowerCase().includes('mpegurl') || targetUrl.split('?')[0].endsWith('.m3u8');
    const isCompressed = response.headers.has('content-encoding');
    
    // Forward response headers
    for (const [key, value] of response.headers.entries()) {
      const lowerKey = key.toLowerCase();
      if (lowerKey === 'content-encoding') continue;
      // We must not forward the content-length if:
      // 1. The response was compressed (fetch decompressed it, changing the length).
      // 2. The response is an M3U8 file (which we will rewrite, changing the length).
      if (lowerKey === 'content-length' && (isCompressed || isM3U8)) continue;
      
      res.setHeader(key, value);
    }
    
    // If it was a HEAD request, we terminate here and don't send the body
    if (req.method === 'HEAD') {
      return res.end();
    }
    
    // Intercept and rewrite M3U8 playlist URLs to ensure browser fetches chunks
    // via HTTPS Vercel proxy instead of insecure HTTP VPS directly (prevents Mixed Content blocks).
    if (isM3U8) {
      const text = await response.text();
      const proto = req.headers['x-forwarded-proto'] || (req.socket.encrypted ? 'https' : 'http');
      const vercelProxyBase = `${proto}://${req.headers.host}/api/proxy/hls`;
      
      const rewrittenText = text
        .replaceAll('http://72.62.192.15:8000/proxy/hls', vercelProxyBase)
        .replaceAll('https://72.62.192.15:8000/proxy/hls', vercelProxyBase);
      
      res.setHeader('Content-Type', contentType || 'application/vnd.apple.mpegurl');
      return res.send(rewrittenText);
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
