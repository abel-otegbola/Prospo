"use client";

import { useContext, useEffect, useState } from "react"
import "../../../assets/css/react-calendar.css"
import { useRouter } from "next/navigation";
import { AuthContext } from "../../../contexts/AuthContextValue";
import SkeletonLoader from "../../../components/skeletonLoader/SkeletonLoader";
import { LeadsContext } from "../../../contexts/LeadsContextValue";
import Button from "../../../components/button/Button";
import { generateDashboardLeads, type GeneratedLead } from "../../../helpers/leadGenerator";
import { categoryApolloFilters, FREELANCING_SPECIALTIES } from "../../../constants/specialties";
import LocationPicker from "../../../components/locationPicker/LocationPicker";
import LeadCard from "../../../components/leadCard/LeadCard";
import type { Lead } from "../../../contexts/LeadsContextValue";
import Topbar from "../../../components/topbar/topbar";
import Link from "next/link";
import Image from "next/image";

function FindBusinesses() {
  const { user } = useContext(AuthContext);
  const { addLead } = useContext(LeadsContext);
  const navigate = useRouter();
  const [generatedLeads, setGeneratedLeads] = useState<GeneratedLead[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savingLeadId, setSavingLeadId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("Web development");
  const [searchQuery, setSearchQuery] = useState<string>("Web development");
  const [selectedLocation, setSelectedLocation] = useState<string>('United States');
  const [selectedIndustry] = useState<string>('');
  
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
      
      if(user) {
        const leadId = await addLead(leadData);
        return leadId;
      }
      else {
        navigate.push("/login")
      }
      
    } catch (error) {
      console.error('Error saving lead:', error);
      return null;
    } finally {
      setSavingLeadId(null);
    }
  };
  
  const handleLeadClick = async (lead: GeneratedLead) => {
    // Save the lead first, then navigate
    if(user) {
        const leadId = await saveLead(lead);
        if (leadId) {
        navigate.push(`/account/leads/${leadId}`);
        }
    }
    else {
        //save lead to localStorage 
        const tempLeadId = `temp-${Date.now()}`;
        const leadData = {
            ...lead,
            id: tempLeadId,
        };
        localStorage.setItem('tempLead', JSON.stringify(leadData));
        navigate.push(`/business/${tempLeadId}`);
    }
  };

  // Generate leads when dashboard opens or search parameters change
  useEffect(() => {
    const fetchLeads = async () => {

      setLoading(true);
      setError(null);

      try {
        const specialtyData = FREELANCING_SPECIALTIES[0];

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
          searchTerm: searchTerm !== "" ? searchTerm : filters.signals[Math.floor(Math.random() * filters.signals.length)] || searchTerm,
          specialty: searchTerm,
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
  }, [user?.uid, searchTerm, selectedLocation, selectedIndustry]);

  return (
    <>
        <Topbar />
      <div className="flex lg:flex-row flex-col gap-4 md:p-4 h-full max-w-[900px] mx-auto">

        <div className=" w-full p-4 flex flex-col gap-4 mb-6 md:border border-gray/[0.09] bg-gray/[0.03] md:rounded-lg">
          <div>
            <h1 className="text-2xl font-medium mb-2">Discover</h1>
            <p className="opacity-[0.6]">Leads based on your specialization:</p>
          </div>
          
          <div className="relative">
            <div className="absolute z-[1] top-[8%] left-[2%] w-[96%] h-[84%] btn-bg p-2 backdrop-blur-[15px] rounded-[12px] bg-opacity-80 ">
            </div>
            <div className="relative flex flex-col gap-3 p-4 shadow-[4px_4px_20px_#0000000A] rounded-[20px] border border-gray/[0.1] bg-background z-[2]">
            
              <div className="flex items-start gap-4 z-2">
                <Link href="/account" className="w-10 h-10 rounded-full bg-primary/[0.2] border border-gray/[0.2] flex items-center justify-center font-semibold flex-shrink-0">
                  <Image src={"/profile.jpg"} width={40} height={40} className="rounded-full" alt="Profile" />
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
                </div>
                
                <Button 
                  onClick={() => setSearchTerm(searchQuery || searchQuery || '')}
                  className="px-6 py-2 rounded-lg text-white hover:bg-primary-dark text-sm font-medium"
                >
                  Search
                </Button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between py-4">
            <p className="opacity-[0.5]">Current search: <span className="font-semibold">{searchTerm || searchQuery}</span></p>
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
              <Button href="/find-businesses" variant="secondary">
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
      </div>
    </>
  )
}

export default FindBusinesses