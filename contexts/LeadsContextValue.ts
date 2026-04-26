'use client'
import { createContext } from "react";

export interface WebsiteAudit {
    // Performance scores (0-100)
    performanceScore: number;
    seoScore: number;
    designScore: number;
    mobileScore: number;
    
    // Issues found
    brokenLinks: number;
    seoIssues: string[];
    techStack: string[];
    isOutdatedTech: boolean;
    
    // Load metrics
    loadTime: number; // in seconds
    pageSize: number; // in KB
    
    // Last audit
    lastAudited: string;
    auditStatus: 'pending' | 'completed' | 'failed';
}

export interface Lead {
    id: string;
    name: string;
    company: string;
    email: string;
    phone: string | Record<string, never>; // Can be a string or empty object from Apollo API
    location: string;
    status: "new" | "contacted" | "conversation" | "proposal" | "closed";
    value: number; // Estimated project value
    industry: string;
    score: number; // Opportunity score (0-100)
    addedDate: string;
    userId: string;
    
    // Website & Audit Data
    companyWebsite: string;
    websiteAudit?: WebsiteAudit;
    
    // Service needs (what they need help with)
    serviceNeeds: string[]; // e.g., ['Website Design', 'SEO', 'Speed Optimization']
    
    // Social profiles (optional)
    linkedinUrl?: string;
    twitterUrl?: string;
    facebookUrl?: string;
    companyLinkedin?: string;
    logoUrl?: string;
    
    // Company details (optional)
    foundedYear?: number;
    estimatedEmployees?: number;
    
    // Notes
    notes?: string;

    // About/Insights
    about?: string;
}

export type LeadsContextValue = {
    leads: Lead[];
    loading: boolean;
    error: string | null;
    addLead: (lead: Omit<Lead, 'id' | 'addedDate'>) => Promise<string>;
    updateLead: (id: string, updates: Partial<Lead>) => Promise<void>;
    deleteLead: (id: string) => Promise<void>;
    refreshLeads: () => Promise<void>;
    auditWebsite: (leadId: string, websiteUrl: string) => Promise<void>;
    getSingleLead: (id: string) => Promise<Lead | null>;
}

export const LeadsContext = createContext({} as LeadsContextValue);
