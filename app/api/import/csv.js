// Vercel Serverless Function for CSV Import
// Upload CSV file with business data

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '4mb',
    },
  },
};

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { csvData } = req.body;

    if (!csvData) {
      return res.status(400).json({ error: 'CSV data is required' });
    }

    // Parse CSV data
    const businesses = parseCSV(csvData);

    return res.status(200).json({
      success: true,
      businesses,
      total: businesses.length
    });

  } catch (error) {
    console.error('CSV import error:', error);
    return res.status(500).json({ 
      error: 'Failed to import CSV',
      message: error.message 
    });
  }
}

function parseCSV(csvText) {
  const lines = csvText.split('\n').filter(line => line.trim());
  
  if (lines.length === 0) {
    return [];
  }

  // Get headers
  const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
  
  // Parse rows
  const businesses = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    
    if (values.length !== headers.length) {
      console.warn(`Row ${i} has ${values.length} values but expected ${headers.length}`);
      continue;
    }

    const row = {};
    headers.forEach((header, index) => {
      row[header] = values[index];
    });

    // Map CSV columns to our business structure
    const business = {
      name: row.name || row.contact || row['contact name'] || 'Unknown',
      company: row.company || row.business || row['business name'] || 'Unknown Company',
      email: row.email || row['email address'] || '',
      phone: row.phone || row.telephone || row['phone number'] || '',
      location: row.location || row.city || row.address || row.state || 'Unknown',
      companyWebsite: cleanWebsite(row.website || row.url || row['company website'] || ''),
      industry: row.industry || row.category || row.type || 'Other',
      score: parseInt(row.score) || Math.floor(Math.random() * 40) + 60,
      serviceNeeds: parseServiceNeeds(row.services || row.needs || row['service needs'] || ''),
      value: parseInt(row.value) || parseInt(row.budget) || Math.floor(Math.random() * 15000) + 5000
    };

    businesses.push(business);
  }

  return businesses;
}

function parseCSVLine(line) {
  const values = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      values.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  values.push(current.trim());
  return values;
}

function cleanWebsite(url) {
  if (!url) return '';
  
  url = url.trim();
  
  // Add https:// if no protocol
  if (url && !url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'https://' + url;
  }

  return url;
}

function parseServiceNeeds(needsString) {
  if (!needsString) return ['Website Design', 'SEO Optimization'];
  
  // Split by common delimiters
  const needs = needsString.split(/[,;|]/).map(n => n.trim()).filter(n => n);
  
  return needs.length > 0 ? needs : ['Website Design', 'SEO Optimization'];
}
