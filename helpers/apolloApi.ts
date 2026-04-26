// Hunter.io API Integration (via Vercel Serverless Functions)
// API Documentation: https://hunter.io/api-documentation/v2

// In Next.js, use same-origin API routes by default.
const PROXY_API_URL = process.env.NEXT_PUBLIC_PROXY_API_URL || '/api/apollo';

export interface HunterContact {
  value: string; // email
  type: 'personal' | 'generic';
  confidence: number;
  first_name: string;
  last_name: string;
  position: string | null;
  seniority: string | null;
  department: string | null;
  linkedin: string | null;
  twitter: string | null;
  phone_number: string | null;
  verification: {
    date: string | null;
    status: 'valid' | 'invalid' | 'accept_all' | 'webmail' | 'disposable' | 'unknown';
  } | null;
}

export interface HunterOrganization {
  domain: string;
  disposable: boolean;
  webmail: boolean;
  accept_all: boolean;
  pattern: string | null;
  organization: string;
}

export interface HunterSearchResponse {
  data: HunterOrganization & {
    emails: HunterContact[];
  };
  meta: {
    results: number;
    limit: number;
    offset: number;
    params: Record<string, unknown>;
  };
}



/**
 * Search for contacts/leads using Hunter.io Domain Search (via proxy)
 */
export async function searchLeads(params: Record<string, unknown>): Promise<HunterSearchResponse> {
  try {
    const response = await fetch(`${PROXY_API_URL}/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    const contentType = response.headers.get('content-type');
    
    // Check if we got HTML instead of JSON (API not available)
    if (contentType?.includes('text/html')) {
      throw new Error('Hunter.io API endpoint not available. Make sure you have deployed to Vercel or are running dev server.');
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(error.error || `API Error: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Cannot connect to Hunter.io API. Check your internet connection and Vercel deployment.');
    }
    throw error;
  }
}





/**
 * Convert Hunter contact to our Lead format
 */
export function hunterContactToLead(contact: HunterContact, organization: HunterOrganization) {
  return {
    name: `${contact.first_name} ${contact.last_name}`.trim() || 'Unknown',
    company: organization.organization || 'Unknown Company',
    email: contact.value,
    phone: contact.phone_number || '',
    location: 'Unknown', // Hunter.io doesn't provide location in domain search
    status: 'new' as const,
    value: 0, // User will set this
    industry: 'Other', // Hunter.io doesn't provide industry in domain search
    score: contact.confidence || 50,
    // Additional fields for social profiles
    linkedinUrl: contact.linkedin || '',
    twitterUrl: contact.twitter || '',
    facebookUrl: '',
    companyWebsite: `https://${organization.domain}`,
    companyLinkedin: '',
    companyTwitter: '',
    companyFacebook: '',
  };
}
