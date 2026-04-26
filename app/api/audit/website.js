// Vercel Serverless Function for Website Auditing
// This performs a comprehensive website audit including performance, SEO, design, and technical issues

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
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'Website URL is required' });
    }

    // Clean and validate URL
    let websiteUrl = url.trim();
    if (!websiteUrl.startsWith('http://') && !websiteUrl.startsWith('https://')) {
      websiteUrl = 'https://' + websiteUrl;
    }

    console.log('Auditing website:', websiteUrl);

    // Perform basic fetch to check if site is accessible
    const startTime = Date.now();
    const response = await fetch(websiteUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      redirect: 'follow',
      signal: AbortSignal.timeout(10000) // 10 second timeout
    });

    const loadTime = (Date.now() - startTime) / 1000; // Convert to seconds
    const html = await response.text();
    const contentLength = Buffer.byteLength(html, 'utf8');
    const pageSize = Math.round(contentLength / 1024); // Convert to KB

    // Analyze HTML content
    const auditResults = analyzeWebsite(html, websiteUrl);

    // Calculate scores
    const performanceScore = calculatePerformanceScore(loadTime, pageSize);
    const seoScore = calculateSEOScore(html, auditResults);
    const designScore = calculateDesignScore(html);
    const mobileScore = calculateMobileScore(html);

    return res.status(200).json({
      success: true,
      audit: {
        performanceScore,
        seoScore,
        designScore,
        mobileScore,
        brokenLinks: auditResults.brokenLinks,
        seoIssues: auditResults.seoIssues,
        techStack: auditResults.techStack,
        isOutdatedTech: auditResults.isOutdatedTech,
        loadTime: parseFloat(loadTime.toFixed(2)),
        pageSize,
        lastAudited: new Date().toISOString(),
        auditStatus: 'completed'
      }
    });

  } catch (error) {
    console.error('Website audit error:', error);
    
    return res.status(200).json({
      success: false,
      audit: {
        performanceScore: 0,
        seoScore: 0,
        designScore: 0,
        mobileScore: 0,
        brokenLinks: 0,
        seoIssues: ['Unable to access website'],
        techStack: [],
        isOutdatedTech: false,
        loadTime: 0,
        pageSize: 0,
        lastAudited: new Date().toISOString(),
        auditStatus: 'failed'
      },
      error: error.message
    });
  }
}

function analyzeWebsite(html, url) {
  const seoIssues = [];
  const techStack = [];
  let isOutdatedTech = false;

  // Check for title
  if (!/<title>/i.test(html)) {
    seoIssues.push('Missing page title');
  }

  // Check for meta description
  if (!/<meta[^>]*name=["']description["']/i.test(html)) {
    seoIssues.push('Missing meta description');
  }

  // Check for h1 tag
  if (!/<h1/i.test(html)) {
    seoIssues.push('Missing H1 heading');
  }

  // Check for meta viewport (mobile)
  if (!/<meta[^>]*name=["']viewport["']/i.test(html)) {
    seoIssues.push('Missing viewport meta tag');
  }

  // Check for alt tags on images
  const imgWithoutAlt = (html.match(/<img(?![^>]*alt=)/gi) || []).length;
  if (imgWithoutAlt > 0) {
    seoIssues.push(`${imgWithoutAlt} images missing alt text`);
  }

  // Detect tech stack
  if (/react/i.test(html) || /__NEXT_DATA__/i.test(html)) {
    techStack.push('React');
  }
  if (/__NEXT_DATA__/i.test(html)) {
    techStack.push('Next.js');
  }
  if (/vue/i.test(html)) {
    techStack.push('Vue.js');
  }
  if (/angular/i.test(html)) {
    techStack.push('Angular');
  }
  if (/wp-content|wordpress/i.test(html)) {
    techStack.push('WordPress');
  }
  if (/jquery/i.test(html)) {
    techStack.push('jQuery');
    isOutdatedTech = true; // jQuery alone can indicate older site
  }

  // Check for outdated patterns
  if (/<font/i.test(html) || /<center/i.test(html)) {
    isOutdatedTech = true;
    seoIssues.push('Using deprecated HTML tags');
  }

  // Check for HTTPS
  if (url.startsWith('http://')) {
    seoIssues.push('Not using HTTPS (security risk)');
  }

  // Check for broken links (basic check for empty hrefs)
  const brokenLinks = (html.match(/href=["']["']|href=["']#["']/gi) || []).length;

  return {
    seoIssues,
    techStack: techStack.length > 0 ? techStack : ['Unknown'],
    isOutdatedTech,
    brokenLinks
  };
}

function calculatePerformanceScore(loadTime, pageSize) {
  let score = 100;

  // Penalize slow load times
  if (loadTime > 5) score -= 40;
  else if (loadTime > 3) score -= 25;
  else if (loadTime > 2) score -= 15;
  else if (loadTime > 1) score -= 5;

  // Penalize large page sizes
  if (pageSize > 5000) score -= 30; // > 5MB
  else if (pageSize > 3000) score -= 20; // > 3MB
  else if (pageSize > 1500) score -= 10; // > 1.5MB

  return Math.max(0, Math.min(100, score));
}

function calculateSEOScore(html, auditResults) {
  let score = 100;
  
  // Deduct points for each SEO issue
  score -= auditResults.seoIssues.length * 10;

  // Bonus for good practices
  if (/<meta[^>]*property=["']og:/i.test(html)) score += 5; // Open Graph tags
  if (/<link[^>]*rel=["']canonical["']/i.test(html)) score += 5; // Canonical URL
  if (/<script[^>]*type=["']application\/ld\+json["']/i.test(html)) score += 5; // Schema markup

  return Math.max(0, Math.min(100, score));
}

function calculateDesignScore(html) {
  let score = 50; // Start neutral

  // Check for modern design indicators
  if (/<link[^>]*tailwind|bootstrap|bulma/i.test(html)) score += 15;
  if (/<svg/i.test(html)) score += 10; // Uses SVG icons
  if (/flex|grid/i.test(html)) score += 10; // Modern CSS
  if (/@media/i.test(html)) score += 10; // Responsive design
  if (/<button|<input/i.test(html)) score += 5; // Interactive elements

  // Check for outdated design patterns
  if (/<table[^>]*border/i.test(html)) score -= 20; // Table-based layout
  if (/<marquee|<blink/i.test(html)) score -= 30; // Very outdated
  if (/<font/i.test(html)) score -= 15; // Inline font tags

  return Math.max(0, Math.min(100, score));
}

function calculateMobileScore(html) {
  let score = 100;

  // Check for viewport meta tag
  if (!/<meta[^>]*name=["']viewport["']/i.test(html)) score -= 40;

  // Check for responsive indicators
  if (!/@media/i.test(html)) score -= 20; // No media queries
  if (/<table[^>]*width=["']\d{3,}/i.test(html)) score -= 15; // Fixed-width tables

  // Bonus for mobile-friendly indicators
  if (/mobile|responsive/i.test(html)) score += 5;

  return Math.max(0, Math.min(100, score));
}
