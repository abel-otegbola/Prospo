// Vercel Serverless Function for Hunter.io Email Finder
// This function runs server-side, keeping your API key secure

const HUNTER_API_URL = 'https://api.hunter.io/v2';

export default async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { domain, first_name, last_name } = req.query;

    // Validate required parameters
    if (!domain || !first_name || !last_name) {
      return res.status(400).json({ 
        error: 'Domain, first_name, and last_name are required' 
      });
    }

    // Get API key from environment variables
    const HUNTER_API_KEY = process.env.HUNTER_API_KEY;
    
    if (!HUNTER_API_KEY) {
      console.error('HUNTER_API_KEY not configured in environment variables');
      return res.status(500).json({ 
        error: 'API key not configured. Please add HUNTER_API_KEY to your Vercel environment variables.' 
      });
    }

    // Build query parameters
    const params = new URLSearchParams({
      domain,
      first_name,
      last_name,
      api_key: HUNTER_API_KEY,
    });

    // Call Hunter.io API
    const response = await fetch(`${HUNTER_API_URL}/email-finder?${params}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Hunter API error:', response.status, data);
      return res.status(response.status).json({
        error: data.errors?.[0]?.details || 'Failed to find email',
      });
    }

    return res.status(200).json(data);

  } catch (error) {
    console.error('Hunter email finder error:', error);
    return res.status(500).json({
      error: error.message || 'Internal server error',
    });
  }
}
