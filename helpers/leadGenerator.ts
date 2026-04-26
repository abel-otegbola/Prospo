// US Locations for lead discovery
export const US_LOCATIONS = [
  { value: 'United States', label: 'United States (All)' },
  { value: 'New York, NY', label: 'New York, NY' },
  { value: 'Los Angeles, CA', label: 'Los Angeles, CA' },
  { value: 'Chicago, IL', label: 'Chicago, IL' },
  { value: 'Houston, TX', label: 'Houston, TX' },
  { value: 'Phoenix, AZ', label: 'Phoenix, AZ' },
  { value: 'Philadelphia, PA', label: 'Philadelphia, PA' },
  { value: 'San Antonio, TX', label: 'San Antonio, TX' },
  { value: 'San Diego, CA', label: 'San Diego, CA' },
  { value: 'Dallas, TX', label: 'Dallas, TX' },
  { value: 'San Jose, CA', label: 'San Jose, CA' },
  { value: 'Austin, TX', label: 'Austin, TX' },
  { value: 'Jacksonville, FL', label: 'Jacksonville, FL' },
  { value: 'San Francisco, CA', label: 'San Francisco, CA' },
  { value: 'Columbus, OH', label: 'Columbus, OH' },
  { value: 'Charlotte, NC', label: 'Charlotte, NC' },
  { value: 'Indianapolis, IN', label: 'Indianapolis, IN' },
  { value: 'Seattle, WA', label: 'Seattle, WA' },
  { value: 'Denver, CO', label: 'Denver, CO' },
  { value: 'Boston, MA', label: 'Boston, MA' },
  { value: 'Portland, OR', label: 'Portland, OR' },
  { value: 'Miami, FL', label: 'Miami, FL' },
  { value: 'Atlanta, GA', label: 'Atlanta, GA' },
  { value: 'Nashville, TN', label: 'Nashville, TN' },
  { value: 'Detroit, MI', label: 'Detroit, MI' },
];

export interface GeneratedLead {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string | Record<string, never>;
  location: string;
  companyWebsite: string;
  industry: string;
  score: number;
  serviceNeeds: string[];
  value: number;
  addedDate: string;
  logoUrl?: string;
  linkedinUrl?: string;
  twitterUrl?: string;
  facebookUrl?: string;
  foundedYear?: number;
  estimatedEmployees?: number;
}

export interface ApolloOrganization {
  id?: string;
  name?: string;
  primary_email?: string;
  phone?: string | Record<string, never>;
  primary_phone?: Record<string, never>;
  website_url?: string;
  industry?: string;
  city?: string;
  state?: string;
  country?: string;
  estimated_num_employees?: number;
  linkedin_url?: string;
  twitter_url?: string;
  facebook_url?: string;
  logo_url?: string;
  founded_year?: number;
  raw_address?: string;
}

const calculateScore = (org: ApolloOrganization): number => {
  let score = 50;
  
  const hasPhone = org.phone && typeof org.phone === 'string';
  if (hasPhone) score += 15;
  if (org.primary_email) score += 10;
  if (!org.website_url) score += 20; // Higher opportunity
  if (org.estimated_num_employees && org.estimated_num_employees >= 5 && org.estimated_num_employees <= 50) score += 10;
  
  return Math.min(score, 100);
};

const determineServiceNeeds = (org: ApolloOrganization, specialty?: string): string[] => {
  const needs: string[] = [];
  
  if (!org.website_url) {
    needs.push('Website Development');
  }
  if (!org.linkedin_url) {
    needs.push('Social Media Setup');
  }
  
  // Add specialty-based needs
  if (specialty) {
    if (specialty.toLowerCase().includes('web')) {
      needs.push('Web Design');
    }
    if (specialty.toLowerCase().includes('seo')) {
      needs.push('SEO');
    }
    if (specialty.toLowerCase().includes('brand')) {
      needs.push('Branding');
    }
  }
  
  return needs.slice(0, 3); // Max 3 needs
};

const estimateValue = (serviceNeeds: string[], score: number): number => {
  const baseValue = 2000;
  const needsMultiplier = serviceNeeds.length * 1000;
  const scoreMultiplier = (score / 100) * 1000;
  
  return baseValue + needsMultiplier + scoreMultiplier;
};

const formatLocation = (org: ApolloOrganization): string => {
  const parts = [];
  if (org.city) parts.push(org.city);
  if (org.state) parts.push(org.state);
  if (org.country) parts.push(org.country);
  return parts.join(', ') || 'Unknown';
};

interface GenerateDashboardLeadsParams {
  searchTerm: string;
  specialty?: string;
  industries?: string[];
  titles?: string[];
  companySize?: string[];
  location?: string;
  page?: number;
  perPage?: number;
}

export const generateDashboardLeads = async ({
    searchTerm,
    specialty,
    industries,
    titles,
    companySize,
    location,
    page,
    perPage

}: GenerateDashboardLeadsParams): Promise<GeneratedLead[]> => {
  const response = await fetch('/api/apollo/discover', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      searchTerm,
      industries,
      titles,
      location,
      page,
      perPage,
      companySize
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(errorData.error || 'Failed to generate leads');
  }

  const data = await response.json();
  const organizations = data.organizations || [];

  // Transform into lead format
  const leads: GeneratedLead[] = organizations.map((org: ApolloOrganization, index: number) => {
    const score = calculateScore(org);
    const serviceNeeds = determineServiceNeeds(org, specialty);
    
    // Handle phone field which can be string or empty object
    const phoneValue = org.phone && typeof org.phone === 'string' ? org.phone : '';
    
    return {
      id: org.id || `generated-${index}`,
      name: 'Contact',
      company: org.name || 'Unknown Company',
      email: org.primary_email || '',
      phone: phoneValue,
      location: formatLocation(org),
      companyWebsite: org.website_url || '',
      industry: org.industry || specialty || 'General',
      score,
      serviceNeeds,
      value: estimateValue(serviceNeeds, score),
      addedDate: new Date().toISOString(),
      logoUrl: org.logo_url,
      linkedinUrl: org.linkedin_url,
      twitterUrl: org.twitter_url,
      facebookUrl: org.facebook_url,
      foundedYear: org.founded_year,
      estimatedEmployees: org.estimated_num_employees,
    };
  });
  
  return leads;
};
