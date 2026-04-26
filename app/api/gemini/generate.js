// api/generateEmail.js

export default async function handler(req, res) {
  
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  const { lead, companyInsights } = req.body || {};

  if (!lead)
    return res.status(400).json({ error: 'Missing lead in request body' });

  const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
  const model = 'gemini-2.5-flash';

  if (!apiKey)
    return res.status(500).json({ error: 'Missing GOOGLE_GEMINI_API_KEY env variable' });

  const parseRetryDelaySeconds = (errorBody) => {
    const retry = errorBody?.error?.details?.find((d) => d?.['@type']?.includes('RetryInfo'));
    const retryDelay = retry?.retryDelay;
    if (!retryDelay || typeof retryDelay !== 'string') return null;
    const value = parseInt(retryDelay.replace('s', ''), 10);
    return Number.isNaN(value) ? null : value;
  };

  const buildFallbackOutreach = (leadData) => {
    const name = leadData?.name || 'there';
    const company = leadData?.company || 'your team';
    const issue = leadData?.notes || 'some friction in the current user journey';

    return `Subject: Quick user note for ${company}\n\nHi ${name},\n\nI use products like yours and noticed ${issue}. From a user perspective, this can create confusion and make it harder to trust what to do next.\n\nIs this something your team is currently looking at, or am I missing context on how it is meant to work?`;
  };

  // Build first-touch prompt focused on reply generation from a user perspective
  // Create a readable lead summary. If `lead` is an object, include important fields
  const leadSummary = (typeof lead === 'string')
    ? lead
    : `Name: ${lead.name || ''}\nCompany: ${lead.company || ''}\nWebsite: ${lead.companyWebsite || ''}\nNotes: ${lead.notes || ''}\nWebsiteAudit: ${typeof lead.websiteAudit === 'string' ? lead.websiteAudit : JSON.stringify(lead.websiteAudit || {}, null, 2)}`;

  const insightsSummary = companyInsights
    ? `\n\nCompany Research Insights:\n${JSON.stringify(companyInsights, null, 2)}`
    : '';

  if (process.env.DEBUG_GEMINI) console.log('Lead summary for prompt:', leadSummary);

  const prompt = `
    You are writing the FIRST outreach message to start a reply, not to sell services.
    Write as a concerned user/customer of their product, not as a freelancer, consultant, agency, or vendor.

    Write a SHORT, personalized outreach email with this structure:

    Subject Line: ONE natural subject line (4-8 words) that sounds like customer feedback.

    Email Body (3-4 sentences ONLY):
    1. Context: Mention one specific thing you noticed on their site/product.
    2. User Impact: Explain how this issue affects a real user workflow or trust.
    3. Clarifying Question: Ask one sincere, low-pressure question that invites a reply.
    4. Optional: Add one short sentence showing interest in their project direction.

    CRITICAL RULES:
    - Keep it under 90 words total
    - NO fluff or corporate jargon
    - Be conversational, specific, and respectful
    - Focus on user impact and product experience
    - Do NOT pitch services, solutions, deliverables, pricing, or meetings
    - Do NOT use freelancer/agency language (for example: "I can help", "I offer", "my services", "my agency")
    - End with a low-pressure question that is easy to answer
    - Do NOT use phrases like "I hope this email finds you well" or "I wanted to reach out"

    Lead details:
    ${leadSummary}${insightsSummary}
    `;

  try {
    // Gemini REST API endpoint
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }]
            }
          ]
        })
      }
    );

    // Try to parse body safely and provide detailed errors for debugging
    let data;
    const rawText = await response.text();
    try {
      data = rawText ? JSON.parse(rawText) : null;
    } catch (parseErr) {
      // If parsing fails, include the raw body in the error
      console.error('Failed to parse Gemini response JSON', parseErr, rawText);
      return res.status(502).json({
        error: 'Failed to parse Gemini response JSON',
        status: response.status,
        statusText: response.statusText,
        rawBody: rawText
      });
    }

    if (!response.ok) {
      if (response.status === 429) {
        const retryAfter = parseRetryDelaySeconds(data);
        return res.status(200).json({
          text: buildFallbackOutreach(lead),
          fallback: true,
          reason: 'quota_exceeded',
          retryAfterSeconds: retryAfter
        });
      }
      console.error('Gemini API returned non-OK status', response.status, response.statusText, data);
      return res.status(502).json({
        error: 'Gemini API returned non-OK status',
        status: response.status,
        statusText: response.statusText,
        body: data
      });
    }

    // Validate expected shape
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      console.error('Invalid AI response shape', data);
      return res.status(502).json({ error: 'Invalid AI response shape', body: data });
    }

    return res.status(200).json({ text });
  } catch (err) {
    console.error("Gemini generation error:", err && err.message ? err.message : err, err && err.stack ? err.stack : err);
    return res.status(500).json({
      error: 'Generation failed',
      message: err && err.message ? err.message : String(err),
      stack: err && err.stack ? err.stack : undefined
    });
  }
}

