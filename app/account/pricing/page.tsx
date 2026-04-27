'use client';
import { useContext, useState } from "react";
import CheckIcon from "@/assets/icons/check";
import Button from "@/components/button/Button";
import { UserProfileContext } from "@/contexts/UserProfileContextValue";
import { AuthContext } from "@/contexts/AuthContextValue";
import LoadingIcon from "@/assets/icons/loadingIcon";

export default function Pricing() {
    const { user } = useContext(AuthContext);
    const { profile } = useContext(UserProfileContext);
    const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
    const [error, setError] = useState<string>("");

    const currentPlan = profile?.current_plan || 'free';

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

    const handlePlanSelection = async (planId: string) => {
        if (planId === 'starter') {
            // Free plan doesn't need payment
            return;
        }

        if (!user) {
            setError('Please log in to upgrade your plan');
            return;
        }

        if (planId === currentPlan) {
            setError(`You are already on the ${planId} plan`);
            return;
        }

        setLoadingPlan(planId);
        setError("");

        try {
            const response = await fetch('/api/dodo/create-checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user.uid,
                    userEmail: user.email,
                    targetPlan: planId,
                    currentPlan: currentPlan,
                    origin: typeof window !== 'undefined' ? window.location.origin : '',
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to initiate checkout');
            }

            const data = await response.json();

            if (data.checkoutUrl) {
                // Redirect to Dodo checkout page using Object.assign
                Object.assign(window.location, { href: data.checkoutUrl });
            } else {
                throw new Error('No checkout URL received');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to process payment');
            setLoadingPlan(null);
        }
    };

    return (
        <div className="p-4 md:p-6">
            <div className="mb-8">
                <h1 className="text-2xl font-medium mb-2">Pricing</h1>
                <h1 className="">Choose the plan that matches your growth</h1>
                <p>Start free, scale as you close more clients, or lock in a one-time founders deal.</p>
                {currentPlan !== 'free' && (
                    <p className="text-sm text-primary font-medium mt-2">
                        Current Plan: <span className="capitalize">{currentPlan}</span>
                    </p>
                )}
            </div>

            {error && (
                <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                    {error}
                </div>
            )}

            <div className="grid lg:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-5 w-full mt-8">
                {pricingPlans.map((plan) => (
                    <article
                        key={plan.id}
                        className={`relative rounded-2xl border p-6 flex flex-col gap-5 bg-background ${
                            plan.featured ? 'border-primary shadow-xl shadow-primary/10' : 'border-gray/[0.15]'
                        } ${currentPlan === plan.id ? 'ring-2 ring-primary' : ''}`}
                    >
                        <div className="flex items-start justify-between gap-2">
                            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${plan.accent}`}>
                                {plan.name}
                            </span>
                            {plan.badge ? (
                                <span className="text-[11px] uppercase tracking-wide text-amber-700 bg-amber-100 px-2 py-1 rounded-full">
                                    {plan.badge}
                                </span>
                            ) : null}
                            {currentPlan === plan.id && (
                                <span className="text-[11px] uppercase tracking-wide text-green-700 bg-green-100 px-2 py-1 rounded-full ml-auto">
                                    Active
                                </span>
                            )}
                        </div>

                        <div className="flex flex-col gap-1">
                            <p className="text-3xl font-bold">{plan.price}</p>
                            <p className="text-sm opacity-[0.6]">{plan.cadence}</p>
                            <p className="text-sm opacity-[0.7] mt-auto">{plan.purpose}</p>
                        </div>

                        <ul className="flex flex-col flex-1 gap-2 text-sm opacity-[0.85]">
                            {plan.features.map(feature => (
                                <li key={feature} className="flex items-start gap-2">
                                    <span className="text-green-500 mt-[2px]">
                                        <CheckIcon />
                                    </span>
                                    <span>{feature}</span>
                                </li>
                            ))}
                        </ul>

                        <Button
                            onClick={() => handlePlanSelection(plan.id)}
                            disabled={currentPlan === plan.id || loadingPlan === plan.id}
                            variant={plan.featured ? 'primary' : 'secondary'}
                            className="w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loadingPlan === plan.id ? (
                                <LoadingIcon color="white" className="animate-spin w-[20px]" />
                            ) : plan.id === 'starter' ? (
                                'Start Free'
                            ) : currentPlan === plan.id ? (
                                'Current Plan'
                            ) : (
                                'Choose Plan'
                            )}
                        </Button>
                    </article>
                ))}
            </div>
        </div>
    )
}