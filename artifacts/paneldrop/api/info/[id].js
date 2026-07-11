const VPS_API_URL = 'http://72.62.192.15:8000';

export default async function handler(req, res) {
  const { id } = req.query;
  
  const targetUrl = `${VPS_API_URL}/info/${id}`;
  
  console.log('Info endpoint proxying to:', targetUrl);
  
  try {
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Vercel-Proxy/1.0',
      },
    });
    
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
    console.error('Info proxy error:', error.message);
    res.status(500).json({ 
      error: 'Failed to fetch from upstream API',
      message: error.message,
      target: targetUrl
    });
  }
}