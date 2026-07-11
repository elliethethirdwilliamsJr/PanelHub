const https = require('http');

module.exports = async (req, res) => {
  // Extract query string
  const queryString = req.url.split('?')[1] || '';
  
  const targetUrl = `http://72.62.192.15:8000/sources?${queryString}`;

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
      // If upstream returns 444, return error with details
      if (proxyRes.statusCode === 444) {
        res.status(444).json({
          error: 'Upstream service unavailable',
          detail: 'The video source provider returned a 444 error',
          statusCode: 444
        });
      } else {
        res.send(body);
      }
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
