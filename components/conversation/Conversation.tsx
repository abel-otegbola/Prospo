'use client';
import { useCallback, useEffect, useState } from 'react';
import Button from '../button/Button';
import type { Lead } from '../../contexts/LeadsContextValue';

interface Props {
  lead: Lead;
}

interface CompanyInsights {
  summary: string;
  whatTheyOffer: string[];
  whatIsUnique: string[];
  improvements: string[];
  conversationAngles: string[];
  confidence: 'low' | 'medium' | 'high';
}

export default function Conversation({ lead }: Props) {
  const [message, setMessage] = useState('');
  const [generated, setGenerated] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [insights, setInsights] = useState<CompanyInsights | null>(null);
  const [insightsLoading, setInsightsLoading] = useState(false);
  const [insightsError, setInsightsError] = useState<string | null>(null);

  const fetchCompanyInsights = useCallback(async () => {
    if (!lead?.company) return;

    setInsightsError(null);
    setInsightsLoading(true);
    try {
      const resp = await fetch('/api/gemini/company-insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lead })
      });

      if (!resp.ok) throw new Error(`Server error: ${resp.status}`);
      const data = await resp.json();
      if (data?.insights) {
        setInsights(data.insights as CompanyInsights);
      } else {
        throw new Error('Missing insights payload');
      }
    } catch (err) {
      console.error('Failed to fetch company insights:', err);
      setInsightsError('Could not analyze this company right now.');
    } finally {
      setInsightsLoading(false);
    }
  }, [lead]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setInsights(null);
    fetchCompanyInsights();
  }, [lead.id, fetchCompanyInsights]);

  const handleGenerate = async () => {
    setError(null);
    setLoading(true);
    try {
      const resp = await fetch('/api/gemini/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lead, companyInsights: insights })
      });
      if (!resp.ok) throw new Error(`Server error: ${resp.status}`);
      const data = await resp.json();
      setGenerated(data.text || data.output || '');
      setMessage(data.text || data.output || '');
    } catch {
      setError('Could not generate outreach right now. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSend = () => {
    // open mail client with generated text
    const to = lead.email || '';
    const subject = encodeURIComponent(`Grow ${lead.company || lead.name}'s website and revenue`);
    const body = encodeURIComponent(message || generated || 'Hi,\n\n');
    window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
  };

  return (
    <div className="conversation-component">
      <div className="mb-5 rounded-lg min-h-[340px]">
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm opacity-[0.6] font-medium">About Company</label>
          <Button size="small" className='rounded-lg' variant="secondary" onClick={fetchCompanyInsights} disabled={insightsLoading}>
            {insightsLoading ? 'Analyzing...' : 'Refresh'}
          </Button>
        </div>

        {insightsLoading && <p className="text-sm opacity-[0.6]">Analyzing company and website context...</p>}
        {insightsError && <p className="text-sm text-red-600">{insightsError}</p>}

        {!insightsLoading && !insightsError && insights && (
          <div className="text-sm opacity-[0.6] space-y-3">
            <div>
              <p className="text-xs uppercase tracking-wide opacity-[0.6] mb-1">Summary</p>
              <p>{insights.summary}</p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wide opacity-[0.6] mb-1">What They Offer</p>
              <ul className="list-disc pl-5 space-y-1">
                {insights.whatTheyOffer?.map((item, idx) => (
                  <li key={`offer-${idx}`}>{item}</li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wide opacity-[0.6] mb-1">What Is Unique</p>
              <ul className="list-disc pl-5 space-y-1">
                {insights.whatIsUnique?.map((item, idx) => (
                  <li key={`unique-${idx}`}>{item}</li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wide opacity-[0.6] mb-1">Improvement Opportunities</p>
              <ul className="list-disc pl-5 space-y-1">
                {insights.improvements?.map((item, idx) => (
                  <li key={`improvement-${idx}`}>{item}</li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wide opacity-[0.6] mb-1">Conversation Angles</p>
              <ul className="list-disc pl-5 space-y-1">
                {insights.conversationAngles?.map((item, idx) => (
                  <li key={`angle-${idx}`}>{item}</li>
                ))}
              </ul>
            </div>

            <p className="text-xs text-gray/">Confidence: {insights.confidence}</p>
          </div>
        )}
      </div>

      <div className="mb-2 relative ">
        <textarea
          className="w-full min-h-[120px] border border-gray/[0.1] focus:outline-none shadow-[4px_4px_20px_#0000000A] rounded-[12px] p-4 px-4 z-[2] relative bg-background"
          value={message || generated || ''}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Generate a personalized outreach message"
        />
      </div>

      {error && <p className="text-red-600 mb-2">{error}</p>}

      <div className="flex gap-2">
        <Button onClick={handleGenerate} disabled={loading || !lead}>
          {loading ? 'Generating...' : 'Generate Message'}
        </Button>
        <Button onClick={handleSend} disabled={!message && !generated}>Send Email</Button>
      </div>
    </div>
  );
}
