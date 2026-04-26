'use client'
import { useContext, useEffect, useState } from "react"
import { UserProfileContext } from "../../../contexts/UserProfileContextValue";
import "../../../assets/css/react-calendar.css"
import { AuthContext } from "../../../contexts/AuthContextValue";
import SkeletonLoader from "../../../components/skeletonLoader/SkeletonLoader";
import { LeadsContext } from "../../../contexts/LeadsContextValue";
import Button from "../../../components/button/Button";
import { generateDashboardLeads, type GeneratedLead } from "../../../helpers/leadGenerator";
import { categoryApolloFilters, FREELANCING_SPECIALTIES } from "../../../constants/specialties";
import LocationPicker from "../../../components/locationPicker/LocationPicker";
import IndustryPicker from "../../../components/industryPicker/IndustryPicker";
import LeadCard from "../../../components/leadCard/LeadCard";
import type { Lead } from "../../../contexts/LeadsContextValue";
import { Buildings } from "@solar-icons/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

function Dashboardpage() {
  const { profile } = useContext(UserProfileContext);
  const { user } = useContext(AuthContext);
  const { leads, addLead } = useContext(LeadsContext);
  const navigate = useRouter();
  const [generatedLeads, setGeneratedLeads] = useState<GeneratedLead[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savingLeadId, setSavingLeadId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedLocation, setSelectedLocation] = useState<string>('United States');
  const [selectedIndustry, setSelectedIndustry] = useState<string>('');
  const [active, setActive] = useState("For you")
  
  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-green-600 font-semibold";
    if (score >= 70) return "text-orange-600 font-medium";
    return "opacity-[0.6]";
  };

  const saveLead = async (lead: GeneratedLead) => {
    if (!user?.uid) return null;
    
    setSavingLeadId(lead.id);
    
    try {
      const leadData = {
        name: lead.name,
        company: lead.company,
        email: lead.email,
        phone: lead.phone,
        location: lead.location,
        companyWebsite: lead.companyWebsite,
        industry: lead.industry,
        score: lead.score,
        serviceNeeds: lead.serviceNeeds,
        value: lead.value,
        status: 'new' as const,
        userId: user.uid,
        linkedinUrl: lead.linkedinUrl,
        twitterUrl: lead.twitterUrl,
        facebookUrl: lead.facebookUrl,
        logoUrl: lead.logoUrl,
        foundedYear: lead.foundedYear,
        estimatedEmployees: lead.estimatedEmployees,
      };
      
      const leadId = await addLead(leadData);
      
      return leadId;
    } catch (error) {
      console.error('Error saving lead:', error);
      return null;
    } finally {
      setSavingLeadId(null);
    }
  };
  
  const handleLeadClick = async (lead: GeneratedLead) => {
    // Save the lead first, then navigate
    const leadId = await saveLead(lead);
    if (leadId) {
      navigate.push(`/account/leads/${leadId}`);
    }
  };

  // Generate leads when dashboard opens or search parameters change
  useEffect(() => {
    const fetchLeads = async () => {
      if (!user?.uid || !profile?.specialty) return;

      setLoading(true);
      setError(null);

      try {
        const specialtyData = FREELANCING_SPECIALTIES.find(
          s => s.label === profile.specialty
        );

        const category = specialtyData?.category;

        const filters = categoryApolloFilters[category || ""] || { industries: [], jobTitles: [], companySize: [], signals: [] };

        // Use selected industry or pick random ones
        const industries = selectedIndustry 
          ? [selectedIndustry]
          : filters.industries
              ?.sort(() => 0.5 - Math.random())
              .slice(0, 3) || [];

        const titles =
          filters.jobTitles
            ?.sort(() => 0.5 - Math.random())
            .slice(0, 2) || [];

        const randomPage = Math.floor(Math.random() * 5) + 1;

        const leads = await generateDashboardLeads({
          searchTerm: searchTerm !== "" ? searchTerm : filters.signals[Math.floor(Math.random() * filters.signals.length)] || profile.specialty,
          specialty: profile.specialty,
          industries,
          titles,
          companySize: filters.companySize || ["1-10", "11-50"],
          location: selectedLocation,
          page: randomPage,
          perPage: 10
        });

        setGeneratedLeads(leads);
      } catch (err) {
        console.error("Error generating dashboard leads:", err);
        setError(err instanceof Error ? err.message : "Failed to generate leads");
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
  }, [user?.uid, profile?.specialty, searchTerm, selectedLocation, selectedIndustry]);

  return (
      <div className="flex lg:flex-row flex-col gap-4 md:px-4 h-full">

        <div className="lg:w-[65%] w-full p-4 mt-4 flex flex-col gap-4 mb-6 md:border border-gray/[0.09] bg-gray/[0.03] md:rounded-lg">
          <div>
            <h1 className="text-2xl font-medium mb-2">Discover</h1>
            <p className="opacity-[0.6]">Leads based on your specialization:</p>
          </div>
          
          <div className="relative">
            <div className="relative flex flex-col gap-3 p-4 shadow-[4px_4px_20px_#0000000A] rounded-lg border border-gray/[0.2] bg-background z-[2]">
            
              <div className="flex items-start gap-4 z-2">
                <Link href="/account" className="w-10 h-10 rounded-full bg-primary/[0.2] border border-gray/[0.2] flex items-center justify-center font-semibold flex-shrink-0">
                  <Image src={user?.photoURL || profile?.photoURL || "/profile.jpg"} width={40} height={40} className="rounded-full" alt="Profile" />
                </Link>
                <div className="flex flex-col flex-1">
                  <textarea 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)} 
                    className="py-2 flex-1 border-none outline-none text-semibold resize-none" 
                    placeholder="Customize your client search here..."
                    rows={2}
                  />
                </div>
              </div>
            
              <div className="flex flex-wrap justify-between gap-2 items-center">
                <div className="flex gap-2 items-center">
                  <LocationPicker 
                    selectedLocation={selectedLocation}
                    onLocationChange={setSelectedLocation}
                  />
                  
                  <IndustryPicker 
                    selectedIndustry={selectedIndustry}
                    specialty={profile?.specialty}
                    onIndustryChange={setSelectedIndustry}
                  />
                </div>
                
                <Button 
                  onClick={() => setSearchTerm(searchQuery || profile?.specialty || '')}
                  className="px-6 py-2 rounded-lg text-white hover:bg-primary-dark text-sm font-medium"
                >
                  Search
                </Button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between py-4">
            {/* <p className="opacity-[0.5]">Current search: <span className="font-semibold">{searchTerm || profile?.specialty}</span></p> */}
            <div className="flex gap-4 w-full border-b border-gray/[0.2] text-[14px]">
              {
                ["For you", "Case studies"].map(tab => (
                  <button 
                    onClick={() => setActive(tab)} 
                    key={tab}
                    className={`py-4 ${active === tab ? "border-b border-primary font-medium" : ""}`}
                  >{tab}</button>
                ))
              }
            </div>
          </div>

          {loading && <SkeletonLoader count={5} />}

          {error && (
            <div className="bg-background rounded-lg p-4 text-center">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {!loading && !error && generatedLeads.length === 0 && (
            <div className="flex flex-col justify-center items-center gap-10 bg-background border border-gray/[0.2] rounded-lg p-8 text-center">
              <p className="opacity-[0.6]">No leads generated yet. Please complete your profile first.</p>
              <Button href="/account" variant="secondary">
                Reload
              </Button>
            </div>
          )}

          <div className="md:p-4 md:bg-gray/[0.05] flex flex-col gap-4 rounded-lg min-h-[230px]">
            {!loading && generatedLeads.map((lead) => (
              <LeadCard
                key={lead?.id}
                lead={lead as Lead}
                onClick={handleLeadClick}
                onBookmark={saveLead}
                isBookmarking={savingLeadId === lead.id}
                getScoreColor={getScoreColor}
              />
            ))}
          </div>
          
        </div>

        <div className="lg:w-[35%] w-full gap-4 flex flex-col mb-6 p-4 md:border-l border-gray/[0.3]">
          <div className="rounded-lg p-4 border border-gray/[0.1] bg-background min-h-[260px]">
            <div className="flex justify-between items-center gap-2 flex-wrap mb-2">
              <h1 className="font-medium">Bookmarked Leads</h1>
              <Link href="/account/leads" className="text-primary text-[12px] underline">View all</Link>
            </div>
            <div className="flex flex-col ">
              {leads.slice(0,4).map((lead) => (
                <Link href={`/account/leads/${lead.id}`} key={lead?.id} className="flex items-center gap-3 py-3">
                  
                  <div className="flex items-center gap-4">
                    {lead?.logoUrl ? (
                    <Image
                      src={lead.logoUrl}
                      width={40} 
                      height={40}
                      alt={`${lead.company} logo`}
                      className="w-10 h-10 rounded-full object-cover flex-shrink-0 border border-gray/[0.1]"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                    ) : null}
                    <div 
                      className={`w-10 h-10 bg-slate-100/[0.3] rounded-full flex items-center justify-center font-bold flex-shrink-0 border border-gray/[0.1] ${lead?.logoUrl ? 'hidden' : ''}`}
                    >
                      {lead?.company.charAt(0).toUpperCase()}
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-medium truncate text-[14px]">
                        {lead?.company}
                      </h3>
                    </div>
                    
                    <div className="flex items-center flex-wrap gap-2 text-xs opacity-[0.6]">
                      <Buildings size={16} className="flex-shrink-0" />
                      <span className="font-medium">{lead?.industry}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-gray/[0.1] bg-background p-4">
            <h3 className="text-[14px] capitalize font-semibold">Based on your specialty</h3>
            <div className="my-2">
              <h4 className="uppercase text-[12px] py-2 border-b border-gray/[0.1] font-medium">Industries</h4>
              <div className="flex flex-wrap gap-2 py-2 text-[12px]">
                {
                  profile?.specialty &&
                categoryApolloFilters[FREELANCING_SPECIALTIES.find(
                  s => s.label === profile.specialty
                )?.category || "Development" ].industries.map(industry => (
                  <button 
                    key={industry} 
                    className={`border border-gray/[0.2] px-4 py-[6px] rounded-full ${selectedIndustry === industry ? "bg-primary text-white" : ""}`}
                    onClick={() => setSelectedIndustry(industry)}
                    >{industry}</button>
                ))
                }
              </div>
            </div>
          </div>

        </div>
      </div>
  )
}

export default Dashboardpage