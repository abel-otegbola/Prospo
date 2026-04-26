// Lead claiming system to prevent duplicate leads across users
import { db } from '../firebase/firebase';
import { collection, addDoc, query, where, getDocs, Timestamp } from 'firebase/firestore';
import type { UserProfile } from '../interface/userProfile';

export interface ClaimedLead {
  companyWebsite?: string;
  email?: string;
  companyName?: string;
  industry?: string;
  claimedBy: string; // userId
  claimedByServices?: string[]; // Services the user who claimed offers
  claimedAt: Date;
}

/**
 * Calculate match score between a lead and user profile
 * Higher score means better match for the user
 */
export function calculateLeadRelevanceScore(
  userProfile: UserProfile | null
): number {
  if (!userProfile) return 50; // Default score
  
  // Location preference (10 points)
  // Note: Would need lead location to fully implement
  
  return Math.max(0, Math.min(100, 0));
}

/**
 * Check if a company has already been claimed by another user
 */
export async function isLeadClaimed(companyWebsite: string, email: string): Promise<boolean> {
  try {
    const claimsRef = collection(db, 'claimedLeads');
    
    // Check by website or email
    const queries = [];
    
    if (companyWebsite && companyWebsite.trim()) {
      const websiteQuery = query(claimsRef, where('companyWebsite', '==', companyWebsite.toLowerCase().trim()));
      queries.push(getDocs(websiteQuery));
    }
    
    if (email && email.trim()) {
      const emailQuery = query(claimsRef, where('email', '==', email.toLowerCase().trim()));
      queries.push(getDocs(emailQuery));
    }
    
    if (queries.length === 0) return false;
    
    const results = await Promise.all(queries);
    
    // If any query returns results, the lead is claimed
    return results.some(snapshot => !snapshot.empty);
  } catch (error) {
    console.error('Error checking claimed leads:', error);
    return false; // If error, allow the lead (fail open)
  }
}

/**
 * Claim a lead for a specific user
 */
export async function claimLead(
  companyWebsite: string, 
  email: string, 
  companyName: string, 
  userId: string,
  industry?: string,
  userServices?: string[]
): Promise<void> {
  try {
    const claimsRef = collection(db, 'claimedLeads');
    
    await addDoc(claimsRef, {
      companyWebsite: companyWebsite ? companyWebsite.toLowerCase().trim() : null,
      email: email ? email.toLowerCase().trim() : null,
      companyName: companyName || 'Unknown',
      industry: industry || null,
      claimedBy: userId,
      claimedByServices: userServices || [],
      claimedAt: Timestamp.now()
    });
    
    console.log('✅ Lead claimed:', companyName);
  } catch (error) {
    console.error('Error claiming lead:', error);
    // Don't throw - claiming is best effort
  }
}

/**
 * Check multiple leads at once and filter out claimed ones
 */
export async function filterUnclaimedLeads<T extends { companyWebsite: string; email: string }>(
  leads: T[]
): Promise<T[]> {
  if (leads.length === 0) return [];
  
  try {
    const claimsRef = collection(db, 'claimedLeads');
    
    // Get all websites and emails
    const websites = leads
      .map(l => l.companyWebsite?.toLowerCase().trim())
      .filter(Boolean);
    const emails = leads
      .map(l => l.email?.toLowerCase().trim())
      .filter(Boolean);
    
    // Firestore 'in' queries are limited to 10 items, so we batch
    const batchSize = 10;
    const claimedWebsites = new Set<string>();
    const claimedEmails = new Set<string>();
    
    // Check websites in batches
    for (let i = 0; i < websites.length; i += batchSize) {
      const batch = websites.slice(i, i + batchSize);
      if (batch.length > 0) {
        const q = query(claimsRef, where('companyWebsite', 'in', batch));
        const snapshot = await getDocs(q);
        snapshot.forEach(doc => {
          const website = doc.data().companyWebsite;
          if (website) claimedWebsites.add(website);
        });
      }
    }
    
    // Check emails in batches
    for (let i = 0; i < emails.length; i += batchSize) {
      const batch = emails.slice(i, i + batchSize);
      if (batch.length > 0) {
        const q = query(claimsRef, where('email', 'in', batch));
        const snapshot = await getDocs(q);
        snapshot.forEach(doc => {
          const email = doc.data().email;
          if (email) claimedEmails.add(email);
        });
      }
    }
    
    // Filter out claimed leads
    const unclaimed = leads.filter(lead => {
      const website = lead.companyWebsite?.toLowerCase().trim();
      const email = lead.email?.toLowerCase().trim();
      
      const websiteClaimed = website && claimedWebsites.has(website);
      const emailClaimed = email && claimedEmails.has(email);
      
      return !websiteClaimed && !emailClaimed;
    });
    
    console.log(`🔍 Filtered leads: ${leads.length} total, ${unclaimed.length} unclaimed, ${leads.length - unclaimed.length} already claimed`);
    
    return unclaimed;
  } catch (error) {
    console.error('Error filtering claimed leads:', error);
    return leads; // If error, return all (fail open)
  }
}

/**
 * Claim multiple leads at once (for batch import)
 */
export async function claimMultipleLeads(
  leads: Array<{ companyWebsite: string; email: string; company: string; industry?: string }>,
  userId: string,
  userServices?: string[]
): Promise<void> {
  try {
    const claimsRef = collection(db, 'claimedLeads');
    
    // Claim each lead
    const promises = leads.map(lead => {
      if (!lead.companyWebsite && !lead.email) return Promise.resolve();
      
      return addDoc(claimsRef, {
        companyWebsite: lead.companyWebsite ? lead.companyWebsite.toLowerCase().trim() : null,
        email: lead.email ? lead.email.toLowerCase().trim() : null,
        companyName: lead.company || 'Unknown',
        industry: lead.industry || null,
        claimedBy: userId,
        claimedByServices: userServices || [],
        claimedAt: Timestamp.now()
      });
    });
    
    await Promise.all(promises);
    console.log(`✅ Claimed ${leads.length} leads`);
  } catch (error) {
    console.error('Error claiming multiple leads:', error);
  }
}
