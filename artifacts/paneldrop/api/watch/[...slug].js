const https = require('http');

module.exports = async (req, res) => {
  // Vercel passes catch-all segments as req.query.slug array
  const { slug } = req.query;
  const path = Array.isArray(slug) ? slug.join('/') : slug || '';
  
  const targetUrl = `http://72.62.192.15:8000/watch/${path}`;

  const options = {
    method: req.method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const proxyReq = https.request(targetUrl, options, (proxyRes) => {
    res.status(proxyRes.statusCode);
    
    // Forward headers
    Object.keys(proxyRes.headers).forEach((key) => {
      res.setHeader(key, proxyRes.headers[key]);
    });

    let body = '';
    proxyRes.on('data', (chunk) => {
      body += chunk;
    });

    proxyRes.on('end', () => {
      res.send(body);
    });
  });

  proxyReq.on('error', (error) => {
    console.error('Proxy error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch from upstream API',
      message: error.message,
      target: targetUrl
    });
  });

  proxyReq.end();
};
