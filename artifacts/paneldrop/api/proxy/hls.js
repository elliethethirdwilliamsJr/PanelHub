import { Readable } from 'stream';

export default async function handler(req, res) {
  // Get the target URL from query params
  const url = new URL(req.url, `https://${req.headers.host || 'localhost'}`);
  const targetUrl = url.searchParams.get('url');
  
  if (!targetUrl) {
    return res.status(400).json({ error: 'Missing url parameter' });
  }
  
  console.log(`HLS proxy request to:`, targetUrl);
  
  // Build forward headers
  const forwardHeaders = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    'Accept': '*/*',
  };
  
  // Forward range header for chunked requests
  if (req.headers.range) {
    forwardHeaders['Range'] = req.headers.range;
  }
  if (req.headers.referer) {
    forwardHeaders['Referer'] = req.headers.referer;
  }
  if (req.headers.origin) {
    forwardHeaders['Origin'] = req.headers.origin;
  }
  
  try {
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: forwardHeaders,
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
      // Skip content-length if compressed or M3U8 (will be rewritten)
      if (lowerKey === 'content-length' && (isCompressed || isM3U8)) continue;
      
      res.setHeader(key, value);
    }
    
    // Rewrite M3U8 playlists to proxy through Vercel
    if (isM3U8) {
      const text = await response.text();
      const proto = req.headers['x-forwarded-proto'] || 'https';
      const vercelProxyBase = `${proto}://${req.headers.host}/api/proxy/hls`;
      
      // Rewrite absolute URLs to proxy through Vercel
      const lines = text.split('\n').map(line => {
        line = line.trim();
        // If it's a URL line (not a comment)
        if (line && !line.startsWith('#')) {
          // If it's already a full URL
          if (line.startsWith('http://') || line.startsWith('https://')) {
            return `${vercelProxyBase}?url=${encodeURIComponent(line)}`;
          }
          // If it's a relative URL, resolve it relative to current URL
          else {
            const baseUrl = targetUrl.substring(0, targetUrl.lastIndexOf('/') + 1);
            const fullUrl = new URL(line, baseUrl).toString();
            return `${vercelProxyBase}?url=${encodeURIComponent(fullUrl)}`;
          }
        }
        return line;
      }).join('\n');
      
      res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');
      res.setHeader('Access-Control-Allow-Origin', '*');
      return res.send(lines);
    }
    
    // Stream video chunks
    if (response.body) {
      res.setHeader('Access-Control-Allow-Origin', '*');
      Readable.fromWeb(response.body).pipe(res);
    } else {
      res.end();
    }
  } catch (error) {
    console.error('HLS proxy error:', error.message);
    res.status(500).json({ 
      error: 'Failed to fetch HLS stream',
      message: error.message,
      target: targetUrl
    });
  }
}
