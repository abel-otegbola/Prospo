'use client';
import { useContext, useState } from "react";
import { CloseCircle, Buildings2, MagicStick, Magnifer } from "@solar-icons/react";
import Button from "../button/Button";
import LoadingIcon from "../../assets/icons/loadingIcon";
import type { Lead } from "../../contexts/LeadsContextValue";
import { AuthContext } from "../../contexts/AuthContextValue";
import { UserProfileContext } from "../../contexts/UserProfileContextValue";
import { filterUnclaimedLeads, claimMultipleLeads } from "../../helpers/leadClaims";

interface ApolloOrganization {
  name: string;
  website_url?: string;
  primary_email?: string;
  phone?: string;
  primary_phone?: string;
  city?: string;
  state?: string;
  country?: string;
  industry?: string;
  linkedin_url?: string;
  facebook_url?: string;
  twitter_url?: string;
  estimated_num_employees?: number;
}

interface DiscoveredBusiness {
  name: string;
  company: string;
  email: string;
  phone: string;
  location: string;
  companyWebsite: string;
  industry: string;
  score: number;
  userId: string;
  serviceNeeds: string[];
  value: number;
}

interface BusinessDiscoveryProps {
  isOpen: boolean;
  onClose: () => void;
  onImportLeads: (leads: Omit<Lead, 'id' | 'addedDate'>[]) => void;
}

