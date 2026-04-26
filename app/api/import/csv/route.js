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

function parseCSVLine(line) {
  const values = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      values.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }

  values.push(current.trim());
  return values;
}

function cleanWebsite(url) {
  if (!url) return "";
  let cleaned = url.trim();
  if (cleaned && !cleaned.startsWith("http://") && !cleaned.startsWith("https://")) {
    cleaned = `https://${cleaned}`;
  }
  return cleaned;
}

function parseServiceNeeds(needsString) {
  if (!needsString) return ["Website Design", "SEO Optimization"];
  const needs = needsString
    .split(/[,;|]/)
    .map((n) => n.trim())
    .filter(Boolean);
  return needs.length > 0 ? needs : ["Website Design", "SEO Optimization"];
}

function parseCSV(csvText) {
  const lines = csvText.split("\n").filter((line) => line.trim());
  if (lines.length === 0) return [];

  const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
  const businesses = [];

  for (let i = 1; i < lines.length; i += 1) {
    const values = parseCSVLine(lines[i]);
    if (values.length !== headers.length) continue;

    const row = {};
    headers.forEach((header, index) => {
      row[header] = values[index];
    });

    businesses.push({
      name: row.name || row.contact || row["contact name"] || "Unknown",
      company: row.company || row.business || row["business name"] || "Unknown Company",
      email: row.email || row["email address"] || "",
      phone: row.phone || row.telephone || row["phone number"] || "",
      location: row.location || row.city || row.address || row.state || "Unknown",
      companyWebsite: cleanWebsite(row.website || row.url || row["company website"] || ""),
      industry: row.industry || row.category || row.type || "Other",
      score: Number.parseInt(row.score, 10) || Math.floor(Math.random() * 40) + 60,
      serviceNeeds: parseServiceNeeds(row.services || row.needs || row["service needs"] || ""),
      value:
        Number.parseInt(row.value, 10) ||
        Number.parseInt(row.budget, 10) ||
        Math.floor(Math.random() * 15000) + 5000,
    });
  }

  return businesses;
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: CORS_HEADERS });
}

export async function POST(request) {
  try {
    const { csvData } = (await request.json().catch(() => ({}))) || {};
    if (!csvData) {
      return json({ error: "CSV data is required" }, 400);
    }

    const businesses = parseCSV(csvData);
    return json({ success: true, businesses, total: businesses.length }, 200);
  } catch (error) {
    return json(
      {
        error: "Failed to import CSV",
        message: error?.message,
      },
      500,
    );
  }
}
