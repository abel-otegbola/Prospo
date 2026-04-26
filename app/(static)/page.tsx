'use client';
import { useEffect } from "react"
import LineCircleIcon from "../../assets/icons/lineCircle"
import Button from "../../components/button/Button"
import Topbar from "../../components/topbar/topbar"
import Footer from "../../components/footer/Footer"
import AOS from 'aos'
import 'aos/dist/aos.css'
import OutreachIcon from "../../assets/icons/outreach"
import LeadGenIcon from "../../assets/icons/leadGen"
import CrmIcon from "../../assets/icons/crm"
import FeatureLeadGenIcon from "../../assets/icons/featureLeadGen"
import FeatureOutreachIcon from "../../assets/icons/featureOutreach"
import FeatureCrmIcon from "../../assets/icons/featureCrm"
import FeatureSocialIcon from "../../assets/icons/featureSocial"
import HeroImg from "../../assets/icons/hero-img"
import FaqSection from "../../components/faqSection/FaqSection"
import CheckIcon from "@/assets/icons/check"

function Homepage() {
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

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      easing: 'ease-in-out'
    })
  }, [])

  return (
    <div className="overflow-hidden">
            
        <Topbar />

        <header className="relative flex flex-col items-center justify-between min-h-[500px] gap-8 lg:gap-12 lg:px-[8%] md:px-9 px-4 max-[400px]:px-0 py-12 md:py-12">
            <div className="absolute top-[20%] left-[25%] w-[50%] h-[20%] z-[1] btn-bg-hero p-2 rounded-[80px]"  />
            <div className="flex flex-col items-center text-center gap-4 md:max-w-3xl max-w-lg md:p-6 z-[2]" data-aos="fade-up">
                <div className="relative flex items-center bg-background/[0.2] md:text-xs text-[10px] p-1 pr-4 sm:pr-3 rounded-full border border-gray/[0.09] w-fit gap-2 text-xs sm:text-sm shadow mb-4">
                    <span className="px-2 sm:px-3 py-1 rounded-full bg-black text-white font-medium">Hire</span>
                    <span className="font-medium">Start connecting with potential clients</span>
                </div>
                <h1 className="font-bold max-[420px]:text-3xl text-4xl lg:text-6xl leading-tight sm:leading-tight md:leading-tight lg:leading-[64px] md:px-0 sm:px-4">
                    Find Clients Who  <br/>Already Need Your Skills
                </h1>
                <p className="opacity-[0.8] md:w-[75%] w-[90%] md:mb-8 mb-4 max-w-xl leading-[28px]">
                    Prospo helps you discover businesses that need your expertise and connect you directly with potential clients.
                </p>
                <div className="flex items-center gap-4">
                    <Button href="/signup">Get Started</Button>
                    <Button href="/login" variant="secondary">Discover Businesses</Button>
                </div>
            </div>
            <div className="w-full flex items-center justify-center md:mt-[-32px] lg:-mt-16 z-[2]" data-aos="fade-up" data-aos-delay="200">
                <HeroImg text={"var(--text)"} fill={"var(--background)"} />
            </div>
        </header>

        {/* <section className="relative flex flex-col gap-4 py-8 md:px-[8%] px-4 bg-gray/[0.05]">
            <h2 className="text-2xl font-medium mb-2 text-center">Personalized categories</h2>
            <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-6">
            {
                SPECIALTY_CATEGORIES.slice(0, 6).map(category => (
                    <div key={category} className={`rounded-[20px] p-4 bg-cover bg-center bg-background border border-gray/[0.2] text-white flex flex-col justify-between h-[200px]`} style={{ backgroundImage: `url('/categories/${category}.png')` }} data-aos="fade-up">
                        <h3 className="flex gap-2 items-center font-light"># {category} <ArrowRight /></h3>
                        <p className="flex flex-wrap w-full gap-1">{FREELANCING_SPECIALTIES.filter(item => item.category === category).slice(0,4).map(industry => (
                            <span key={industry.label} className="text-[12px] px-3 py-1 rounded-full border border-gray-200/[0.3]">{industry.label}</span>
                        )) }</p>
                    </div>
                ))
            }
            </div>
        </section> */}

        <section className="flex justify-center flex-col items-center gap-6 py-8 md:px-[8%] px-4 mt-[40px]">
            <div className="flex flex-col items-center justify-center gap-5 md:w-1/2 text-center">
                <div className="max-w-[308px] flex items-center gap-4">
                    <LineCircleIcon className="flex-1 "/>
                    <span className="px-4 py-2 bg-primary/10 rounded-full text-primary font-medium text-nowrap md:text-[12px] text-[10px]">Why Prospo</span>
                    <LineCircleIcon className="flex-1 rotate-180" />
                </div>
                <h1 className="xl:text-4xl sm:text-2xl text-2xl font-semibold">A smarter way for <br /> freelancers to find clients</h1>
                <p>Prospo helps you discover businesses that may need your skills and reach out with smart, personalized messages.</p>
            </div>

            <div className="grid md:grid-cols-3 grid-cols-1 gap-4 md:gap-8 mt-12 md:px-0">
                {
                    [
                        { id: 1, title: "Discover Client Opportunities", text: "Find businesses that may need your service. Prospo surfaces opportunities so you don't have to search endlessly for freelance jobs.", img: <LeadGenIcon /> },
                        { id: 2, title: "Smart Outreach Messages", text: "Generate personalized outreach messages designed to help freelancers get replies and start conversations with potential clients.", img: <OutreachIcon text={"var(--text)"} fill={"var(--background)"} /> },
                        { id: 3, title: "Track Revenue", text: "Keep track of your revenue in one place so you never miss a potential project.", img: <CrmIcon text={"var(--text)"} fill={"var(--background)"} /> },
                    ].map(step => (
                        <div key={step.id} className="relative flex flex-col gap-4 p-3" data-aos="fade-up" data-aos-delay="100">
                            <div className="absolute top-[20%] left-[30%] w-[70%] h-[10%] btn-bg-hero p-2 rounded-[80px]"  />
                            <div className="w-full">{step.img}</div>
                            <h1 className="text-4xl opacity-[0.1] font-bold">0{step.id}</h1>
                            <h2 className="font-semibold text-lg">{step.title}</h2>
                            <p className="text-sm opacity-[0.6]">{step.text}</p>
                        </div>
                    ))
                }
            </div>
        </section>

        <section className="flex justify-center flex-col items-center gap-6 py-8 md:px-[8%] px-4 mt-[40px]">
            <div className="flex flex-col items-center justify-center gap-5 md:w-1/2 text-center" data-aos="fade-up">
                <div className="max-w-[268px] flex items-center gap-4 w-full">
                    <LineCircleIcon className="flex-1 "/>
                    <span className="px-4 py-2 bg-primary/10 rounded-full text-primary font-medium text-sm text-nowrap md:text-[12px] text-[10px]">Features</span>
                    <LineCircleIcon className="flex-1 rotate-180" />
                </div>
                <h1 className="xl:text-4xl sm:text-2xl text-2xl font-semibold">Features Built for Freelancers</h1>
                <p>Prospo helps freelancers discover opportunities, connect with businesses, and grow their client base faster.</p>
            </div>

            <div className="flex gap-6 md:flex-row flex-col">
                <div className="relative w-full md:w-1/2 flex flex-col gap-6">
                    <div className="absolute top-[20%] left-0 w-[50%] h-[30%] btn-bg-hero p-2 rounded-[80px]"  />
                    <div className="flex gap-4 flex-col md:p-10 p-4 rounded-lg border border-gray/[0.1] bg-gray/[0.04]" data-aos="fade-right" data-aos-delay="100"> 
                        <FeatureLeadGenIcon
                            text={"var(--text)"} fill={"var(--background)"}
                            className="w-full h-auto object-contain p-12 dark:bg-black bg-white rounded-lg"
                        />
                        <div className="flex flex-col gap-2">
                            <h2 className="font-semibold text-lg">Find Businesses That Need Your Skills</h2>
                            <p className="text-sm opacity-[0.6]">Discover potential clients across different industries who may benefit from your expertise.</p>
                        </div>
                    </div>
                    <div className="flex gap-4 flex-col md:p-10 p-4 rounded-lg border border-gray/[0.1] bg-gray/[0.04]" data-aos="fade-left" data-aos-delay="100">
                        <FeatureCrmIcon text={"var(--text)"} fill={"var(--background)"} className="w-full h-auto object-contain p-9 dark:bg-black bg-white rounded-lg" />
                        <div className="flex flex-col gap-2">
                            <h2 className="font-semibold text-lg">Track Outreach and Replies</h2>
                            <p className="text-sm opacity-[0.6]">Manage your conversations, follow up with leads, and keep track of potential projects in one simple dashboard.</p>
                        </div>
                    </div>
                </div>
                <div className="relative w-full md:w-1/2 flex flex-col gap-6 mt-6 md:mt-0">
                    <div className="absolute top-[20%] left-0 w-[50%] h-[30%] btn-bg-hero p-2 rounded-[80px]"  />
                    <div className="flex gap-4 flex-col md:p-10 p-4 rounded-lg border border-gray/[0.1] bg-gray/[0.04]" data-aos="fade-right" data-aos-delay="200">
                        <FeatureOutreachIcon text={"var(--text)"} fill={"var(--background)"} className="w-full h-auto object-contain p-4 dark:bg-black bg-white rounded-lg" />
                        <div className="flex flex-col gap-2">
                            <h2 className="font-semibold text-lg">AI-Generated Outreach Messages</h2>
                            <p className="text-sm opacity-[0.6]">Create personalized messages that help you introduce your services and increase the chances of getting client replies.</p>
                        </div>
                    </div>
                    <div className="flex gap-4 flex-col md:p-10 p-4 rounded-lg border border-gray/[0.1] bg-gray/[0.04]" data-aos="fade-left" data-aos-delay="200">
                        <FeatureSocialIcon text={"var(--text)"} fill={"var(--background)"} className="w-full h-auto object-contain p-12 dark:bg-black bg-white rounded-lg" />
                        <div className="flex flex-col gap-2">
                            <h2 className="font-semibold text-lg">Understand Each Lead Better</h2>
                            <p className="text-sm opacity-[0.6]">Get helpful information about potential clients so you can personalize your outreach and offer the right solution.</p>
                        </div>
                    </div>
                </div>
            </div>

        </section>

        <section className="flex justify-center flex-col items-center gap-6 py-8 md:px-[8%] px-4 mt-[40px]">
            <div className="flex flex-col items-center justify-center gap-5 md:w-1/2 text-center" data-aos="fade-up">
                <div className="max-w-[320px] flex items-center gap-4 w-full">
                    <LineCircleIcon className="flex-1 "/>
                    <span className="px-4 py-2 bg-primary/10 rounded-full text-primary font-medium text-nowrap md:text-[12px] text-[10px]">Pricing</span>
                    <LineCircleIcon className="flex-1 rotate-180" />
                </div>
                <h1 className="xl:text-4xl sm:text-2xl text-2xl font-semibold">Choose the plan that matches your growth</h1>
                <p>Start free, scale as you close more clients, or lock in a one-time founders deal.</p>
            </div>

            <div className="grid lg:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-5 w-full mt-8">
                {pricingPlans.map((plan, index) => (
                    <article
                        key={plan.id}
                        className={`relative rounded-2xl border p-6 flex flex-col gap-5 bg-background ${plan.featured ? 'border-primary shadow-xl shadow-primary/10' : 'border-gray/[0.15]'}`}
                        data-aos="fade-up"
                        data-aos-delay={`${100 + index * 50}`}
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

        <FaqSection sectionClassName="pb-10 mt-16" />

        <section className="relative bg-gray/[0.05] dark:bg-black flex justify-center flex-col items-center gap-6 md:mx-[8%] mx-4 p-[5%] mt-[40px] rounded-lg mb-16" data-aos="fade-in">
        
            <div className="absolute top-[30%] left-[25%] w-[50%] h-[30%] btn-bg-hero p-2 rounded-[80px]"  />
            <h1 className="xl:text-4xl text-2xl font-semibold text-center">Start Finding Clients Today</h1>
            <p className="text-center max-w-2xl">Join freelancers using Prospo to discover opportunities, connect with potential clients, and grow their freelance business.</p>
            <Button href="/signup" className="text-[14px]">Get Started</Button>
        </section>

        <Footer />

    </div>

  )
}

export default Homepage