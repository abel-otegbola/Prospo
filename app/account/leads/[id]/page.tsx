'use client'
import { useEffect, useState, useContext } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Lead, LeadsContext } from '@/contexts/LeadsContextValue';
import { useModal } from '@/contexts/useModal';
import LoadingIcon from '@/assets/icons/loadingIcon';
import Button from '@/components/button/Button';
import Image from 'next/image';
import Conversation from '@/components/conversation/Conversation';
import { findLeadEmail } from '@/helpers/emailFinder';
import Link from 'next/link';

export default function LeadDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useRouter();
  const { getSingleLead, updateLead, leads } = useContext(LeadsContext);
  const { showModal } = useModal();
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const data = await getSingleLead(id);
        if (mounted) {setLead(data)};
      } catch (err) {
        console.error('Error fetching lead details', err);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [id, getSingleLead]);

  if (loading) return (
    <div className="p-6">
      <LoadingIcon />
    </div>
  );

  if (!lead) return (
    <div className="p-6">
      <p>Lead not found.</p>
      <Button onClick={() => navigate.push('/account/leads')}>Back to Leads</Button>
    </div>
  );

  return (
    <div className="md:p-6 p-2 min-h-screen">
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className='w-full pb-2'>
          <div className='flex gap-2 items-center p-1'>
            <div className="flex items-center gap-4">
              {lead?.logoUrl ? (
              <Image
                src={lead.logoUrl} 
                alt={`${lead.company} logo`}
                width={24}
                height={24}
                className="w-12 h-12 rounded-full object-cover flex-shrink-0 border border-gray/[0.1]"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.nextElementSibling?.classList.remove('hidden');
                }}
              />
              ) : null}
              <div 
                className={`w-12 h-12 bg-slate-100/[0.3] rounded-full flex items-center justify-center font-bold flex-shrink-0 border border-gray/[0.1] ${lead?.logoUrl ? 'hidden' : ''}`}
              >
                {lead?.company.charAt(0).toUpperCase()}
              </div>
            </div>
            <div>
              <h1 className="text-xl font-semibold">{lead.company}</h1>
              <p className="text-sm opacity-[0.6]">{lead.industry}</p>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="flex flex-col md:col-span-2 bg-background border border-gray/[0.1] rounded-lg p-4">
          <Conversation lead={lead} />
        </div>
        <div className='flex flex-col gap-4 text-[14px] w-full'>
          <div className="w-full bg-background rounded-lg border border-gray/[0.2] pb-4">
            <p className="bg-gray/[0.03] px-4 py-4 font-medium mb-2 border-b border-gray/[0.2] flex items-center gap-2">
              Contacts
            </p>
            <p className="px-4 py-1 flex flex-col">
              <span className='font-medium text-[12px] opacity-50'>Email:</span> 
              { !lead.email ? <button className='underline text-primary' onClick={() => findLeadEmail({
                leadId: lead.id,
                companyWebsite: lead.companyWebsite,
                companyName: lead.company,
                leads,
                updateLead,
                showModal
              }) }>Search for email</button> : 
              <Link href={`mailto:${lead.email}`} className='text-primary hover:underline'>
                {lead.email || '—'}
              </Link> 
              }
            </p>
            <p className="px-4 py-1 flex flex-col">
              <span className='font-medium text-[12px] opacity-50'>Phone:</span> 
              <Link href={`tel:${lead.phone}`} className='text-primary hover:underline'>
                {typeof lead.phone === 'string' && lead.phone ? lead.phone : '—'}
              </Link>
            </p>
            <p className="px-4 py-1 flex flex-col">
              <span className='font-medium text-[12px] opacity-50'>Location:</span> 
              <span className=''>{lead.location || '—'}</span>
            </p>
            <p className="px-4 py-1 flex flex-col">
              <span className='font-medium text-[12px] opacity-50'>Website:</span> 
              <Link href={lead.companyWebsite || '#'} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-xs break-all">
                {lead.companyWebsite || '—'}
              </Link>
            </p>
          </div>

          <div className="bg-background rounded-lg border border-gray/[0.2] bg-background pb-4">
            <p className="bg-gray/[0.03] px-4 py-4 font-medium mb-2 border-b border-gray/[0.2] flex items-center gap-2">
              Socials
            </p>
            {[
              { label: 'LinkedIn', url: lead.linkedinUrl },
              { label: 'Twitter', url: lead.twitterUrl },
              { label: 'Facebook', url: lead.facebookUrl },
            ].map((social) => (
              <p key={social.label} className="px-4 py-1 flex flex-col">
                <span className='font-medium text-[12px] opacity-50'>{social.label}:</span>
                {social.url ? (
                  <a href={social.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-xs break-all">
                    {social.url}
                  </a>
                ) : (
                  <span className=''>—</span>
                )}
              </p>
            ))}
          </div>

          <div className="bg-background rounded-lg border border-gray/[0.2] bg-background pb-2">
            
            <div className="bg-gray/[0.03] flex gap-4 justify-between mb-2 p-4 border-b border-gray/[0.2]">
              <p className=" text-sm font-medium flex items-center gap-2 font-semibold"> 
                Opportunity
              </p>
            </div>
            <p className="px-4 py-1 flex flex-col">
              <span className='font-medium text-[12px] opacity-50'>Value</span> 
              <span className=''>${lead.value || '—'}</span>
            </p>
            <p className="px-4 py-1 flex flex-col">
              <span className='font-medium text-[12px] opacity-50'>Score</span> 
              <span className=''>{lead.score || '—'}</span>
            </p>
            
          </div>
        </div>

      </div>
    </div>
  );
}
