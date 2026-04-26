import Topbar from "../../../components/topbar/topbar";
import Footer from "../../../components/footer/Footer";
import Button from "../../../components/button/Button";
import LineCircleIcon from "../../../assets/icons/lineCircle";
import FaqSection from "../../../components/faqSection/FaqSection";
import CheckIcon from "@/assets/icons/check";

function Pricing() {

  const pricingPlans = [
        {
            id: 'starter',
            name: 'Free Plan - Starter',
            price: '$0',
            cadence: 'Forever free',
            accent: 'bg-slate-100 text-slate-700',
            purpose: 'Start showcasing your work and attract your first clients with a simple case study and limited outreach.',
            features: [
                '5 leads',
                '1 case study',
                'Basic case study templates',
                'Public profile',
            ],
        },
        {
            id: 'pro',
            name: 'Pro Plan - Growth',
            price: '$5',
            cadence: 'Per month',
            accent: 'bg-sky-100 text-sky-700',
            purpose: 'Increase your visibility and win more clients with more case studies and higher outreach capacity.',
            featured: true,
            features: [
                '50 leads/month',
                '5 case studies',
                'Premium case study templates',
                'Export/share case studies (PDF/link)',
                'Priority listing for more visibility',
            ],
        },
        {
            id: 'enterprise',
            name: 'Enterprise Plan - Scale',
            price: '$15',
            cadence: 'Per month',
            accent: 'bg-violet-100 text-violet-700',
            purpose: 'Scale your client acquisition with unlimited case studies, leads, and advanced tools built for serious growth.',
            features: [
                'Unlimited leads',
                'Unlimited case studies',
                'Advanced analytics (views, clicks, conversions)',
                'Custom branding (white-label case studies)',
                'API access',
            ],
        },
        {
            id: 'lifetime',
            name: 'Lifetime Plan',
            price: '$100',
            cadence: 'One-time payment',
            accent: 'bg-amber-100 text-amber-800',
            purpose: 'Pay once and keep generating leads and showcasing your work without recurring costs.',
            badge: 'Limited Offer',
            features: [
                '100 leads/month',
                '10 case studies',
                'All Pro features',
                'Early adopter badge',
            ],
        },
    ]

  return (
    <div className="min-h-screen">
      <Topbar />

      {/* Pricing Cards */}
       <section className="flex justify-center flex-col items-center gap-6 py-8 md:px-[8%] px-4 mt-[40px]">
            <div className="flex flex-col items-center justify-center gap-5 md:w-2/3 text-center">
                <div className="max-w-[320px] flex items-center gap-4 w-full">
                    <LineCircleIcon className="flex-1 "/>
                    <span className="px-4 py-2 bg-primary/10 rounded-full text-primary font-medium text-nowrap md:text-[12px] text-[10px]">Pricing</span>
                    <LineCircleIcon className="flex-1 rotate-180" />
                </div>
                <h1 className="xl:text-4xl sm:text-2xl text-2xl font-semibold">Choose the plan that matches your growth</h1>
                <p>Start free, scale as you close more clients, or lock in a one-time founders deal.</p>
            </div>

            <div className="grid lg:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-5 w-full mt-8">
                {pricingPlans.map((plan) => (
                    <article
                        key={plan.id}
                        className={`relative rounded-2xl border p-6 flex flex-col gap-5 bg-background ${plan.featured ? 'border-primary shadow-xl shadow-primary/10' : 'border-gray/[0.15]'}`}
                        
                    >
                        <div className="flex items-start justify-between gap-2">
                            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${plan.accent}`}>{plan.name}</span>
                            {plan.badge ? (
                                <span className="text-[11px] uppercase tracking-wide text-amber-700 bg-amber-100 px-2 py-1 rounded-full">{plan.badge}</span>
                            ) : null}
                        </div>

                        <div className="flex flex-col gap-1">
                            <p className="text-3xl font-bold">{plan.price}</p>
                            <p className="text-sm opacity-[0.6]">{plan.cadence}</p>
                        <p className="text-sm opacity-[0.7] mt-auto">{plan.purpose}</p>
                        </div>

                        <ul className="flex flex-col flex-1 gap-2 text-sm opacity-[0.85]">
                            {plan.features.map(feature => (
                                <li key={feature} className="flex items-start gap-2">
                                    <span className="text-green-500 mt-[2px]"><CheckIcon /></span>
                                    <span>{feature}</span>
                                </li>
                            ))}
                        </ul>

                        <Button
                            href="/signup"
                            variant={plan.featured ? 'primary' : 'secondary'}
                            className="w-full justify-center"
                        >
                            {plan.id === 'starter' ? 'Start Free' : 'Choose Plan'}
                        </Button>
                    </article>
                ))}
            </div>
        </section>

      <FaqSection />

      <Footer />
    </div>
  );
}

export default Pricing;
