import Topbar from "../../../components/topbar/topbar";
import Footer from "../../../components/footer/Footer";
import Button from "../../../components/button/Button";

function Integrations() {
  const integrations = [
    {
      name: "Salesforce",
      description: "Sync your leads and contacts with Salesforce CRM",
      logo: "🔷",
      category: "CRM",
      status: "Available"
    },
    {
      name: "HubSpot",
      description: "Connect your HubSpot account for seamless data flow",
      logo: "🟠",
      category: "CRM",
      status: "Available"
    },
    {
      name: "Slack",
      description: "Get instant notifications about new leads in Slack",
      logo: "💬",
      category: "Communication",
      status: "Available"
    },
    {
      name: "Gmail",
      description: "Send and track emails directly from Prospo",
      logo: "✉️",
      category: "Email",
      status: "Available"
    },
    {
      name: "Outlook",
      description: "Integrate with Microsoft Outlook for email campaigns",
      logo: "📧",
      category: "Email",
      status: "Available"
    },
    {
      name: "Zapier",
      description: "Connect Prospo with 5,000+ apps via Zapier",
      logo: "⚡",
      category: "Automation",
      status: "Available"
    },
    {
      name: "LinkedIn",
      description: "Import leads directly from LinkedIn Sales Navigator",
      logo: "💼",
      category: "Lead Generation",
      status: "Available"
    },
    {
      name: "Google Sheets",
      description: "Export and sync your data with Google Sheets",
      logo: "📊",
      category: "Productivity",
      status: "Available"
    },
    {
      name: "Stripe",
      description: "Process payments and manage subscriptions",
      logo: "💳",
      category: "Payment",
      status: "Coming Soon"
    },
    {
      name: "Zoom",
      description: "Schedule and track meetings with leads",
      logo: "🎥",
      category: "Communication",
      status: "Coming Soon"
    },
    {
      name: "Calendly",
      description: "Automate meeting scheduling with prospects",
      logo: "📅",
      category: "Scheduling",
      status: "Coming Soon"
    },
    {
      name: "Intercom",
      description: "Engage with leads through live chat",
      logo: "💭",
      category: "Support",
      status: "Coming Soon"
    }
  ];

  const categories = ["All", "CRM", "Email", "Communication", "Automation", "Lead Generation", "Productivity", "Payment", "Scheduling", "Support"];

  return (
    <div className="min-h-screen overflow-hidden">
      <Topbar />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-16 max-w-7xl mx-auto">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
          <div className="inline-block px-4 py-2 bg-primary/10 rounded-full text-primary font-medium text-sm mb-6">
            30+ Integrations
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            Connect Prospo with Your Favorite Tools
          </h1>
          <p className="text-lg opacity-[0.6] dark:text-gray/ mb-8">
            Seamlessly integrate with the tools you already use. Build powerful workflows and automate your sales process.
          </p>
          <Button href="/signup">Start Free Trial</Button>
        </div>
      </section>

      {/* Categories Filter */}
      <section className="px-4 sm:px-6 lg:px-16 max-w-7xl mx-auto mb-12">
        <div className="flex flex-wrap gap-3 justify-center">
          {categories.map((category) => (
            <button
              key={category}
              className="px-4 py-2 rounded-full border border-gray-200 dark:border-gray-700 hover:border-primary hover:text-primary transition-all text-sm font-medium"
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      {/* Integrations Grid */}
      <section className="px-4 sm:px-6 lg:px-16 max-w-7xl mx-auto pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {integrations.map((integration, index) => (
            <div
              key={index}
              className="p-6 rounded-xl border border-gray/[0.2] hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="text-4xl">{integration.logo}</div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  integration.status === "Available" 
                    ? "bg-green-100/[0.2] text-green-700 dark:text-green-400"
                    : "bg-yellow-100/[0.2] text-yellow-700  dark:text-yellow-400"
                }`}>
                  {integration.status}
                </span>
              </div>
              <h3 className="text-xl font-semibold mb-2">{integration.name}</h3>
              <p className="text-sm opacity-[0.6] dark:text-gray/ mb-4">
                {integration.description}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs opacity-[0.6] dark:opacity-[0.6]">{integration.category}</span>
                <button className="text-sm text-primary font-medium hover:underline">
                  {integration.status === "Available" ? "Connect" : "Learn More"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 sm:px-6 lg:px-16 max-w-7xl mx-auto pb-20">
        <div className="bg-gradient-to-r from-primary to-fuchsia-500 rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Can&apos;t Find Your Integration?</h2>
          <p className="text-lg mb-8 opacity-90">
            Request a new integration or build your own using our powerful API
          </p>
          <div className="flex gap-4 justify-center">
            <Button variant="secondary" className="bg-background text-primary hover:bg-gray-100">
              Request Integration
            </Button>
            <Button variant="secondary" className="bg-background/20 text-white hover:bg-background/30 border-white">
              View API Docs
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Integrations;
