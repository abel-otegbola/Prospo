import Topbar from "../../../components/topbar/topbar";
import Footer from "../../../components/footer/Footer";
import Button from "../../../components/button/Button";

function Solutions() {
  const solutions = [
    {
      title: "Sales Teams",
      description: "Empower your sales team with qualified leads and automated outreach",
      icon: "💼",
      features: [
        "Lead scoring & prioritization",
        "Automated follow-ups",
        "Sales pipeline management",
        "Performance analytics",
        "Team collaboration tools"
      ],
      cta: "Learn More",
      link: "/solutions/sales"
    },
    {
      title: "Marketing Teams",
      description: "Drive campaigns with data-driven insights and targeted lead lists",
      icon: "📊",
      features: [
        "Campaign management",
        "Lead segmentation",
        "Email marketing automation",
        "ROI tracking",
        "Multi-channel attribution"
      ],
      cta: "Learn More",
      link: "/solutions/marketing"
    },
    {
      title: "Startups",
      description: "Grow fast with lean resources and maximum impact",
      icon: "🚀",
      features: [
        "Affordable pricing",
        "Quick setup",
        "Scalable infrastructure",
        "Founder-friendly tools",
        "Growth analytics"
      ],
      cta: "Learn More",
      link: "/solutions/startups"
    },
    {
      title: "Enterprise",
      description: "Enterprise-grade security and customization for large organizations",
      icon: "🏢",
      features: [
        "Advanced security",
        "Custom integrations",
        "Dedicated support",
        "SLA guarantees",
        "White-label options"
      ],
      cta: "Learn More",
      link: "/solutions/enterprise"
    }
  ];

  const caseStudies = [
    {
      company: "TechCorp Inc.",
      industry: "SaaS",
      result: "300% increase in qualified leads",
      testimonial: "Prospo transformed our sales process completely.",
      logo: "🏢"
    },
    {
      company: "Growth Agency",
      industry: "Marketing",
      result: "50% reduction in lead gen costs",
      testimonial: "Best investment we've made for our agency.",
      logo: "📈"
    },
    {
      company: "StartupXYZ",
      industry: "E-commerce",
      result: "$1M ARR in 6 months",
      testimonial: "Couldn't have scaled this fast without Prospo.",
      logo: "🛒"
    }
  ];

  return (
    <div className="min-h-screen">
      <Topbar />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-16 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-block px-4 py-2 bg-primary/10 rounded-full text-primary font-medium text-sm mb-6">
            Solutions for Every Team
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            Built for Your Business Model
          </h1>
          <p className="text-lg opacity-[0.6] dark:text-gray/ mb-8">
            Whether you&apos;re a startup, agency, or enterprise, Prospo adapts to your unique needs and scales with your growth.
          </p>
        </div>
      </section>

      {/* Solutions Grid */}
      <section className="px-4 sm:px-6 lg:px-16 max-w-7xl mx-auto pb-20">
        <div className="grid md:grid-cols-2 gap-8">
          {solutions.map((solution, index) => (
            <div
              key={index}
              className="p-8 rounded-2xl border border-gray-200 dark:border-gray-800 hover:shadow-xl transition-all duration-300 bg-background "
            >
              <div className="text-5xl mb-4">{solution.icon}</div>
              <h3 className="text-2xl font-bold mb-3">{solution.title}</h3>
              <p className="opacity-[0.6] dark:text-gray/ mb-6">
                {solution.description}
              </p>
              
              <ul className="space-y-3 mb-8">
                {solution.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm opacity-[0.6] dark:text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button variant="secondary" className="w-full">
                {solution.cta}
              </Button>
            </div>
          ))}
        </div>
      </section>

      {/* Industry Focus Section */}
      <section className="bg-gray-50  py-20">
        <div className="px-4 sm:px-6 lg:px-16 max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Industries We Serve</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[
              { name: "SaaS", icon: "💻" },
              { name: "E-commerce", icon: "🛍️" },
              { name: "Real Estate", icon: "🏠" },
              { name: "Finance", icon: "💰" },
              { name: "Healthcare", icon: "🏥" },
              { name: "Education", icon: "🎓" }
            ].map((industry, index) => (
              <div
                key={index}
                className="text-center p-6 bg-background dark:bg-gray-700 rounded-xl hover:shadow-lg transition-all"
              >
                <div className="text-4xl mb-3">{industry.icon}</div>
                <div className="font-semibold">{industry.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Case Studies Section */}
      <section className="px-4 sm:px-6 lg:px-16 max-w-7xl mx-auto py-20">
        <h2 className="text-3xl font-bold text-center mb-4">Success Stories</h2>
        <p className="text-center opacity-[0.6] dark:text-gray/ mb-12">
          See how businesses like yours are growing with Prospo
        </p>
        <div className="grid md:grid-cols-3 gap-8">
          {caseStudies.map((study, index) => (
            <div
              key={index}
              className="p-6 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 border border-gray-200 dark:border-gray-600"
            >
              <div className="text-4xl mb-4">{study.logo}</div>
              <h3 className="font-bold text-lg mb-2">{study.company}</h3>
              <div className="text-sm opacity-[0.6] dark:text-gray/ mb-4">{study.industry}</div>
              <div className="text-2xl font-bold text-primary mb-4">{study.result}</div>
              <p className="text-sm italic opacity-[0.6] dark:text-gray-300">
                &apos;{study.testimonial}&apos;
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 sm:px-6 lg:px-16 max-w-7xl mx-auto pb-20">
        <div className="bg-gradient-to-r from-primary to-fuchsia-500 rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-lg mb-8 opacity-90">
            Join thousands of teams already growing with Prospo
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="secondary" className="bg-background text-primary hover:bg-gray-100">
              Start Free Trial
            </Button>
            <Button variant="secondary" className="bg-background/20 text-white hover:bg-background/30 border-white">
              Schedule Demo
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Solutions;