export default function BusinessDiscovery({ isOpen, onClose, onImportLeads }: BusinessDiscoveryProps) {
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AuthContext);
  const { profile } = useContext(UserProfileContext);
  const [searchResults, setSearchResults] = useState<DiscoveredBusiness[]>([]);
  const [selectedBusinesses, setSelectedBusinesses] = useState<Set<number>>(new Set());
  const [error, setError] = useState<string>('');

  // Search businesses using Apollo AI based on specialty
  const searchApolloBusinesses = async (): Promise<DiscoveredBusiness[]> => {
    const searchTerm = profile?.specialty || 'businesses';
    
    console.log('🔍 Searching Apollo AI for:', searchTerm);
    
    try {
      const payload = {
        searchTerm,
        location: 'United States',
        page: 1,
        perPage: 25,
        companySize: '1,50' // Focus on small businesses
      };
      
      const response = await fetch('/api/apollo/discover', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('Apollo API error:', response.status, errorData);
        throw new Error(errorData.error || `Apollo API error: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Apollo API response:', data);
      
      const organizations = data.organizations || [];
      
      if (organizations.length === 0) {
        console.log('No organizations found');
        return [];
      }
      
      const businesses = organizations.map((org: ApolloOrganization) => {
        const score = calculateScore(org);
        const serviceNeeds = determineServiceNeeds(org, profile?.specialty);
        
        return {
          name: 'Contact',
          company: org.name || 'Unknown Company',
          email: org.primary_email || '',
          phone: org.phone || org.primary_phone || '',
          location: formatLocation(org),
          companyWebsite: org.website_url || '',
          industry: org.industry || profile?.specialty || 'General',
          score,
          userId: user?.uid,
          serviceNeeds,
          value: estimateProjectValue(serviceNeeds, score)
        };
      });
      
      console.log('✅ Parsed', businesses.length, 'businesses from Apollo');
      return businesses;
      
    } catch (error) {
      console.error('Apollo search error:', error);
      throw error;
    }
  };
  
  const formatLocation = (org: ApolloOrganization): string => {
    const parts = [];
    if (org.city) parts.push(org.city);
    if (org.state) parts.push(org.state);
    if (org.country) parts.push(org.country);
    return parts.join(', ') || 'Unknown';
  };
  
  const calculateScore = (org: ApolloOrganization): number => {
    let score = 30;
    
    // Contact info increases score
    if (org.phone || org.primary_phone) score += 15;
    if (org.primary_email) score += 10;
    
    // Website presence
    if (!org.website_url) {
      score += 25; // HIGH opportunity - no website
    } else {
      score += 10; // Has website
    }
    
    // Social media presence
    const socialCount = [org.linkedin_url, org.facebook_url, org.twitter_url].filter(Boolean).length;
    if (socialCount === 0) {
      score += 15; // No social media = opportunity
    } else if (socialCount === 1) {
      score += 10;
    } else {
      score += 5;
    }
    
    // Company size sweet spot (small businesses are ideal)
    const empCount = org.estimated_num_employees || 0;
    if (empCount >= 5 && empCount <= 50) {
      score += 15;
    } else if (empCount >= 1 && empCount <= 100) {
      score += 10;
    }
    
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
      const spec = specialty.toLowerCase();
      if (spec.includes('web')) {
        needs.push('Web Design');
      }
      if (spec.includes('seo')) {
        needs.push('SEO');
      }
      if (spec.includes('brand')) {
        needs.push('Branding');
      }
      if (spec.includes('marketing')) {
        needs.push('Digital Marketing');
      }
      if (spec.includes('content')) {
        needs.push('Content Creation');
      }
    }
    
    if (needs.length === 0) {
      needs.push('Website Maintenance', 'SEO');
    }
    
    return needs.slice(0, 3); // Max 3 needs
  };

  const estimateProjectValue = (serviceNeeds: string[], score: number): number => {
    const baseValue = 2000;
    const needsMultiplier = serviceNeeds.length * 1000;
    const scoreMultiplier = (score / 100) * 1000;
    
    return baseValue + needsMultiplier + scoreMultiplier;
  };

  const handleDiscover = async () => {
    if (!profile?.specialty) {
      setError('Please complete your profile and set your specialty first.');
      return;
    }

    setLoading(true);
    setError('');
    setSelectedBusinesses(new Set());
    
    try {
      // Search for organizations using Apollo AI
      const businesses = await searchApolloBusinesses();
      
      // Filter out already claimed leads
      console.log('🔍 Checking for already claimed leads...');
      const unclaimedBusinesses = await filterUnclaimedLeads(businesses);
      const claimedCount = businesses.length - unclaimedBusinesses.length;
      
      if (claimedCount > 0) {
        console.log(`🚫 Filtered out ${claimedCount} already claimed leads`);
      }
      
      // Sort by score
      unclaimedBusinesses.sort((a, b) => b.score - a.score);
      
      setSearchResults(unclaimedBusinesses);
      
      if (unclaimedBusinesses.length === 0) {
        if (claimedCount > 0) {
          setError(`Found ${businesses.length} businesses, but all have already been claimed. Try again later for fresh leads.`);
        } else {
          setError('No businesses found. Try again later or contact support.');
        }
      } else if (claimedCount > 0) {
        console.log(`ℹ️ Found ${unclaimedBusinesses.length} unclaimed leads (${claimedCount} already claimed)`);
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to discover businesses';
      setError(errorMessage);
      console.error('Business discovery error:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleBusiness = (index: number) => {
    const newSelected = new Set(selectedBusinesses);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedBusinesses(newSelected);
  };

  const toggleAll = () => {
    if (selectedBusinesses.size === searchResults.length) {
      setSelectedBusinesses(new Set());
    } else {
      setSelectedBusinesses(new Set(searchResults.map((_, index) => index)));
    }
  };

  const handleImport = async () => {
    if (selectedBusinesses.size === 0) {
      setError('Please select at least one business to import.');
      return;
    }
    
    const selectedLeads = searchResults.filter((_, index) => selectedBusinesses.has(index));
    
    const leadsToImport = selectedLeads.map(business => ({
      name: business.name,
      company: business.company,
      email: business.email,
      phone: business.phone,
      location: business.location,
      status: 'new' as const,
      value: business.value,
      industry: business.industry,
      score: business.score,
      userId: user?.uid,
      companyWebsite: business.companyWebsite,
      serviceNeeds: business.serviceNeeds,
      linkedinUrl: '',
      twitterUrl: '',
      companyLinkedin: '',
      notes: ''
    }));
    
    console.log('✨ Importing discovered businesses:', leadsToImport);
    
    // Claim these leads
    if (user?.uid) {
      await claimMultipleLeads(
        selectedLeads.map(b => ({
          companyWebsite: b.companyWebsite,
          email: b.email,
          company: b.company,
          industry: b.industry
        })),
        user.uid,
        profile?.specialty ? [profile.specialty] : []
      );
      console.log('🔒 Claimed selected leads for user');
    }
    
    onImportLeads(leadsToImport);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-background rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <MagicStick size={24} className="text-primary" />
            <div>
              <h2 className="text-lg font-bold">Discover Businesses</h2>
              <p className="text-sm opacity-[0.6]">
                {profile?.specialty 
                  ? `Finding businesses that need ${profile.specialty} services` 
                  : 'Complete your profile to discover businesses'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray/ hover:opacity-[0.6]">
            <CloseCircle size={24} />
          </button>
        </div>

        <div className="flex md:flex-row flex-col overflow-y-auto flex-1">
          {/* Search Panel */}
          <div className="p-6 border-b md:border-b-0 md:border-r border-gray-200 bg-gray-50 md:w-80 flex flex-col">
            <h3 className="font-semibold mb-4 flex items-center justify-between">
              <span>Search</span>
              {searchResults.length > 0 && (
                <span className="text-xs bg-primary text-white px-2 py-1 rounded-full">
                  {searchResults.length} found
                </span>
              )}
            </h3>
            
            {profile?.specialty ? (
              <div className="space-y-4 flex-1">
                <div className="bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4">
                  <p className="text-sm font-semibold text-purple-900 mb-2 flex items-center gap-2">
                    <span>🎯</span> Your Specialty
                  </p>
                  <p className="text-sm text-purple-700">
                    {profile.specialty}
                  </p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm font-medium text-blue-900 mb-2">
                    💡 How it works
                  </p>
                  <ul className="text-xs text-blue-700 space-y-2">
                    <li>• Finds businesses in your specialty area</li>
                    <li>• Prioritizes small businesses (1-50 employees)</li>
                    <li>• Filters out already claimed leads</li>
                    <li>• Scores based on conversion potential</li>
                  </ul>
                </div>

                <Button onClick={handleDiscover} disabled={loading} className="w-full mt-auto">
                  {loading ? (
                    <LoadingIcon color="white" className="animate-spin w-5 h-5" />
                  ) : (
                    <>
                      <Magnifer size={18} />
                      Discover Businesses
                    </>
                  )}
                </Button>
              </div>
            ) : (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm font-medium text-yellow-900 mb-2">
                  ⚠️ Profile Incomplete
                </p>
                <p className="text-xs text-yellow-700">
                  Please set your specialty in your profile to start discovering businesses.
                </p>
              </div>
            )}
          </div>

          {/* Results */}
          <div className="flex-1 overflow-y-auto p-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                {error}
              </div>
            )}

            {searchResults.length > 0 && (
              <>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm opacity-[0.6]">
                    Found {searchResults.length} potential clients
                  </p>
                  <button
                    onClick={toggleAll}
                    className="text-sm text-primary font-medium hover:underline"
                  >
                    {selectedBusinesses.size === searchResults.length ? 'Deselect All' : 'Select All'}
                  </button>
                </div>

                <div className="grid gap-3">
                  {searchResults.map((business, index) => (
                    <div
                      key={index}
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${
                        selectedBusinesses.has(index)
                          ? 'border-primary bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => toggleBusiness(index)}
                    >
                      <div className="flex items-start gap-4">
                        <input
                          type="checkbox"
                          checked={selectedBusinesses.has(index)}
                          onChange={() => {}}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-semibold text-gray-900">{business.company}</h3>
                              <p className="text-sm opacity-[0.6]">{business.name}</p>
                            </div>
                            <span className="text-xs font-medium px-2 py-1 bg-green-100 text-green-700 rounded">
                              Score: {business.score}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm opacity-[0.6] mb-2">
                            <div className="flex items-center gap-1">
                              <Buildings2 size={14} />
                              <span>{business.industry}</span>
                            </div>
                            <span>📍 {business.location}</span>
                          </div>

                          <div className="flex flex-wrap gap-2 mb-2">
                            {business.serviceNeeds.map((need: string, idx: number) => (
                              <span key={idx} className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded">
                                🎯 {need}
                              </span>
                            ))}
                          </div>

                          <div className="flex items-center gap-3 text-xs opacity-[0.6]">
                            <span>💰 Est. Value: ${business.value.toLocaleString()}</span>
                            {business.companyWebsite && (
                              <span>🌐 {business.companyWebsite}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {!loading && searchResults.length === 0 && !error && (
              <div className="text-center py-12">
                <Buildings2 size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="opacity-[0.6] mb-2">
                  {profile?.specialty 
                    ? 'Click "Discover Businesses" to start finding leads'
                    : 'Set your specialty in your profile to get started'}
                </p>
                <p className="text-xs text-gray/">
                  We&apos;ll find small businesses that need your services
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        {searchResults.length > 0 && (
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <p className="text-sm opacity-[0.6]">
                {selectedBusinesses.size} business{selectedBusinesses.size !== 1 ? 'es' : ''} selected
              </p>
              <div className="flex gap-3">
                <Button variant="secondary" onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  onClick={handleImport}
                  disabled={selectedBusinesses.size === 0}
                >
                  Import {selectedBusinesses.size} Lead{selectedBusinesses.size !== 1 ? 's' : ''}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
