import type { Lead } from "../contexts/LeadsContextValue";

interface EmailFinderParams {
  leadId: string;
  companyWebsite: string;
  companyName: string;
  leads: Lead[];
  updateLead: (id: string, data: Partial<Lead>) => Promise<void>;
  showModal: (options: { title?: string; message: string; showCancel?: boolean }) => Promise<boolean>;
}

interface HunterContact {
  value: string;
  first_name?: string;
  last_name?: string;
  position?: string;
  seniority?: string;
}

export async function findLeadEmail({
  leadId,
  companyWebsite,
  companyName,
  leads,
  updateLead,
  showModal
}: EmailFinderParams): Promise<boolean> {
  if (!companyWebsite) {
    await showModal({ message: 'No website available for this lead. Please add a website first.' });
    return false;
  }

  // Check if API key exists
  const apiKey = process.env.NEXT_PUBLIC_HUNTER_API_KEY;
  if (!apiKey) {
    await showModal({
      title: 'Hunter.io API Key Missing',
      message: '⚠️ Hunter.io API key not configured.\n\nAdd NEXT_PUBLIC_HUNTER_API_KEY to your .env file.\n\nGet your free API key at: https://hunter.io/api',
      showCancel: false
    });
    return false;
  }

  try {
    // Extract domain from website
    let domain = companyWebsite.toLowerCase().trim();
    domain = domain.replace(/^(https?:\/\/)?(www\.)?/, '');
    domain = domain.split('/')[0].split('?')[0];

    console.log('🔍 Searching Hunter.io for domain:', domain);

    // Call Hunter.io API
    const url = `https://api.hunter.io/v2/domain-search?domain=${encodeURIComponent(domain)}&api_key=${apiKey}&limit=5`;
    const response = await fetch(url);

    console.log('📡 Hunter.io response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ Hunter.io error:', errorData);

      if (response.status === 401) {
        throw new Error('Invalid API key. Check your NEXT_PUBLIC_HUNTER_API_KEY in .env file.');
      } else if (response.status === 429) {
        throw new Error('Rate limit exceeded. You\'ve used your monthly quota.');
      } else {
        throw new Error(errorData.errors?.[0]?.details || 'Failed to search Hunter.io');
      }
    }

    const data = await response.json();
    console.log('📊 Hunter.io data:', data);

    if (data.data && data.data.emails && data.data.emails.length > 0) {
      // Sort emails to prioritize personal emails (Gmail, etc.) and decision-makers
      const sortedContacts = [...data.data.emails].sort((a: HunterContact, b: HunterContact) => {
        const emailA = a.value.toLowerCase();
        const emailB = b.value.toLowerCase();

        // Personal email domains (Gmail, Yahoo, Outlook, etc.)
        const personalDomains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'icloud.com', 'me.com', 'protonmail.com'];
        const isPersonalA = personalDomains.some(domain => emailA.endsWith(domain));
        const isPersonalB = personalDomains.some(domain => emailB.endsWith(domain));

        // Prioritize personal emails first
        if (isPersonalA && !isPersonalB) return -1;
        if (!isPersonalA && isPersonalB) return 1;

        // Decision-maker keywords (CEO, founder, director, etc.)
        const decisionMakerKeywords = ['ceo', 'founder', 'co-founder', 'cto', 'coo', 'cfo', 'director', 'head', 'vp', 'president', 'owner', 'manager', 'lead'];
        const positionA = (a.position || '').toLowerCase();
        const positionB = (b.position || '').toLowerCase();

        const isDecisionMakerA = decisionMakerKeywords.some(keyword => positionA.includes(keyword));
        const isDecisionMakerB = decisionMakerKeywords.some(keyword => positionB.includes(keyword));

        // Among same email type, prioritize decision-makers
        if (isDecisionMakerA && !isDecisionMakerB) return -1;
        if (!isDecisionMakerA && isDecisionMakerB) return 1;

        // Seniority scoring (senior/executive = higher priority)
        const seniorityScore = (contact: { seniority?: string }) => {
          const seniority = (contact.seniority || '').toLowerCase();
          if (seniority.includes('executive') || seniority.includes('c-level')) return 3;
          if (seniority.includes('senior')) return 2;
          if (seniority.includes('manager') || seniority.includes('director')) return 1;
          return 0;
        };

        return seniorityScore(b) - seniorityScore(a);
      });

      // Get the top priority contact
      const contact = sortedContacts[0];
      const email = contact.value;
      const firstName = contact.first_name || 'Contact';
      const lastName = contact.last_name || '';
      const fullName = `${firstName} ${lastName}`.trim();
      const position = contact.position || '';

      console.log('✅ Found contact:', fullName, email, position ? `(${position})` : '');

      // Update the lead with the found email and name
      const lead = leads?.find(l => l.id === leadId);
      if (lead) {
        // Only include defined fields to avoid Firestore errors
        const updateData: Partial<Lead> = {
          name: fullName || lead?.name,
          company: lead?.company,
          email: email,
          phone: lead?.phone,
          location: lead?.location,
          status: lead?.status,
          value: lead?.value,
          industry: lead?.industry,
          score: lead?.score,
          companyWebsite: lead?.companyWebsite,
          serviceNeeds: lead?.serviceNeeds,
          addedDate: lead?.addedDate,
          userId: lead?.userId
        };

        // Only add optional fields if they're defined
        if (lead?.notes !== undefined) {
          updateData.notes = lead?.notes;
        }
        if (lead?.websiteAudit !== undefined) {
          updateData.websiteAudit = lead?.websiteAudit;
        }

        await updateLead(leadId, updateData);

        const emailType = email.includes('@gmail.com') || email.includes('@yahoo.com') || email.includes('@outlook.com') || email.includes('@hotmail.com') ? '📧 Personal Email' : '🏢 Company Email';
        const positionInfo = position ? `\nPosition: ${position}` : '';

        await showModal({
          title: 'Contact Found',
          message: `✅ Found contact!\n\nName: ${fullName}\nEmail: ${email}\n${emailType}${positionInfo}\n\nSearches remaining: ${data.meta.requests.searches.available - data.meta.requests.searches.used} / ${data.meta.requests.searches.available}`
        });
        
        return true;
      }
    } else {
      await showModal({
        title: 'No Contacts Found',
        message: `❌ No contacts found for ${companyName}\n\nDomain searched: ${domain}\n\nTips:\n• Company might not have public emails\n• Try finding them on LinkedIn\n• Use a different domain variant\n\nSearches remaining: ${data.meta?.requests?.searches?.available ? (data.meta.requests.searches.available - data.meta.requests.searches.used) : 'Unknown'}`
      });
      return false;
    }
  } catch (error) {
    console.error('❌ Error finding email:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    await showModal({
      title: 'Find Contact Failed',
      message: `❌ Failed to find contact\n\n${errorMessage}`
    });
    return false;
  }
  
  return false;
}
