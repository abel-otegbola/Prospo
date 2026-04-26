import { NextResponse } from "next/server";

const CORS_HEADERS = {
  "Access-Control-Allow-Credentials": "true",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function json(data, status = 200) {
  return NextResponse.json(data, { status, headers: CORS_HEADERS });
}

function analyzeWebsite(html, url) {
  const seoIssues = [];
  const techStack = [];
  let isOutdatedTech = false;

  if (!/<title>/i.test(html)) seoIssues.push("Missing page title");
  if (!/<meta[^>]*name=["']description["']/i.test(html)) seoIssues.push("Missing meta description");
  if (!/<h1/i.test(html)) seoIssues.push("Missing H1 heading");
  if (!/<meta[^>]*name=["']viewport["']/i.test(html)) seoIssues.push("Missing viewport meta tag");

  const imgWithoutAlt = (html.match(/<img(?![^>]*alt=)/gi) || []).length;
  if (imgWithoutAlt > 0) {
    seoIssues.push(`${imgWithoutAlt} images missing alt text`);
  }

  if (/react/i.test(html) || /__NEXT_DATA__/i.test(html)) techStack.push("React");
  if (/__NEXT_DATA__/i.test(html)) techStack.push("Next.js");
  if (/vue/i.test(html)) techStack.push("Vue.js");
  if (/angular/i.test(html)) techStack.push("Angular");
  if (/wp-content|wordpress/i.test(html)) techStack.push("WordPress");
  if (/jquery/i.test(html)) {
    techStack.push("jQuery");
    isOutdatedTech = true;
  }

  if (/<font/i.test(html) || /<center/i.test(html)) {
    isOutdatedTech = true;
    seoIssues.push("Using deprecated HTML tags");
  }

  if (url.startsWith("http://")) {
    seoIssues.push("Not using HTTPS (security risk)");
  }

  const brokenLinks = (html.match(/href=["']["']|href=["']#["']/gi) || []).length;

  return {
    seoIssues,
    techStack: techStack.length > 0 ? techStack : ["Unknown"],
    isOutdatedTech,
    brokenLinks,
  };
}

function calculatePerformanceScore(loadTime, pageSize) {
  let score = 100;
  if (loadTime > 5) score -= 40;
  else if (loadTime > 3) score -= 25;
  else if (loadTime > 2) score -= 15;
  else if (loadTime > 1) score -= 5;

  if (pageSize > 5000) score -= 30;
  else if (pageSize > 3000) score -= 20;
  else if (pageSize > 1500) score -= 10;

  return Math.max(0, Math.min(100, score));
}

function calculateSEOScore(html, auditResults) {
  let score = 100;
  score -= auditResults.seoIssues.length * 10;
  if (/<meta[^>]*property=["']og:/i.test(html)) score += 5;
  if (/<link[^>]*rel=["']canonical["']/i.test(html)) score += 5;
  if (/<script[^>]*type=["']application\/ld\+json["']/i.test(html)) score += 5;
  return Math.max(0, Math.min(100, score));
}

function calculateDesignScore(html) {
  let score = 50;
  if (/<link[^>]*tailwind|bootstrap|bulma/i.test(html)) score += 15;
  if (/<svg/i.test(html)) score += 10;
  if (/flex|grid/i.test(html)) score += 10;
  if (/@media/i.test(html)) score += 10;
  if (/<button|<input/i.test(html)) score += 5;
  if (/<table[^>]*border/i.test(html)) score -= 20;
  if (/<marquee|<blink/i.test(html)) score -= 30;
  if (/<font/i.test(html)) score -= 15;
  return Math.max(0, Math.min(100, score));
}

function calculateMobileScore(html) {
  let score = 100;
  if (!/<meta[^>]*name=["']viewport["']/i.test(html)) score -= 40;
  if (!/@media/i.test(html)) score -= 20;
  if (/<table[^>]*width=["']\d{3,}/i.test(html)) score -= 15;
  if (/mobile|responsive/i.test(html)) score += 5;
  return Math.max(0, Math.min(100, score));
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: CORS_HEADERS });
}

export async function POST(request) {
  try {
    const { url } = (await request.json().catch(() => ({}))) || {};
    if (!url) {
      return json({ error: "Website URL is required" }, 400);
    }

    let websiteUrl = url.trim();
    if (!websiteUrl.startsWith("http://") && !websiteUrl.startsWith("https://")) {
      websiteUrl = `https://${websiteUrl}`;
    }

    const startTime = Date.now();
    const response = await fetch(websiteUrl, {
      method: "GET",
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
      redirect: "follow",
      signal: AbortSignal.timeout(10000),
    });

    const loadTime = (Date.now() - startTime) / 1000;
    const html = await response.text();
    const contentLength = Buffer.byteLength(html, "utf8");
    const pageSize = Math.round(contentLength / 1024);

    const auditResults = analyzeWebsite(html, websiteUrl);
    const performanceScore = calculatePerformanceScore(loadTime, pageSize);
    const seoScore = calculateSEOScore(html, auditResults);
    const designScore = calculateDesignScore(html);
    const mobileScore = calculateMobileScore(html);

    return json(
      {
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
          loadTime: Number.parseFloat(loadTime.toFixed(2)),
          pageSize,
          lastAudited: new Date().toISOString(),
          auditStatus: "completed",
        },
      },
      200,
    );
  } catch (error) {
    return json(
      {
        success: false,
        audit: {
          performanceScore: 0,
          seoScore: 0,
          designScore: 0,
          mobileScore: 0,
          brokenLinks: 0,
          seoIssues: ["Unable to access website"],
          techStack: [],
          isOutdatedTech: false,
          loadTime: 0,
          pageSize: 0,
          lastAudited: new Date().toISOString(),
          auditStatus: "failed",
        },
        error: error?.message,
      },
      200,
    );
  }
}
