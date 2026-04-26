// Vercel Serverless Function for Hunter.io Domain Search
// This function runs server-side, keeping your API key secure

const HUNTER_API_URL = 'https://api.hunter.io/v2';

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { domain, job_titles, department, seniority, limit = 25 } = req.body;

    // Validate required parameters
    if (!domain) {
      return res.status(400).json({ error: 'Domain is required' });
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
      domain: domain.replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0], // Clean domain
      api_key: HUNTER_API_KEY,
      limit: limit.toString(),
    });

    if (job_titles) params.append('job_titles', job_titles);
    if (department) params.append('department', department);
    if (seniority) params.append('seniority', seniority);

    // Call Hunter.io API
    const response = await fetch(`${HUNTER_API_URL}/domain-search?${params}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Hunter API error:', response.status, data);
      return res.status(response.status).json({
        error: data.errors?.[0]?.details || JSON.stringify(data) || 'Failed to search leads',
      });
    }

    console.log('Hunter search success:', data.data?.emails?.length || 0, 'contacts found');
    return res.status(200).json(data);

  } catch (error) {
    console.error('Hunter search error:', error);
    return res.status(500).json({
      error: error.message || 'Internal server error',
    });
  }
}
